import React, { useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Dimensions,
  TouchableOpacity, Platform, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import PrimaryButton from '@/components/PrimaryButton';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    highlight: 'Everyday',
    titlePre: 'Your',
    titlePost: 'Wallet',
    description: 'Send money, Fund wallet, buy airtime, purchase data, and pay bills–all from one secure app',
    image: require('@/assets/images/hero-card-illustration.png'),
  },
  {
    id: 2,
    highlight: 'Smarter',
    titlePre: 'Payments That Work',
    titlePost: '',
    description: 'Enjoy instant transfers with seamless automatic network detection bank account & airtime purchase',
    image: require('@/assets/images/onboarding-slide2.png'),
  },
  {
    id: 3,
    highlight: 'Bulk Airtime',
    titlePre: 'Access to',
    titlePost: 'purchase and printing',
    description: 'Activate Agent Mode to buy airtime in bulk, generate PINs instantly, and earn commission',
    image: require('@/assets/images/onboarding-slide3.png'),
  },
  {
    id: 4,
    highlight: 'Endless Possibilities',
    titlePre: 'One Wallet,',
    titlePost: '',
    description: "Whether you're paying everyday bills or building a business, RynGet Pay gives you the tools to do more",
    image: require('@/assets/images/onboarding-slide4.png'),
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboarding } = useAuth();

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const handleCreateAccount = async () => {
    await completeOnboarding();
    router.push('/(onboarding)/user-type');
  };

  const handleLogin = async () => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { paddingTop: topPad }]}>
      {/* RynGet wordmark */}
      <View style={styles.header}>
        <Text style={styles.wordmark}>RynGet</Text>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.slider}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide, idx) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            <View style={styles.illustration}>
              <Image
                source={slide.image}
                style={styles.slideImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>
              {slide.titlePre ? (
                <Text style={styles.titleNormal}>{slide.titlePre} </Text>
              ) : null}
              <Text style={styles.titleHighlight}>{slide.highlight}</Text>
              {slide.titlePost ? (
                <Text style={styles.titleNormal}>{'\n'}{slide.titlePost}</Text>
              ) : null}
            </Text>

            <Text style={styles.description}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => {
              scrollRef.current?.scrollTo({ x: i * width, animated: true });
              setCurrentIndex(i);
            }}
            style={[styles.dot, i === currentIndex ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      {/* CTAs */}
      <View style={[styles.ctas, { paddingBottom: bottomPad + 24 }]}>
        <PrimaryButton title="Create an Account" onPress={handleCreateAccount} style={styles.btn} />
        <PrimaryButton title="Log in" onPress={handleLogin} variant="outline" style={styles.btn} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
  wordmark: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  slider: { flex: 1 },
  slide: { paddingHorizontal: 20, alignItems: 'center' },
  illustration: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxHeight: 280,
  },
  slideImage: {
    width: '100%',
    height: 260,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 34,
    fontFamily: 'Inter_700Bold',
  },
  titleNormal: { color: '#0F172A' },
  titleHighlight: { color: '#1076C9' },
  description: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    paddingHorizontal: 8,
    fontFamily: 'Inter_400Regular',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 18,
  },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: '#1076C9' },
  dotInactive: { width: 8, backgroundColor: '#CBD5E1' },
  ctas: { paddingHorizontal: 24, gap: 12 },
  btn: { width: '100%' },
});
