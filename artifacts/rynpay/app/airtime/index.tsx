import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
  TextInput, Modal, Alert, Clipboard,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import PrimaryButton from '@/components/PrimaryButton';

const NETWORKS = [
  { id: 'mtn',     label: 'MTN',     color: '#FFD700', textColor: '#000' },
  { id: 'airtel',  label: 'Airtel',  color: '#EF4444', textColor: '#fff' },
  { id: 'glo',     label: 'Glo',     color: '#22C55E', textColor: '#fff' },
  { id: '9mobile', label: '9mobile', color: '#16A34A', textColor: '#fff' },
];
const QUICK_AMOUNTS = [50, 100, 200, 500, 1000, 2000];

function fmtBalance(n: number) {
  return n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function genTxnId() {
  return '7' + Array.from({ length: 17 }, () => Math.floor(Math.random() * 10)).join('');
}

// ─── Transaction Details screen ───────────────────────────────────────────────
function SuccessScreen({
  network, phone, amount, txnId, onClose,
}: {
  network: typeof NETWORKS[0]; phone: string; amount: string; txnId: string; onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' ' + now.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const rows = [
    { label: 'Receipt Mobile', value: phone },
    { label: 'Transaction Type', value: 'Bulk Airtime' },
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
        {/* Network logo circle */}
        <View style={[styles.networkCircle, { backgroundColor: network.color }]}>
          <Text style={[styles.networkLabel, { color: network.textColor }]}>{network.label}</Text>
        </View>
        <Text style={styles.successNetworkName}>{network.label}</Text>
        <Text style={styles.successAmt}>₦{Number(amount).toLocaleString()}</Text>

        {/* Successful badge */}
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
          style={{ width: '100%' }}
        />
      </ScrollView>
    </View>
  );
}

// ─── Payment bottom sheet ─────────────────────────────────────────────────────
function PaymentSheet({
  visible, network, phone, amount, walletBalance,
  onPay, onClose, loading,
}: {
  visible: boolean; network: typeof NETWORKS[0]; phone: string; amount: string;
  walletBalance: number; onPay: () => void; onClose: () => void; loading: boolean;
}) {
  const [showReminder, setShowReminder] = useState(false);

  const handleXPress = () => setShowReminder(true);
  const total = Number(amount);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleXPress}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <TouchableOpacity onPress={handleXPress} style={styles.sheetClose}>
            <Ionicons name="close" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.sheetTitle}>Payment</Text>
          <Text style={styles.sheetAmount}>₦{total.toLocaleString()}</Text>

          <View style={styles.sheetRows}>
            {[
              { label: 'Account Number', value: phone },
              { label: 'Name', value: network.label },
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
                <Text style={styles.sheetRowValue}>₦{fmtBalance(total)}</Text>
              </View>
            </View>

            <TouchableOpacity style={[styles.sheetRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.sheetRowLabel}>Payment Method</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={[styles.sheetRow, { borderBottomWidth: 0, backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12 }]}>
              <Text style={styles.sheetRowLabel}>Wallet Balance</Text>
              <Text style={[styles.sheetRowValue, { color: '#1076C9', fontFamily: 'Inter_700Bold' }]}>
                ₦{fmtBalance(walletBalance)}
              </Text>
            </View>
          </View>

          <PrimaryButton title="Pay" onPress={onPay} loading={loading} style={{ width: '100%' }} />
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
              <PrimaryButton title="Continue to pay" onPress={() => setShowReminder(false)} style={{ width: '100%' }} />
              <PrimaryButton
                title="Cancel"
                onPress={() => { setShowReminder(false); onClose(); }}
                variant="outline"
                style={{ width: '100%' }}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function AirtimeScreen() {
  const insets = useSafeAreaInsets();
  const { user, updateBalance } = useAuth();
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [amount, setAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txnId] = useState(genTxnId);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const handleQuickAmount = (amt: number) => {
    setSelectedAmount(amt);
    setAmount(String(amt));
  };

  const handlePay = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setShowModal(false);
    setSuccess(true);
    updateBalance(-(Number(amount)));
  };

  if (success) {
    return (
      <SuccessScreen
        network={network}
        phone={phone}
        amount={amount}
        txnId={txnId}
        onClose={() => router.back()}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      <View style={[styles.topBar, { paddingTop: topPad + 8, backgroundColor: '#fff' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Airtime</Text>
        <TouchableOpacity>
          <Text style={styles.historyLink}>History</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad + 24 }} keyboardShouldPersistTaps="handled">
        {/* Promo Banner */}
        <TouchableOpacity activeOpacity={0.92} style={styles.promoBannerWrap}>
          <Image
            source={require('@/assets/images/promo-airtime-banner.png')}
            style={styles.promoBannerImg}
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View style={styles.formCard}>
          {/* Network selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {NETWORKS.map((n) => (
              <TouchableOpacity
                key={n.id}
                onPress={() => setNetwork(n)}
                style={[styles.networkChip, network.id === n.id && { borderColor: '#1076C9', backgroundColor: '#EBF4FF' }]}
              >
                <View style={[styles.networkDot, { backgroundColor: n.color }]} />
                <Text style={[styles.networkChipText, network.id === n.id && { color: '#1076C9', fontFamily: 'Inter_600SemiBold' }]}>
                  {n.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Phone input */}
          <View style={styles.phoneRow}>
            <View style={[styles.networkBadge, { backgroundColor: network.color }]}>
              <Text style={[styles.networkBadgeText, { color: network.textColor }]}>{network.label.charAt(0)}</Text>
            </View>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
              style={styles.phoneInput}
              placeholderTextColor="#CBD5E1"
            />
            <TouchableOpacity style={styles.contactBtn}>
              <Ionicons name="person-outline" size={20} color="#1076C9" />
            </TouchableOpacity>
          </View>

          {/* Amount input */}
          <View style={styles.amountRow}>
            <Text style={styles.nairaSymbol}>₦</Text>
            <TextInput
              value={amount}
              onChangeText={(t) => { setAmount(t); setSelectedAmount(null); }}
              placeholder="0 – 5,000,000"
              keyboardType="numeric"
              style={styles.amountInput}
              placeholderTextColor="#CBD5E1"
            />
            <TouchableOpacity
              onPress={() => {
                if (!phone || !amount || Number(amount) < 50) {
                  Alert.alert('Invalid', 'Please enter a valid phone number and amount (min ₦50).');
                  return;
                }
                setShowModal(true);
              }}
              style={[styles.payBtn, { backgroundColor: amount && phone ? '#1076C9' : '#A8C8EF' }]}
            >
              <Text style={styles.payBtnText}>Pay</Text>
            </TouchableOpacity>
          </View>

          {/* Quick amounts */}
          <Text style={styles.topUpLabel}>Top Up</Text>
          <View style={styles.quickGrid}>
            {QUICK_AMOUNTS.map((amt) => (
              <TouchableOpacity
                key={amt}
                onPress={() => handleQuickAmount(amt)}
                style={[styles.quickChip, selectedAmount === amt && styles.quickChipSelected]}
              >
                {selectedAmount === amt && (
                  <View style={styles.checkMark}>
                    <Ionicons name="checkmark" size={10} color="#fff" />
                  </View>
                )}
                <Text style={[styles.quickChipText, selectedAmount === amt && styles.quickChipTextSelected]}>
                  ₦{amt.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <PaymentSheet
        visible={showModal}
        network={network}
        phone={phone}
        amount={amount}
        walletBalance={user?.balance ?? 0}
        onPay={handlePay}
        onClose={() => setShowModal(false)}
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
  topTitle: { flex: 1, fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#0F172A', textAlign: 'center' },
  historyLink: { fontSize: 14, color: '#1076C9', fontFamily: 'Inter_500Medium' },
  promoBannerWrap: { marginHorizontal: 16, marginTop: 4, borderRadius: 16, overflow: 'hidden' },
  promoBannerImg: { width: '100%', height: 140, borderRadius: 16 },
  formCard: { backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 18, gap: 16 },
  networkChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20,
    paddingHorizontal: 12, paddingVertical: 7, backgroundColor: '#F1F5F9',
  },
  networkDot: { width: 10, height: 10, borderRadius: 5 },
  networkChipText: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_500Medium' },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  networkBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  networkBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  phoneInput: { flex: 1, fontSize: 15, color: '#0F172A', fontFamily: 'Inter_400Regular', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
  contactBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EBF4FF', alignItems: 'center', justifyContent: 'center' },
  amountRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  nairaSymbol: { fontSize: 18, color: '#0F172A', fontFamily: 'Inter_600SemiBold' },
  amountInput: { flex: 1, fontSize: 18, color: '#0F172A', fontFamily: 'Inter_600SemiBold', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 8 },
  payBtn: { borderRadius: 20, paddingHorizontal: 20, paddingVertical: 10 },
  payBtnText: { fontSize: 15, color: '#fff', fontFamily: 'Inter_600SemiBold' },
  topUpLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#0F172A' },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  quickChip: { width: '30%', aspectRatio: 1.5, borderRadius: 12, backgroundColor: '#EBF4FF', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  quickChipSelected: { backgroundColor: '#1076C9' },
  checkMark: { position: 'absolute', top: 4, left: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  quickChipText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', color: '#1076C9' },
  quickChipTextSelected: { color: '#fff' },

  // Payment sheet
  sheetOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 24, paddingTop: 12, paddingBottom: 36 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0', alignSelf: 'center', marginBottom: 12 },
  sheetClose: { position: 'absolute', top: 20, right: 20, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  sheetTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0F172A', textAlign: 'center', marginBottom: 4, marginTop: 4 },
  sheetAmount: { fontSize: 38, fontFamily: 'Inter_700Bold', color: '#0F172A', textAlign: 'center', marginBottom: 20 },
  sheetRows: { gap: 0, marginBottom: 20 },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  sheetRowLabel: { fontSize: 14, color: '#64748B', fontFamily: 'Inter_400Regular' },
  sheetRowValue: { fontSize: 14, color: '#0F172A', fontFamily: 'Inter_500Medium' },
  thousandsBadge: { backgroundColor: '#EBF4FF', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  thousandsBadgeText: { fontSize: 11, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },

  // Reminder
  reminderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  reminderCard: { backgroundColor: '#fff', borderRadius: 24, padding: 28, width: '100%', alignItems: 'center', gap: 12 },
  reminderClose: { position: 'absolute', top: 16, right: 16, width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  reminderTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#0F172A' },
  reminderSub: { fontSize: 14, color: '#64748B', fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 20 },

  // Success screen
  successBody: { flexGrow: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 },
  networkCircle: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  networkLabel: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  successNetworkName: { fontSize: 15, color: '#64748B', fontFamily: 'Inter_500Medium', marginBottom: 4 },
  successAmt: { fontSize: 42, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 12 },
  successBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#DCFCE7', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 28 },
  successBadgeText: { fontSize: 14, color: '#22C55E', fontFamily: 'Inter_600SemiBold' },
  detailsCard: { width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  detailsTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#0F172A', marginBottom: 14 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailLabel: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular' },
  detailValue: { fontSize: 13, color: '#0F172A', fontFamily: 'Inter_500Medium', textAlign: 'right' },
});
