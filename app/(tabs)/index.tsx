import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Platform, Dimensions, FlatList, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

const QUICK_ACTIONS = [
  { id: 'transfer', label: 'To RynGet', icon: 'person-outline', route: '/transfer' },
  { id: 'bank', label: 'To Bank', icon: 'business-outline', route: '/transfer' },
  { id: 'withdraw', label: 'Withdraw', icon: 'arrow-down-circle-outline', route: '/transfer' },
];

const SERVICES = [
  { id: 'airtime', label: 'Airtime', icon: 'call-outline', route: '/airtime' },
  { id: 'data', label: 'Data', icon: 'cellular-outline', route: '/airtime' },
  { id: 'tv', label: 'TV', icon: 'tv-outline', route: '/airtime' },
  { id: 'betting', label: 'Betting', icon: 'trophy-outline', route: '/airtime' },
  { id: 'safebox', label: 'Safebox', icon: 'lock-closed-outline', route: '/airtime' },
  { id: 'loan', label: 'Loan', icon: 'cash-outline', route: '/airtime' },
  { id: 'invitation', label: 'Invitation', icon: 'person-add-outline', route: '/airtime' },
  { id: 'more', label: 'More', icon: 'grid-outline', route: '/airtime' },
];

const BANNER_HEIGHT = 160;
const BANNER_GAP = 12;

const PROMOS = [
  { id: '1', image: require('@/assets/images/promo-airtime-banner.png') },
  { id: '2', image: require('@/assets/images/promo-banner.png') },
  { id: '3', image: require('@/assets/images/promo-agent-banner.png') },
];

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);
  const promoRef = useRef<FlatList>(null);
  const promoIndexRef = useRef(0);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  // Auto-slide every 3 s, loops back to start seamlessly
  useEffect(() => {
    const timer = setInterval(() => {
      const next = (promoIndexRef.current + 1) % PROMOS.length;
      if (next === 0) {
        // snap back to start without animation first
        promoRef.current?.scrollToOffset({ offset: 0, animated: false });
      } else {
        promoRef.current?.scrollToOffset({
          offset: (CARD_WIDTH + BANNER_GAP) * next,
          animated: true,
        });
      }
      promoIndexRef.current = next;
      setPromoIndex(next);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const fmtBalance = (n: number) =>
    n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, backgroundColor: '#fff' }]}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={22} color="#fff" />
            <View style={styles.avatarBadge} />
          </View>
          <Text style={styles.greeting}>Hi, {user?.name ?? 'User'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="scan-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="headset-outline" size={24} color="#0F172A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <View style={styles.notifWrap}>
              <Ionicons name="notifications-outline" size={24} color="#0F172A" />
              <View style={styles.notifBadge}>
                <Text style={styles.notifCount}>99+</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View style={styles.cardWrap}>
          <LinearGradient
            colors={['#1076C9', '#0047A3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceCard}
          >
            {/* Row 1: shield label + eye toggle  |  Transaction History */}
            <View style={styles.balanceTop}>
              <TouchableOpacity style={styles.balanceLabel} onPress={() => setBalanceVisible(!balanceVisible)}>
                <Ionicons name="shield-checkmark-outline" size={14} color="rgba(255,255,255,0.85)" />
                <Text style={styles.balanceLabelText}>Available Balance</Text>
                <Ionicons
                  name={balanceVisible ? 'eye-outline' : 'eye-off-outline'}
                  size={15} color="rgba(255,255,255,0.75)"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/transactions')} style={styles.txHistoryBtn}>
                <Text style={styles.txHistoryLink}>Transaction History</Text>
                <Ionicons name="chevron-forward" size={14} color="rgba(255,255,255,0.85)" />
              </TouchableOpacity>
            </View>

            {/* Row 2: masked amount + chevron  |  + Add Money */}
            <View style={styles.balanceRow}>
              <TouchableOpacity onPress={() => setBalanceVisible(!balanceVisible)} style={styles.balanceAmtRow}>
                <Text style={styles.balanceAmount}>
                  {balanceVisible
                    ? `₦${fmtBalance(user?.balance ?? 0)}`
                    : '* * * * . * *'}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addMoneyBtn}>
                <Ionicons name="add" size={15} color="#1076C9" />
                <Text style={styles.addMoneyText}>Add Money</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <View style={styles.quickActions}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionItem}
                onPress={() => router.push(action.route as any)}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon as any} size={22} color="#1076C9" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Services */}
        <View style={styles.section}>
          <View style={styles.servicesGrid}>
            {SERVICES.map((svc) => (
              <TouchableOpacity
                key={svc.id}
                style={styles.serviceItem}
                onPress={() => router.push(svc.route as any)}
              >
                <View style={styles.serviceIcon}>
                  <Ionicons name={svc.icon as any} size={20} color="#1076C9" />
                </View>
                <Text style={styles.serviceLabel}>{svc.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View style={styles.promoSection}>
          <FlatList
            ref={promoRef}
            data={PROMOS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / CARD_WIDTH);
              promoIndexRef.current = idx;
              setPromoIndex(idx);
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.92}
                style={{
                  width: CARD_WIDTH,
                  marginRight: index < PROMOS.length - 1 ? BANNER_GAP : 0,
                }}
              >
                <Image
                  source={item.image}
                  style={styles.promoBannerImg}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
            keyExtractor={(i) => i.id}
            pagingEnabled={false}
            snapToInterval={CARD_WIDTH + BANNER_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
            getItemLayout={(_, index) => ({
              length: CARD_WIDTH + BANNER_GAP,
              offset: (CARD_WIDTH + BANNER_GAP) * index,
              index,
            })}
            contentContainerStyle={{ paddingRight: 0 }}
          />
          {/* Dots */}
          <View style={styles.promoDots}>
            {PROMOS.map((_, i) => (
              <View key={i} style={[styles.promoDot, i === promoIndex && styles.promoDotActive]} />
            ))}
          </View>
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportCard} activeOpacity={0.8}>
          <View style={styles.supportIconWrap}>
            <Ionicons name="headset-outline" size={22} color="#1076C9" />
          </View>
          <View style={styles.supportTextWrap}>
            <Text style={styles.supportTitle}>Encounter any problem?</Text>
            <Text style={styles.supportSub}>If you have any questions, call us on 090000011</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#6366F1',
    alignItems: 'center', justifyContent: 'center', overflow: 'visible',
  },
  avatarBadge: {
    position: 'absolute', bottom: 0, right: 0, width: 14, height: 14,
    borderRadius: 7, backgroundColor: '#F59E0B', borderWidth: 2, borderColor: '#fff',
  },
  greeting: { fontSize: 18, fontFamily: 'Inter_600SemiBold', color: '#0F172A' },
  headerActions: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  notifWrap: { position: 'relative' },
  notifBadge: {
    position: 'absolute', top: -4, right: -6, backgroundColor: '#1076C9',
    borderRadius: 8, paddingHorizontal: 3, paddingVertical: 1, minWidth: 18,
    alignItems: 'center', borderWidth: 1.5, borderColor: '#fff',
  },
  notifCount: { fontSize: 8, color: '#fff', fontFamily: 'Inter_700Bold' },
  cardWrap: { paddingHorizontal: 16, paddingTop: 16 },
  balanceCard: { borderRadius: 18, padding: 20, overflow: 'hidden' },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  balanceLabel: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  balanceLabelText: { fontSize: 13, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter_500Medium' },
  txHistoryBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  txHistoryLink: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter_500Medium' },
  balanceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  balanceAmtRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  balanceAmount: { fontSize: 22, color: '#fff', fontFamily: 'Inter_700Bold', letterSpacing: 2 },
  addMoneyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: 22, paddingHorizontal: 14, paddingVertical: 8,
  },
  addMoneyText: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around' },
  quickActionItem: { alignItems: 'center', gap: 8 },
  quickActionIcon: {
    width: 56, height: 56, borderRadius: 16, backgroundColor: '#EBF4FF',
    alignItems: 'center', justifyContent: 'center',
  },
  quickActionLabel: { fontSize: 12, color: '#0F172A', fontFamily: 'Inter_500Medium', textAlign: 'center' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 0 },
  serviceItem: { width: '25%', alignItems: 'center', paddingVertical: 10, gap: 6 },
  serviceIcon: {
    width: 50, height: 50, borderRadius: 16, backgroundColor: '#EBF4FF',
    alignItems: 'center', justifyContent: 'center',
  },
  serviceLabel: { fontSize: 11, color: '#0F172A', fontFamily: 'Inter_400Regular', textAlign: 'center' },
  promoSection: { marginHorizontal: 16, marginTop: 12 },
  promoBannerImg: { width: CARD_WIDTH, height: BANNER_HEIGHT, borderRadius: 16 },
  promoDots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 10 },
  promoDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E1' },
  promoDotActive: { width: 18, backgroundColor: '#1076C9' },
  // Support card — white style (Figma)
  supportCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 16, paddingVertical: 16, paddingHorizontal: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  supportIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#EBF4FF', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  supportTextWrap: { flex: 1 },
  supportTitle: { fontSize: 15, color: '#0F172A', fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  supportSub: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular' },
});
