import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '@/components/PrimaryButton';

const OPTIONS = [
  {
    id: 'personal' as const,
    title: 'Personal Wallet',
    description: 'Perfect for everyday payments. Send money, buy airtime and data, pay bills, and manage your wallet with ease.',
    icon: 'person-outline',
  },
  {
    id: 'agent' as const,
    title: 'Agent Mode',
    description: 'Built for resellers and business owners. Buy airtime in bulk, generate and distribute to customers on every sale.',
    icon: 'briefcase-outline',
  },
];

export default function UserTypeScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<'personal' | 'agent'>('personal');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleNext = () => {
    router.push({ pathname: '/(auth)/signup', params: { userType: selected } });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#EEF3FC' }}
      contentContainerStyle={[styles.container, { paddingTop: topPad + 16, paddingBottom: bottomPad + 24 }]}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color="#0F172A" />
      </TouchableOpacity>

      <Text style={styles.heading}>How do you plan to use{'\n'}RynGet Pay?</Text>
      <Text style={styles.subheading}>Choose the experience that's right for you. You can always upgrade to Agent Mode later.</Text>

      <View style={styles.options}>
        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.85}
            style={[
              styles.optionCard,
              selected === opt.id && styles.optionCardSelected,
            ]}
          >
            <View style={styles.optionRow}>
              <View style={[
                styles.radio,
                selected === opt.id ? styles.radioSelected : styles.radioUnselected,
              ]}>
                {selected === opt.id && <View style={styles.radioDot} />}
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <PrimaryButton title="Next" onPress={handleNext} style={styles.nextBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, alignItems: 'flex-start', justifyContent: 'center', marginBottom: 12 },
  heading: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#0F172A', lineHeight: 32, marginBottom: 10 },
  subheading: { fontSize: 14, color: '#64748B', lineHeight: 22, fontFamily: 'Inter_400Regular', marginBottom: 28 },
  options: { gap: 14, marginBottom: 32 },
  optionCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  optionCardSelected: { borderColor: '#1076C9', backgroundColor: '#F0F7FF' },
  optionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  radio: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0 },
  radioUnselected: { borderWidth: 1.5, borderColor: '#94A3B8' },
  radioSelected: { borderWidth: 1.5, borderColor: '#1076C9', backgroundColor: '#EBF4FF' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1076C9' },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0F172A', marginBottom: 6 },
  optionDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#64748B', lineHeight: 20 },
  nextBtn: { width: '100%' },
});
