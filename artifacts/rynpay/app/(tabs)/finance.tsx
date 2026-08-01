import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const INCOME_DATA = [120000, 85000, 210000, 160000, 95000, 180000, 220000];
const EXPENSE_DATA = [80000, 60000, 140000, 110000, 75000, 130000, 170000];

const QUICK_TRANSFERS = [
  { name: 'David Damian', phone: '090 314 6372', initials: 'DD', color: '#6366F1' },
  { name: 'Amina Solomon', phone: '703 940 370', initials: 'AS', color: '#22C55E' },
  { name: 'Brand Design', phone: '230 279 278', initials: 'BD', color: '#F59E0B' },
];

export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const maxVal = Math.max(...INCOME_DATA, ...EXPENSE_DATA);

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      <LinearGradient
        colors={['#1076C9', '#0047A3']}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>Finance</Text>
        <TouchableOpacity onPress={() => router.push('/transactions')}>
          <Text style={styles.historyLink}>Full History</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Tab toggle */}
      <View style={styles.tabWrap}>
        {(['overview', 'history'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'overview' ? 'Overview' : 'Transactions'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80, paddingTop: 12 }}
      >
        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <LinearGradient colors={['#22C55E', '#16A34A']} style={styles.summaryCard}>
            <Ionicons name="arrow-down-circle-outline" size={22} color="rgba(255,255,255,0.8)" />
            <Text style={styles.summaryLabel}>Total Income</Text>
            <Text style={styles.summaryAmount}>₦220,000</Text>
            <Text style={styles.summaryChange}>+12% this month</Text>
          </LinearGradient>
          <LinearGradient colors={['#EF4444', '#DC2626']} style={styles.summaryCard}>
            <Ionicons name="arrow-up-circle-outline" size={22} color="rgba(255,255,255,0.8)" />
            <Text style={styles.summaryLabel}>Total Expenses</Text>
            <Text style={styles.summaryAmount}>₦170,000</Text>
            <Text style={styles.summaryChange}>-5% this month</Text>
          </LinearGradient>
        </View>

        {/* Bar chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Jul 2026 Activity</Text>
          <View style={styles.chart}>
            {MONTHS.map((m, i) => (
              <View key={m} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View
                    style={[
                      styles.bar,
                      styles.incomeBar,
                      { height: (INCOME_DATA[i] / maxVal) * 100 },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.expenseBar,
                      { height: (EXPENSE_DATA[i] / maxVal) * 100 },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel}>{m}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendText}>Expenses</Text>
            </View>
          </View>
        </View>

        {/* Quick Transfer */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Transfer</Text>
            <TouchableOpacity onPress={() => router.push('/transfer')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactsRow}>
            {QUICK_TRANSFERS.map((c) => (
              <TouchableOpacity key={c.name} style={styles.contactItem} onPress={() => router.push('/transfer')}>
                <View style={[styles.contactAvatar, { backgroundColor: c.color }]}>
                  <Text style={styles.contactInitials}>{c.initials}</Text>
                </View>
                <Text style={styles.contactName} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.contactItem} onPress={() => router.push('/transfer')}>
              <View style={[styles.contactAvatar, { backgroundColor: '#F1F5F9' }]}>
                <Ionicons name="add" size={22} color="#1076C9" />
              </View>
              <Text style={styles.contactName}>New</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Savings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Goals</Text>
          <Text style={styles.sectionSub}>Track your financial goals</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalInfo}>
              <Ionicons name="home-outline" size={24} color="#1076C9" />
              <View>
                <Text style={styles.goalName}>New Phone</Text>
                <Text style={styles.goalSaved}>₦45,000 of ₦150,000</Text>
              </View>
            </View>
            <View style={styles.goalBar}>
              <View style={[styles.goalFill, { width: '30%' }]} />
            </View>
            <Text style={styles.goalPct}>30%</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20, paddingBottom: 20,
    flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  historyLink: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: 'Inter_500Medium' },
  tabWrap: {
    flexDirection: 'row', backgroundColor: '#fff',
    paddingHorizontal: 16, paddingVertical: 10, gap: 8,
    borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  tabBtn: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  tabBtnActive: { backgroundColor: '#EBF4FF' },
  tabText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: '#64748B' },
  tabTextActive: { color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  summaryCard: {
    flex: 1, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3,
  },
  summaryLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular', marginTop: 8 },
  summaryAmount: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff', marginTop: 2 },
  summaryChange: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  chartSection: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 4 },
  sectionSub: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular', marginBottom: 14 },
  chart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 110, marginVertical: 12 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, flex: 1 },
  bar: { width: 8, borderRadius: 4 },
  incomeBar: { backgroundColor: '#22C55E' },
  expenseBar: { backgroundColor: '#EF4444' },
  barLabel: { fontSize: 10, color: '#94A3B8', fontFamily: 'Inter_400Regular' },
  legend: { flexDirection: 'row', gap: 20, justifyContent: 'center', marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular' },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12,
    borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_500Medium' },
  contactsRow: { flexDirection: 'row', gap: 16 },
  contactItem: { alignItems: 'center', gap: 6 },
  contactAvatar: {
    width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
  },
  contactInitials: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  contactName: { fontSize: 12, color: '#0F172A', fontFamily: 'Inter_500Medium', maxWidth: 52, textAlign: 'center' },
  goalCard: { gap: 10 },
  goalInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  goalName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#0F172A' },
  goalSaved: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular' },
  goalBar: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  goalFill: { height: '100%', backgroundColor: '#1076C9', borderRadius: 4 },
  goalPct: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
});
