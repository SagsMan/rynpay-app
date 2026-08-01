import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, Modal,
  Platform, Easing, Image, Pressable,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import RyngetLogo from '@/components/RyngetLogo';

const native = Platform.OS !== 'web';

// Mask phone: 08101234567 → 810****011
function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return phone;
  const start = digits.slice(-11, -8) || digits.slice(0, 3);
  const end = digits.slice(-3);
  return `${start}****${end}`;
}

// ─── Fingerprint SVG-style icon via Unicode ──────────────────────────────────
function FingerprintIcon({ size = 72, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name="finger-print-outline" size={size} color={color} />
    </View>
  );
}

// ─── Pulsing ring animation around fingerprint ────────────────────────────────
function PulsingFingerprint() {
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1.25, duration: 900, useNativeDriver: native, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulseOpacity, { toValue: 0, duration: 900, useNativeDriver: native }),
        ]),
        Animated.parallel([
          Animated.timing(pulse, { toValue: 1, duration: 0, useNativeDriver: native }),
          Animated.timing(pulseOpacity, { toValue: 0.6, duration: 0, useNativeDriver: native }),
        ]),
      ]),
    ).start();
  }, []);

  return (
    <View style={styles.pulseWrap}>
      {/* Pulsing ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          { transform: [{ scale: pulse }], opacity: pulseOpacity },
        ]}
      />
      {/* Icon container */}
      <View style={styles.fpIconCircle}>
        <FingerprintIcon size={48} color='#0F172A' />
      </View>
    </View>
  );
}

// ─── Bottom sheet modal ───────────────────────────────────────────────────────
function VerifySheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0, tension: 65, friction: 11, useNativeDriver: native,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300, duration: 220, useNativeDriver: native, easing: Easing.in(Easing.quad),
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
          {/* Handle */}
          <View style={styles.sheetHandle} />
          {/* Close button */}
          <TouchableOpacity style={styles.sheetClose} onPress={onClose}>
            <Ionicons name="close" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Verifying fingerprint</Text>

          <PulsingFingerprint />

          <Text style={styles.sheetHint}>Touch the fingerprint sensor</Text>
          <View style={{ height: 32 }} />
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────
function WelcomeToast({ name, visible }: { name: string; visible: boolean }) {
  const insets = useSafeAreaInsets();
  const topAnim = useRef(new Animated.Value(-80)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(topAnim, { toValue: 0, tension: 80, friction: 10, useNativeDriver: native }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: native }),
      ]).start();
    }
  }, [visible]);

  const topOffset = Platform.OS === 'web' ? 24 : (insets.top + 8);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          top: topOffset,
          transform: [{ translateY: topAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View style={styles.toastIcon}>
        <Ionicons name="checkmark-circle" size={22} color="#1076C9" />
      </View>
      <Text style={styles.toastText}>Welcome back, {name}</Text>
    </Animated.View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function BiometricLoginScreen() {
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Processing: R logo bouncing in
  const processingScale = useRef(new Animated.Value(0)).current;
  const processingOpacity = useRef(new Animated.Value(0)).current;

  const handleVerify = useCallback(() => {
    setSheetVisible(true);
    // Simulate fingerprint sensor read after 1.5s
    setTimeout(() => {
      setSheetVisible(false);
      // Brief pause then show processing
      setTimeout(() => {
        setProcessing(true);
        Animated.parallel([
          Animated.spring(processingScale, { toValue: 1, tension: 80, friction: 8, useNativeDriver: native }),
          Animated.timing(processingOpacity, { toValue: 1, duration: 200, useNativeDriver: native }),
        ]).start();
        // Show welcome toast after 0.8s
        setTimeout(() => {
          setToastVisible(true);
          // Navigate after toast shows for 1.2s
          setTimeout(() => {
            router.replace('/(tabs)');
          }, 1200);
        }, 800);
      }, 300);
    }, 1600);
  }, []);

  const handleSwitchAccount = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handlePasswordLogin = () => {
    router.replace('/(auth)/login');
  };

  const maskedPhone = user ? maskPhone(user.phone) : '***';
  const displayName = user?.name?.toUpperCase() ?? 'USER';
  const firstName = user?.name ?? 'User';

  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { paddingBottom: bottomPad }]}>
      {/* Background overlay when processing */}
      {processing && <View style={styles.processingOverlay} />}

      {/* Logo */}
      <View style={[styles.logoRow, { paddingTop: Platform.OS === 'web' ? 56 : insets.top + 20 }]}>
        <RyngetLogo size={36} showText />
      </View>

      {/* Main content */}
      <View style={styles.body}>
        {/* Avatar */}
        <View style={styles.avatarRing}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>

        {/* Name + masked phone */}
        <Text style={styles.userName}>{displayName} ({maskedPhone})</Text>

        {/* Spacer */}
        <View style={{ height: 52 }} />

        {/* Fingerprint */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleVerify}
          style={styles.fpTouchable}
        >
          <FingerprintIcon size={80} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>

        <Text style={styles.hint}>Click to log in with Fingerprint</Text>

        {/* Verify button */}
        <TouchableOpacity
          style={styles.verifyBtn}
          activeOpacity={0.85}
          onPress={handleVerify}
        >
          <Text style={styles.verifyBtnText}>Verify Fingerprint</Text>
        </TouchableOpacity>
      </View>

      {/* Processing: floating R logo */}
      {processing && (
        <Animated.View
          style={[
            styles.processingLogo,
            { opacity: processingOpacity, transform: [{ scale: processingScale }] },
          ]}
        >
          <Image
            source={require('@/assets/images/logo-r.png')}
            style={styles.processingLogoImg}
            resizeMode="contain"
          />
        </Animated.View>
      )}

      {/* Bottom links */}
      {!processing && (
        <View style={styles.bottomLinks}>
          <TouchableOpacity onPress={handleSwitchAccount}>
            <Text style={styles.bottomLink}>Switch Account</Text>
          </TouchableOpacity>
          <Text style={styles.bottomDivider}>  |  </Text>
          <TouchableOpacity onPress={handlePasswordLogin}>
            <Text style={styles.bottomLink}>Login with Password</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom sheet */}
      <VerifySheet visible={sheetVisible} onClose={() => setSheetVisible(false)} />

      {/* Welcome toast */}
      <WelcomeToast name={firstName} visible={toastVisible} />
    </View>
  );
}

const DARK_BG = '#1A1D2E';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
    alignItems: 'center',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 1,
  },

  // Logo row
  logoRow: {
    alignSelf: 'center',
    paddingHorizontal: 24,
  },

  // Body
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 0,
  },

  // Avatar
  avatarRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    borderWidth: 2,
    borderColor: '#A78BFA',
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#3B4A6B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 36,
    color: '#fff',
    fontFamily: 'Inter_700Bold',
  },
  userName: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Inter_500Medium',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 0,
  },

  // Fingerprint
  fpTouchable: {
    marginBottom: 16,
  },

  hint: {
    fontSize: 14,
    color: '#1076C9',
    fontFamily: 'Inter_500Medium',
    marginBottom: 32,
  },

  // Verify button
  verifyBtn: {
    width: 260,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1076C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyBtnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },

  // Processing logo
  processingLogo: {
    position: 'absolute',
    top: '42%',
    alignSelf: 'center',
    zIndex: 10,
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 16,
    padding: 8,
  },
  processingLogoImg: {
    width: 60,
    height: 60,
  },

  // Bottom links
  bottomLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  bottomLink: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'Inter_500Medium',
  },
  bottomDivider: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.3)',
  },

  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 28,
    paddingTop: 12,
    paddingBottom: 40,
    alignItems: 'center',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  sheetClose: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    color: '#0F172A',
    fontFamily: 'Inter_600SemiBold',
    marginTop: 8,
    marginBottom: 32,
  },

  // Pulsing fingerprint
  pulseWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FCA5A5',
  },
  fpIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetHint: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
  },

  // Toast
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
    shadowOpacity: 0.15,
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
  toastText: {
    fontSize: 15,
    color: '#0F172A',
    fontFamily: 'Inter_600SemiBold',
  },
});
