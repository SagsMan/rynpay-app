import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Easing, Image, Platform,
} from 'react-native';

// useNativeDriver works on iOS/Android but not web
const native = Platform.OS !== 'web';
import { Redirect, router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function SplashScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo pops in
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: native,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 7,
          useNativeDriver: native,
        }),
      ]),
      // Brand name appears
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 380,
        delay: 100,
        useNativeDriver: native,
        easing: Easing.out(Easing.quad),
      }),
      // Tagline appears
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 380,
        delay: 80,
        useNativeDriver: native,
        easing: Easing.out(Easing.quad),
      }),
      // Footer appears + hold
      Animated.timing(footerOpacity, {
        toValue: 1,
        duration: 300,
        delay: 80,
        useNativeDriver: native,
      }),
      // Hold for 1s
      Animated.delay(1000),
      // Fade entire splash out
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 380,
        useNativeDriver: native,
        easing: Easing.in(Easing.quad),
      }),
    ]).start(() => onDone());
  }, []);

  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
      {/* Logo mark */}
      <View style={styles.centerGroup}>
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <Image
            source={require('@/assets/images/logo-r.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Brand name */}
        <Animated.Text style={[styles.brandName, { opacity: textOpacity }]}>
          RynGet
        </Animated.Text>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          The Future of Banking
        </Animated.Text>
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, { paddingBottom: bottomPad + 20, opacity: footerOpacity }]}>
        <View style={styles.cbnBadge}>
          <Text style={styles.cbnIcon}>🏛️</Text>
          <Text style={styles.footerText}>
            Licensed by the <Text style={styles.footerBold}>CBN</Text> and Insured by the{' '}
            <Text style={styles.footerBold}>NDIC</Text>
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function Index() {
  const { hasSeenOnboarding, isAuthenticated, isLoading } = useAuth();
  const [splashDone, setSplashDone] = React.useState(false);

  // Determine where to navigate after splash
  const navigate = () => {
    if (!hasSeenOnboarding) {
      router.replace('/(onboarding)');
    } else if (!isAuthenticated) {
      router.replace('/(auth)/login');
    } else {
      // Returning user → re-authenticate with biometrics
      router.replace('/(auth)/biometric-login');
    }
  };

  const handleSplashDone = () => {
    if (!isLoading) {
      navigate();
    } else {
      setSplashDone(true);
    }
  };

  // If auth loaded after splash finished, navigate now
  useEffect(() => {
    if (splashDone && !isLoading) {
      navigate();
    }
  }, [splashDone, isLoading]);

  return <SplashScreen onDone={handleSplashDone} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 12,
  },
  brandName: {
    fontSize: 40,
    color: '#1076C9',
    fontFamily: 'Inter_700Bold',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 20,
    color: '#1C1C2E',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'italic',
    letterSpacing: 0.2,
    opacity: 0.85,
  },
  footer: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  cbnBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cbnIcon: {
    fontSize: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.1,
  },
  footerBold: {
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
});
