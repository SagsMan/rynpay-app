import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, TextInput, Modal, Alert, Clipboard,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import PrimaryButton from '@/components/PrimaryButton';

type Step = 'recipient' | 'amount' | 'success';

const RECENT_CONTACTS = [
  { id: '1', name: 'David Damian', phone: '9183748372', initials: 'DD', color: '#6366F1' },
  { id: '2', name: 'Amina Solomon', phone: '7039403701', initials: 'AS', color: '#22C55E' },
  { id: '3', name: 'Brand Design Ventures', phone: '2302792781', initials: 'BD', color: '#F59E0B' },
];
const QUICK_AMOUNTS = [500, 1000, 2000, 5000, 9999, 10000];
const TRANSFER_FEE = 50;

function fmtAmount(n: number) {
  return n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtPhone(s: string) {
  // e.g. 9183748372 → 918 374 8372
  return s.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
}
function genTxnId() {
  return '7' + Array.from({ length: 17 }, () => Math.floor(Math.random() * 10)).join('');
}

// ─── Transaction Details screen ───────────────────────────────────────────────
function SuccessScreen({
  resolvedName, recipientPhone, amount, txnId, onClose,
}: {
  resolvedName: string; recipientPhone: string; amount: string; txnId: string; onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const initial = resolvedName.charAt(0);
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const rows = [
    { label: 'Recipient Name', value: resolvedName },
    { label: 'Account No.', value: fmtPhone(recipientPhone), copy: true },
    { label: 'Transaction Type', value: 'RynGet Transfer' },
    { label: 'Payment Method', value: 'Wallet' },
    { label: 'Transaction ID', value: txnId, copy: true },
    { label: 'Transaction Date', value: dateStr },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      {/* Header */}
      <View style={[styles.topBar, { paddingTop: topPad + 8, backgroundColor: '#EEF3FC', borderBottomWidth: 0 }]}>
        <TouchableOpacity onPress={onClose} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Transaction Details</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Ionicons name="headset-outline" size={22} color="#1076C9" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.successBody, { paddingBottom: bottomPad + 24 }]}>
        {/* Logo circle */}
        <View style={[styles.successAvatar, { backgroundColor: '#6366F1' }]}>
          <Text style={styles.successAvatarText}>{initial}</Text>
        </View>
        <Text style={styles.successName}>{resolvedName}</Text>
        <Text style={styles.successAmt}>₦{Number(amount).toLocaleString()}</Text>

        {/* Success badge */}
        <View style={styles.successBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
          <Text style={styles.successBadgeText}>Successful</Text>
        </View>

        {/* Details card */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Transaction Details</Text>
          {rows.map((d, i) => (
            <View key={d.label} style={[styles.detailRow, i === rows.length - 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.detailLabel}>{d.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, maxWidth: '55%' }}>
                <Text style={styles.detailValue} numberOfLines={1}>{d.value}</Text>
                {d.copy && (
                  <TouchableOpacity onPress={() => Clipboard.setString(d.value)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    <Ionicons name="copy-outline" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>

        <PrimaryButton
          title="Share Receipt"
          onPress={() => {}}
          icon={<Ionicons name="share-social-outline" size={18} color="#fff" />}
          style={styles.shareBtn}
        />
      </ScrollView>
    </View>
  );
}

// ─── Payment bottom sheet ─────────────────────────────────────────────────────
function PaymentSheet({
  visible, amount, resolvedName, recipientPhone, walletBalance,
  onPay, onClose, loading,
}: {
  visible: boolean; amount: string; resolvedName: string; recipientPhone: string;
  walletBalance: number; onPay: () => void; onClose: () => void; loading: boolean;
}) {
  const [showReminder, setShowReminder] = useState(false);
  const total = Number(amount) + TRANSFER_FEE;

  const handleXPress = () => setShowReminder(true);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleXPress}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.sheetHandle} />

          {/* Close */}
          <TouchableOpacity onPress={handleXPress} style={styles.sheetClose}>
            <Ionicons name="close" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Payment</Text>
          <Text style={styles.sheetAmount}>₦{total.toLocaleString()}</Text>

          {/* Rows */}
          <View style={styles.sheetRows}>
            {[
              { label: 'Account Number', value: fmtPhone(recipientPhone) },
              { label: 'Name', value: resolvedName },
            ].map((r) => (
              <View key={r.label} style={styles.sheetRow}>
                <Text style={styles.sheetRowLabel}>{r.label}</Text>
                <Text style={styles.sheetRowValue}>{r.value}</Text>
              </View>
            ))}

            {/* Amount with Thousands badge */}
            <View style={styles.sheetRow}>
              <Text style={styles.sheetRowLabel}>Amount</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={styles.thousandsBadge}>
                  <Text style={styles.thousandsBadgeText}>Thousands</Text>
                </View>
                <Text style={styles.sheetRowValue}>₦{fmtAmount(Number(amount))}</Text>
              </View>
            </View>

            {/* Payment Method */}
            <TouchableOpacity style={[styles.sheetRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.sheetRowLabel}>Payment Method</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Wallet Balance */}
            <View style={[styles.sheetRow, { borderBottomWidth: 0, backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12 }]}>
              <Text style={styles.sheetRowLabel}>Wallet Balance</Text>
              <Text style={[styles.sheetRowValue, { color: '#1076C9', fontFamily: 'Inter_700Bold' }]}>
                ₦{fmtAmount(walletBalance)}
              </Text>
            </View>
          </View>

          <PrimaryButton title="Pay" onPress={onPay} loading={loading} style={styles.payBtn} />
        </View>

        {/* Reminder overlay */}
        {showReminder && (
          <View style={styles.reminderOverlay}>
            <View style={styles.reminderCard}>
              <TouchableOpacity style={styles.reminderClose} onPress={() => setShowReminder(false)}>
                <Ionicons name="close" size={20} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.reminderTitle}>Reminder</Text>
              <Text style={styles.reminderSub}>Do you want to cancel this payment?</Text>
              <PrimaryButton
                title="Continue to pay"
                onPress={() => setShowReminder(false)}
                style={styles.reminderBtn}
              />
              <PrimaryButton
                title="Cancel"
                onPress={() => { setShowReminder(false); onClose(); }}
                variant="outline"
                style={styles.reminderBtn}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function TransferScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateBalance } = useAuth();
  const [step, setStep] = useState<Step>('recipient');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [resolvedName, setResolvedName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedAmt, setSelectedAmt] = useState<number | null>(null);
  const [remark, setRemark] = useState('');
  const [tab, setTab] = useState<'recent' | 'favourites'>('recent');
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txnId] = useState(genTxnId);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleResolve = () => {
    if (recipientPhone.length < 7) return;
    setResolvedName('DAVID DAMIAN');
    setStep('amount');
  };

  const handleSelectContact = (c: typeof RECENT_CONTACTS[0]) => {
    setRecipientPhone(c.phone);
    setResolvedName(c.name.toUpperCase());
    setStep('amount');
  };

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    setShowPayment(false);
    updateBalance(-(Number(amount) + TRANSFER_FEE));
    setStep('success');
  };

  if (step === 'success') {
    return (
      <SuccessScreen
        resolvedName={resolvedName}
        recipientPhone={recipientPhone}
        amount={amount}
        txnId={txnId}
        onClose={() => router.back()}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      <View style={[styles.topBar, { paddingTop: topPad + 8, backgroundColor: '#fff' }]}>
        <TouchableOpacity
          onPress={() => step === 'amount' ? setStep('recipient') : router.back()}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Transfer to RynGet Account</Text>
        <TouchableOpacity><Text style={styles.historyLink}>History</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad + 24 }} keyboardShouldPersistTaps="handled">
        {/* Instant badge */}
        <View style={styles.instantBadge}>
          <Ionicons name="flash-outline" size={14} color="#22C55E" />
          <Text style={styles.instantText}>Instant, Zero Issue, Free</Text>
        </View>

        {step === 'recipient' && (
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Recipient Account</Text>
            <View style={styles.recipientRow}>
              <TextInput
                value={recipientPhone}
                onChangeText={setRecipientPhone}
                placeholder="Phone or RynGet account No./Name"
                placeholderTextColor="#CBD5E1"
                keyboardType="phone-pad"
                style={styles.recipientInput}
              />
              <TouchableOpacity style={styles.contactsBtn}>
                <Ionicons name="people-outline" size={20} color="#1076C9" />
              </TouchableOpacity>
            </View>
            {recipientPhone.length >= 7 && (
              <PrimaryButton title="Continue" onPress={handleResolve} style={styles.continueBtn} />
            )}
            {recipientPhone.length < 7 && (
              <Text style={styles.notFoundText}>
                Don't know the recipient's RynGet account number?{' '}
                <Text style={{ color: '#1076C9' }}>Ask them {'>'}</Text>
              </Text>
            )}

            <View style={styles.tabs}>
              {(['recent', 'favourites'] as const).map((t) => (
                <TouchableOpacity key={t} onPress={() => setTab(t)}
                  style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
                >
                  <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {tab === 'recent' ? (
              RECENT_CONTACTS.map((c) => (
                <TouchableOpacity key={c.id} style={styles.contactRow} onPress={() => handleSelectContact(c)}>
                  <View style={[styles.contactAvatar, { backgroundColor: c.color }]}>
                    <Text style={styles.contactInitials}>{c.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.contactName}>{c.name}</Text>
                    <Text style={styles.contactPhone}>{fmtPhone(c.phone)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="star-outline" size={32} color="#CBD5E1" />
                <Text style={styles.emptyText}>No favourites yet</Text>
                <Text style={styles.emptySub}>Add a payee to your Favourites list</Text>
              </View>
            )}

            <TouchableOpacity style={styles.seeWhoRow}>
              <View style={styles.seeWhoIcon}>
                <Ionicons name="people-outline" size={16} color="#1076C9" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.seeWhoText}>See who else is using RynGet</Text>
                <Text style={styles.seeWhoPct}>30% of your contacts use RynGet</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {step === 'amount' && (
          <View style={styles.section}>
            {/* Resolved recipient */}
            <View style={styles.resolvedRow}>
              <View style={[styles.contactAvatar, { backgroundColor: '#6366F1' }]}>
                <Text style={styles.contactInitials}>{resolvedName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.resolvedName}>{resolvedName}</Text>
                <Text style={styles.resolvedPhone}>{fmtPhone(recipientPhone)}</Text>
              </View>
            </View>

            <Text style={styles.fieldLabel}>Amount</Text>
            <View style={styles.amountRow}>
              <Text style={styles.nairaSymbol}>₦</Text>
              <TextInput
                value={amount}
                onChangeText={(t) => { setAmount(t); setSelectedAmt(null); }}
                placeholder="10.00 – 5,000,000.00"
                keyboardType="numeric"
                placeholderTextColor="#CBD5E1"
                style={styles.amountInput}
              />
            </View>

            <View style={styles.quickGrid}>
              {QUICK_AMOUNTS.map((a) => (
                <TouchableOpacity key={a}
                  onPress={() => { setSelectedAmt(a); setAmount(String(a)); }}
                  style={[styles.quickChip, selectedAmt === a && styles.quickChipSelected]}
                >
                  <Text style={[styles.quickChipText, selectedAmt === a && styles.quickChipTextSel]}>
                    ₦{a.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Remark</Text>
            <TextInput
              value={remark}
              onChangeText={setRemark}
              placeholder="What's this for? (Optional)"
              placeholderTextColor="#CBD5E1"
              style={styles.remarkInput}
            />
            <View style={styles.tagRow}>
              {['Purchase', 'Personal'].map((t) => (
                <TouchableOpacity key={t} style={styles.remarkTag}>
                  <Text style={styles.remarkTagText}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <PrimaryButton
              title="Confirm"
              onPress={() => {
                if (!amount || Number(amount) < 10) {
                  Alert.alert('Invalid', 'Minimum transfer is ₦10');
                  return;
                }
                setShowPayment(true);
              }}
              disabled={!amount || Number(amount) < 10}
              style={styles.confirmBtn}
            />
          </View>
        )}
      </ScrollView>

      <PaymentSheet
        visible={showPayment}
        amount={amount}
        resolvedName={resolvedName}
        recipientPhone={recipientPhone}
        walletBalance={user?.balance ?? 0}
        onPay={handlePay}
        onClose={() => setShowPayment(false)}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  topTitle: { flex: 1, fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0F172A', textAlign: 'center' },
  historyLink: { fontSize: 14, color: '#1076C9', fontFamily: 'Inter_500Medium' },
  instantBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
    alignSelf: 'center', marginVertical: 12,
  },
  instantText: { fontSize: 13, color: '#22C55E', fontFamily: 'Inter_600SemiBold' },
  section: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 18, gap: 14 },
  fieldLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#64748B' },
  recipientRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
  },
  recipientInput: { flex: 1, fontSize: 15, color: '#0F172A', fontFamily: 'Inter_400Regular' },
  contactsBtn: { padding: 4 },
  continueBtn: { width: '100%' },
  notFoundText: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { borderBottomWidth: 2, borderBottomColor: '#1076C9' },
  tabText: { fontSize: 14, color: '#94A3B8', fontFamily: 'Inter_500Medium' },
  tabTextActive: { color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  contactRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  contactAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  contactInitials: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  contactName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#0F172A' },
  contactPhone: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular' },
  emptyState: { alignItems: 'center', gap: 6, paddingVertical: 24 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#94A3B8' },
  emptySub: { fontSize: 12, color: '#CBD5E1', fontFamily: 'Inter_400Regular' },
  seeWhoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 8 },
  seeWhoIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#EBF4FF', alignItems: 'center', justifyContent: 'center' },
  seeWhoText: { fontSize: 13, color: '#0F172A', fontFamily: 'Inter_500Medium' },
  seeWhoPct: { fontSize: 11, color: '#64748B', fontFamily: 'Inter_400Regular' },
  resolvedRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  resolvedName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A' },
  resolvedPhone: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular' },
  amountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderBottomWidth: 1.5, borderBottomColor: '#1076C9', paddingBottom: 8,
  },
  nairaSymbol: { fontSize: 22, color: '#0F172A', fontFamily: 'Inter_700Bold' },
  amountInput: { flex: 1, fontSize: 22, color: '#0F172A', fontFamily: 'Inter_600SemiBold' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  quickChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EBF4FF', borderWidth: 1, borderColor: '#DBEAFE' },
  quickChipSelected: { backgroundColor: '#1076C9', borderColor: '#1076C9' },
  quickChipText: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  quickChipTextSel: { color: '#fff' },
  remarkInput: {
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: '#0F172A', fontFamily: 'Inter_400Regular',
  },
  tagRow: { flexDirection: 'row', gap: 8 },
  remarkTag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#F1F5F9', borderWidth: 1, borderColor: '#E2E8F0' },
  remarkTagText: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_500Medium' },
  confirmBtn: { width: '100%' },

  // Payment sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 12 },
  sheetClose: { position: 'absolute', top: 20, right: 20, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0F172A', textAlign: 'center', marginBottom: 4, marginTop: 4 },
  sheetAmount: { fontSize: 38, fontFamily: 'Inter_700Bold', color: '#0F172A', textAlign: 'center', marginBottom: 20 },
  sheetRows: { gap: 0, marginBottom: 20 },
  sheetRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  sheetRowLabel: { fontSize: 14, color: '#64748B', fontFamily: 'Inter_400Regular' },
  sheetRowValue: { fontSize: 14, color: '#0F172A', fontFamily: 'Inter_500Medium' },
  thousandsBadge: {
    backgroundColor: '#EBF4FF', borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  thousandsBadgeText: { fontSize: 11, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  payBtn: { width: '100%' },

  // Reminder modal (inside the sheet overlay)
  reminderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  reminderCard: {
    backgroundColor: '#fff', borderRadius: 24, padding: 28,
    width: '100%', alignItems: 'center', gap: 12,
  },
  reminderClose: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  reminderTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0F172A' },
  reminderSub: { fontSize: 14, color: '#64748B', fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },
  reminderBtn: { width: '100%' },

  // Success screen
  successBody: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 },
  successAvatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  successAvatarText: { fontSize: 32, fontFamily: 'Inter_700Bold', color: '#fff' },
  successName: { fontSize: 15, color: '#64748B', fontFamily: 'Inter_500Medium', marginBottom: 4 },
  successAmt: { fontSize: 42, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 12 },
  successBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#DCFCE7', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 28,
  },
  successBadgeText: { fontSize: 14, color: '#22C55E', fontFamily: 'Inter_600SemiBold' },
  detailsCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 20,
    padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  detailsTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0F172A', marginBottom: 14 },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  detailLabel: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular' },
  detailValue: { fontSize: 13, color: '#0F172A', fontFamily: 'Inter_500Medium', textAlign: 'right' },
  shareBtn: { width: '100%' },
});
