import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', icon: 'person-outline', label: 'Personal Information', chevron: true },
      { id: 'security', icon: 'shield-checkmark-outline', label: 'Security Settings', chevron: true },
      { id: 'autologout', icon: 'timer-outline', label: 'Auto-logout Settings', chevron: true },
      { id: 'biometrics', icon: 'finger-print-outline', label: 'Biometrics Login', toggle: true, value: true },
    ],
  },
  {
    title: 'Services',
    items: [
      { id: 'kyc', icon: 'card-outline', label: 'KYC Verification', chevron: true, badge: 'Verified' },
      { id: 'referral', icon: 'people-outline', label: 'Referral Program', chevron: true },
      { id: 'safebox', icon: 'lock-closed-outline', label: 'Safebox', chevron: true },
      { id: 'loan', icon: 'cash-outline', label: 'Loan', chevron: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'faq', icon: 'help-circle-outline', label: 'FAQ & Help Center', chevron: true },
      { id: 'chat', icon: 'chatbubble-ellipses-outline', label: 'Live Chat Support', chevron: true },
      { id: 'call', icon: 'call-outline', label: 'Call: 09000011', chevron: false },
      { id: 'about', icon: 'information-circle-outline', label: 'About RynGet Pay', chevron: true },
    ],
  },
];

export default function MeScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      {/* Header */}
      <LinearGradient
        colors={['#1076C9', '#0047A3']}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#6366F1', '#4F46E5']} style={styles.avatar}>
              <Text style={styles.avatarText}>{(user?.name ?? 'U').charAt(0).toUpperCase()}</Text>
            </LinearGradient>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user?.name ?? 'User'}</Text>
          <Text style={styles.profilePhone}>+234 {user?.phone ?? '---'}</Text>
          <View style={styles.profileTags}>
            <View style={styles.tag}>
              <Ionicons name="shield-checkmark" size={12} color="#22C55E" />
              <Text style={styles.tagText}>Verified</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: '#EBF4FF' }]}>
              <Text style={[styles.tagText, { color: '#1076C9' }]}>
                {user?.userType === 'agent' ? 'Agent' : 'Personal'}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Balance', value: `₦${(user?.balance ?? 0).toLocaleString('en-NG', { maximumFractionDigits: 0 })}` },
            { label: 'Reward Pts', value: '2,450' },
            { label: 'Referrals', value: '12' },
          ].map((s, i) => (
            <View key={i} style={[styles.statItem, i < 2 && styles.statDivider]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Menu sections */}
        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    idx < section.items.length - 1 && styles.menuItemBorder,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={20} color="#1076C9" />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <View style={styles.menuRight}>
                    {'badge' in item && item.badge && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>{item.badge}</Text>
                      </View>
                    )}
                    {'chevron' in item && item.chevron && (
                      <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>RynGet Pay v1.0.0 · Licensed by CBN · Insured by NDIC</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileCard: {
    backgroundColor: '#fff', margin: 16, borderRadius: 18, padding: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 32, fontFamily: 'Inter_700Bold', color: '#fff' },
  editAvatarBtn: {
    position: 'absolute', bottom: 0, right: 0, width: 26, height: 26,
    borderRadius: 13, backgroundColor: '#1076C9', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  profileName: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 4 },
  profilePhone: { fontSize: 14, color: '#64748B', fontFamily: 'Inter_400Regular', marginBottom: 12 },
  profileTags: { flexDirection: 'row', gap: 8 },
  tag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4,
  },
  tagText: { fontSize: 12, color: '#16A34A', fontFamily: 'Inter_600SemiBold' },
  statsRow: {
    backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 14,
    flexDirection: 'row', overflow: 'hidden', marginBottom: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statDivider: { borderRightWidth: 1, borderRightColor: '#F1F5F9' },
  statValue: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A' },
  statLabel: { fontSize: 11, color: '#64748B', fontFamily: 'Inter_400Regular', marginTop: 2 },
  menuSection: { marginHorizontal: 16, marginTop: 14 },
  menuSectionTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#64748B', marginBottom: 8, paddingLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  menuCard: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EBF4FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium', color: '#0F172A' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  verifiedBadge: { backgroundColor: '#DCFCE7', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  verifiedText: { fontSize: 11, color: '#16A34A', fontFamily: 'Inter_600SemiBold' },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, marginTop: 20, marginBottom: 12,
    backgroundColor: '#FEF2F2', borderRadius: 14, paddingVertical: 16,
    borderWidth: 1, borderColor: '#FECACA',
  },
  logoutText: { fontSize: 15, color: '#EF4444', fontFamily: 'Inter_600SemiBold' },
  versionText: { textAlign: 'center', fontSize: 11, color: '#94A3B8', fontFamily: 'Inter_400Regular', paddingBottom: 4 },
});
