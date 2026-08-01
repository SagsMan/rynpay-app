import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SectionList, TouchableOpacity, Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface TxItem {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'successful' | 'pending' | 'failed';
}

const SECTIONS = [
  {
    title: 'Jul 2026',
    data: [
      { id: '1', name: 'Transfer Received', date: 'Jul 3rd, 01:26:45', amount: 500, type: 'credit', status: 'successful' },
      { id: '2', name: 'Transfer Received', date: 'Jul 3rd, 01:26:45', amount: 500, type: 'credit', status: 'successful' },
      { id: '3', name: 'Airtime Purchase', date: 'Jul 5th, 10:15:22', amount: 200, type: 'debit', status: 'successful' },
      { id: '4', name: 'Bank Transfer', date: 'Jul 10th, 14:33:11', amount: 2500, type: 'debit', status: 'successful' },
      { id: '5', name: 'Transfer Received', date: 'Jul 15th, 09:02:44', amount: 1000, type: 'credit', status: 'successful' },
      { id: '6', name: 'Data Purchase', date: 'Jul 20th, 16:50:30', amount: 300, type: 'debit', status: 'successful' },
    ] as TxItem[],
    summary: { in: 5000, out: 5000 },
  },
  {
    title: 'Jun 2026',
    data: [
      { id: '7', name: 'Transfer Received', date: 'Jun 3rd, 01:26:45', amount: 500, type: 'credit', status: 'successful' },
      { id: '8', name: 'Transfer Received', date: 'Jun 3rd, 01:26:45', amount: 500, type: 'credit', status: 'successful' },
      { id: '9', name: 'Airtime Purchase', date: 'Jun 7th, 12:00:00', amount: 100, type: 'debit', status: 'successful' },
      { id: '10', name: 'TV Subscription', date: 'Jun 15th, 08:30:00', amount: 4500, type: 'debit', status: 'successful' },
    ] as TxItem[],
    summary: { in: 5000, out: 5000 },
  },
];

const STATUS_COLORS: Record<string, string> = {
  successful: '#22C55E',
  pending: '#F59E0B',
  failed: '#EF4444',
};

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('All categories');
  const [status, setStatus] = useState('All Status');
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const renderItem = ({ item }: { item: TxItem }) => (
    <TouchableOpacity style={styles.txRow} activeOpacity={0.75}>
      <View style={[styles.txIcon, { backgroundColor: item.type === 'credit' ? '#DCFCE7' : '#FEF3C7' }]}>
        <Ionicons
          name={item.type === 'credit' ? 'arrow-down' : 'arrow-up'}
          size={18}
          color={item.type === 'credit' ? '#22C55E' : '#F59E0B'}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txName}>{item.name}</Text>
        <Text style={styles.txDate}>{item.date}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: item.type === 'credit' ? '#22C55E' : '#0F172A' }]}>
          {item.type === 'credit' ? '+' : '-'}₦{item.amount.toLocaleString()}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[item.status]}20` }]}>
          <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: typeof SECTIONS[0] }) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionLeft}>
        <TouchableOpacity style={styles.monthRow}>
          <Text style={styles.monthTitle}>{section.title}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>
        <Text style={styles.monthSummary}>
          In <Text style={styles.inAmt}>₦{section.summary.in.toLocaleString()}</Text>{'   '}
          Out <Text style={styles.outAmt}>₦{section.summary.out.toLocaleString()}</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.analysisBadge}>
        <Text style={styles.analysisText}>Analysis</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      <View style={[styles.topBar, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Transactions</Text>
        <TouchableOpacity><Text style={styles.downloadLink}>Download</Text></TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>{filter}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterText}>{status}</Text>
          <Ionicons name="chevron-down" size={14} color="#64748B" />
        </TouchableOpacity>
      </View>

      <SectionList
        sections={SECTIONS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14,
    backgroundColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#0F172A', textAlign: 'center' },
  downloadLink: { fontSize: 14, color: '#1076C9', fontFamily: 'Inter_500Medium' },
  filtersRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff' },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#F8FAFC',
  },
  filterText: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_500Medium' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8, backgroundColor: '#EEF3FC',
  },
  sectionLeft: { gap: 3 },
  monthRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  monthTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A' },
  monthSummary: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#64748B' },
  inAmt: { color: '#22C55E', fontFamily: 'Inter_600SemiBold' },
  outAmt: { color: '#EF4444', fontFamily: 'Inter_600SemiBold' },
  analysisBadge: { backgroundColor: '#1076C9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  analysisText: { fontSize: 12, color: '#fff', fontFamily: 'Inter_600SemiBold' },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 1,
    padding: 14, borderRadius: 0,
  },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txInfo: { flex: 1 },
  txName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#0F172A' },
  txDate: { fontSize: 12, fontFamily: 'Inter_400Regular', color: '#94A3B8', marginTop: 2 },
  txRight: { alignItems: 'flex-end', gap: 4 },
  txAmount: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontFamily: 'Inter_600SemiBold', textTransform: 'capitalize' },
});
