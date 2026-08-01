import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '@/components/PrimaryButton';

const OPTIONS = [
  { id: 'passwordFree', label: 'Password-Free Login', desc: 'Keep me logged in until I log out' },
  { id: '60min', label: '60-Mins Password Free Login', desc: 'Keep me logged in for 60 minutes' },
  { id: 'always', label: 'Password Always Needed Login', desc: 'Always ask for a password when I open the app' },
];

export default function AutoLogoutScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('passwordFree');
  const [biometrics, setBiometrics] = useState(true);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.body, { paddingBottom: bottomPad + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Auto-logout Settings</Text>

        {OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.85}
            style={styles.optionRow}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Text style={styles.optionDesc}>{opt.desc}</Text>
            </View>
            <View style={[styles.radio, selected === opt.id && styles.radioSelected]}>
              {selected === opt.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Biometrics Login Option</Text>

        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Log in with Fingerprint</Text>
          <TouchableOpacity
            onPress={() => setBiometrics(!biometrics)}
            style={[styles.toggle, biometrics && styles.toggleActive]}
          >
            <View style={[styles.toggleThumb, biometrics && styles.toggleThumbActive]} />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, minHeight: 40 }} />

        <PrimaryButton
          title="Continue"
          onPress={() => router.replace('/(tabs)')}
          style={styles.btn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  body: { flexGrow: 1, paddingHorizontal: 24 },
  heading: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 24 },
  optionRow: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  optionContent: { flex: 1, paddingRight: 12 },
  optionLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#0F172A', marginBottom: 2 },
  optionDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#64748B', lineHeight: 18 },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#94A3B8',
    alignItems: 'center', justifyContent: 'center', marginTop: 2, flexShrink: 0,
  },
  radioSelected: { borderColor: '#1076C9', backgroundColor: '#EBF4FF' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#1076C9' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0F172A', marginBottom: 16 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { fontSize: 15, fontFamily: 'Inter_400Regular', color: '#0F172A' },
  toggle: {
    width: 50, height: 28, borderRadius: 14, backgroundColor: '#E2E8F0',
    padding: 2, justifyContent: 'center',
  },
  toggleActive: { backgroundColor: '#1076C9' },
  toggleThumb: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2,
  },
  toggleThumbActive: { alignSelf: 'flex-end' },
  btn: { width: '100%', marginTop: 24 },
});
