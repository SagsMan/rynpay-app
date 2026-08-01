import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Animated, Easing, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import PrimaryButton from '@/components/PrimaryButton';
import PhoneInput from '@/components/PhoneInput';
import RyngetLogo from '@/components/RyngetLogo';

const native = Platform.OS !== 'web';

function LoginToast({ visible }: { visible: boolean }) {
  const insets = useSafeAreaInsets();
  const topAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(topAnim, {
          toValue: 0, tension: 80, friction: 10, useNativeDriver: native,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, duration: 200, useNativeDriver: native,
        }),
      ]).start();
    }
  }, [visible]);

  const topOffset = Platform.OS === 'web' ? 24 : insets.top + 8;

  return (
    <Animated.View
      style={[
        styles.toast,
        { top: topOffset, transform: [{ translateY: topAnim }], opacity: opacityAnim },
      ]}
    >
      <View style={styles.toastIcon}>
        <Ionicons name="shield-checkmark" size={20} color="#1076C9" />
      </View>
      <Text style={styles.toastText}>Login Successful</Text>
    </Animated.View>
  );
}

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const processingScale = useRef(new Animated.Value(0)).current;
  const processingOpacity = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleContinue = async () => {
    if (phone.replace(/\D/g, '').length < 7) {
      setError('Please enter a valid phone number or email');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await login(phone);
    } catch {
      setError('Login failed. Please try again.');
      setLoading(false);
      return;
    }

    setLoading(false);

    setProcessing(true);
    Animated.parallel([
      Animated.spring(processingScale, {
        toValue: 1, tension: 80, friction: 8, useNativeDriver: native,
      }),
      Animated.timing(processingOpacity, {
        toValue: 1, duration: 200, useNativeDriver: native,
      }),
    ]).start();

    setTimeout(() => {
      setToastVisible(true);
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1200);
    }, 800);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      {processing && <View style={styles.overlay} />}

      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          disabled={processing}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity disabled={processing}>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: bottomPad + 24 }]}
        keyboardShouldPersistTaps="handled"
        scrollEnabled={!processing}
      >
        <View style={styles.logoWrap}>
          <RyngetLogo size={56} />
        </View>
        <Text style={styles.heading}>Sign in to RynGet Pay</Text>

        <PhoneInput
          value={phone}
          onChangeText={(t) => { setPhone(t); setError(''); }}
          placeholder="Enter your Mobile No./Email"
          showFlag={false}
          keyboardType="email-address"
          error={!!error}
          style={styles.input}
          editable={!processing}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.spacer} />

        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={phone.replace(/\D/g, '').length < 7 || processing}
          style={styles.btn}
        />

        <Text style={styles.signupText}>
          Don't have a RynGet Pay account yet?{' '}
          <Text
            style={styles.signupLink}
            onPress={() => !processing && router.push('/(auth)/signup')}
          >
            Sign Up
          </Text>
        </Text>
      </ScrollView>

      {processing && (
        <Animated.View
          style={[
            styles.processingLogo,
            {
              opacity: processingOpacity,
              transform: [{ scale: processingScale }],
            },
          ]}
        >
          <Image
            source={require('@/assets/images/logo-r.png')}
            style={styles.processingLogoImg}
            resizeMode="contain"
          />
        </Animated.View>
      )}

      <LoginToast visible={toastVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 1,
  },
  processingLogo: {
    position: 'absolute',
    alignSelf: 'center',
    top: '42%',
    zIndex: 10,
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
    padding: 8,
  },
  processingLogoImg: { width: 60, height: 60 },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 999,
  },
  toastIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: { fontSize: 15, color: '#0F172A', fontFamily: 'Inter_600SemiBold' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  helpText: { fontSize: 15, color: '#1076C9', fontFamily: 'Inter_500Medium' },
  body: { flexGrow: 1, paddingHorizontal: 24 },
  logoWrap: { alignItems: 'center', paddingVertical: 32 },
  heading: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 28 },
  input: { marginBottom: 4 },
  errorText: { fontSize: 12, color: '#EF4444', fontFamily: 'Inter_400Regular', marginTop: 4 },
  spacer: { flex: 1, minHeight: 80 },
  btn: { width: '100%', marginBottom: 20 },
  signupText: { textAlign: 'center', fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular' },
  signupLink: { color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
});
