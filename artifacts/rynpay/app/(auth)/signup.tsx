import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import PrimaryButton from '@/components/PrimaryButton';
import PhoneInput from '@/components/PhoneInput';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { userType } = useLocalSearchParams<{ userType: 'personal' | 'agent' }>();
  const { signup } = useAuth();
  const [phone, setPhone] = useState('');
  const [referral, setReferral] = useState('');
  const [showReferral, setShowReferral] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleContinue = async () => {
    if (phone.length < 7) {
      setError('Enter a valid phone number');
      return;
    }
    if (!agreed) {
      Alert.alert('Terms & Conditions', 'Please agree to Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    setLoading(true);
    try {
      await signup(phone, userType ?? 'personal');
      router.push('/(auth)/auto-logout');
    } catch {
      Alert.alert('Signup failed', 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: bottomPad + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Create a RynGet Pay{'\n'}Account</Text>

        <PhoneInput
          value={phone}
          onChangeText={(t) => { setPhone(t); setError(''); }}
          placeholder="Enter your Mobile No."
          showFlag
          error={!!error}
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          onPress={() => setShowReferral(!showReferral)}
          style={[styles.referralToggle, { borderColor: '#E2E8F0' }]}
        >
          <Text style={styles.referralToggleText}>
            {showReferral ? 'Hide referral code' : 'Have a referral code? (Optional)'}
          </Text>
          <Ionicons name={showReferral ? 'chevron-up' : 'chevron-down'} size={18} color="#64748B" />
        </TouchableOpacity>

        {showReferral && (
          <PhoneInput
            value={referral}
            onChangeText={setReferral}
            placeholder="Referral code"
            showFlag={false}
            keyboardType="default"
            style={styles.input}
          />
        )}

        <View style={styles.spacer} />

        <TouchableOpacity
          onPress={() => setAgreed(!agreed)}
          style={styles.termsRow}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
            {agreed && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.termsText}>
            I have read, understood and agree to{' '}
            <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </TouchableOpacity>

        <PrimaryButton
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={!agreed || phone.length < 7}
          style={styles.btn}
        />

        <Text style={styles.loginText}>
          Already have a RynGet Pay Account?{' '}
          <Text style={styles.loginLink} onPress={() => router.replace('/(auth)/login')}>
            Log in
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  helpText: { fontSize: 15, color: '#1076C9', fontFamily: 'Inter_500Medium' },
  body: { flexGrow: 1, paddingHorizontal: 24 },
  heading: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#0F172A', lineHeight: 32, marginBottom: 28 },
  input: { marginBottom: 12 },
  errorText: { fontSize: 12, color: '#EF4444', fontFamily: 'Inter_400Regular', marginTop: -8, marginBottom: 8 },
  referralToggle: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14,
    marginBottom: 12,
  },
  referralToggleText: { fontSize: 14, color: '#64748B', fontFamily: 'Inter_400Regular' },
  spacer: { flex: 1, minHeight: 40 },
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 20 },
  checkbox: {
    width: 20, height: 20, borderRadius: 5, borderWidth: 1.5, borderColor: '#94A3B8',
    alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0,
  },
  checkboxActive: { backgroundColor: '#1076C9', borderColor: '#1076C9' },
  termsText: { flex: 1, fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular', lineHeight: 20 },
  termsLink: { color: '#1076C9', fontFamily: 'Inter_500Medium' },
  btn: { width: '100%', marginBottom: 20 },
  loginText: { textAlign: 'center', fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular' },
  loginLink: { color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
});
