import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect, G, Defs, ClipPath, Polygon } from 'react-native-svg';

const TIERS = [
  { level: 1, label: 'Bronze', color: '#CD7F32', textColor: '#fff', stars: 1, desc: 'Starter level rewards and cashback' },
  { level: 2, label: 'Silver', color: '#A8A9AD', textColor: '#fff', stars: 2, desc: 'Enhanced rewards + priority support' },
  { level: 3, label: 'Gold', color: '#FFD700', textColor: '#fff', stars: 3, desc: 'Maximum cashback + exclusive perks' },
];

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Come Carry Your Bonus O!!!',
    body: 'Na just 300 you go drop, we go run you 30 off. Easy like that! Come flex this awoof sharp-sharp.\nTap am make e no pass you!',
    time: 'Today 16:14',
  },
  {
    id: '2',
    title: 'Top-up Bonus Activated!',
    body: 'You just unlocked a ₦50 bonus on your last airtime top-up. Keep topping up to earn more rewards and climb tiers!',
    time: 'Yesterday 09:22',
  },
  {
    id: '3',
    title: 'Silver Tier Achieved!',
    body: 'Congratulations! You have reached Silver tier status. Enjoy enhanced cashback on all transactions and priority customer support.',
    time: 'Jul 25 11:05',
  },
];

// Shield path (viewBox 0 0 100 110): classic heraldic shield
const SHIELD_PATH = 'M50 4 C50 4 92 4 92 32 C92 60 74 82 50 106 C26 82 8 60 8 32 C8 4 50 4 50 4 Z';

// Ribbon across the shield middle
const RIBBON_PATH = 'M0 52 L12 44 L88 44 L100 52 L88 60 L12 60 Z';

type Tier = { level: number; label: string; color: string; textColor: string; stars: number; desc: string };

function ShieldBadge({ tier, size = 76 }: { tier: Tier; size?: number }) {
  const scale = size / 100;
  const h = size * 1.1; // viewBox height ratio

  // Colour variants
  const dark = tier.level === 1 ? '#7B4A1E' : tier.level === 2 ? '#707070' : '#B8860B';
  const mid  = tier.color;
  const ribColor = tier.level === 1 ? '#9C5A22' : tier.level === 2 ? '#888888' : '#D4A012';

  return (
    <View style={{ width: size, height: h }}>
      <Svg width={size} height={h} viewBox="0 0 100 110">
        {/* Dark border shell */}
        <Path d={SHIELD_PATH} fill="#2D2D2D" />
        {/* Main shield fill (inset) */}
        <Path
          d="M50 10 C50 10 86 10 86 34 C86 58 70 78 50 100 C30 78 14 58 14 34 C14 10 50 10 50 10 Z"
          fill={mid}
        />
        {/* Darker bottom half */}
        <Path
          d="M50 55 C50 55 14 55 14 34 Q14 10 50 10 L50 55 Z"
          fill={dark}
          opacity={0.15}
        />
        {/* Ribbon banner */}
        <Path d={RIBBON_PATH} fill={ribColor} />
        {/* Ribbon shadow tabs */}
        <Path d="M12 60 L8 68 L20 60 Z" fill={dark} opacity={0.5} />
        <Path d="M88 60 L92 68 L80 60 Z" fill={dark} opacity={0.5} />
        {/* Tier number */}
        <G>
          <Path
            d={`M50 ${52 - 10 * 0.5}`}
            fill="white"
          />
        </G>
      </Svg>
      {/* Number overlay (react-native text is easier than SVG text for fonts) */}
      <View style={{ position: 'absolute', top: h * 0.35, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ fontSize: size * 0.26, fontFamily: 'Inter_700Bold', color: '#fff', textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }}>
          {tier.level}
        </Text>
      </View>
      {/* Stars at bottom of shield */}
      <View style={{ position: 'absolute', top: h * 0.72, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 3 }}>
        {Array.from({ length: tier.stars }).map((_, i) => (
          <Ionicons key={i} name="star" size={size * 0.12} color="rgba(255,255,255,0.9)" />
        ))}
      </View>
    </View>
  );
}

function TierBadge({ tier }: { tier: Tier }) {
  return (
    <View style={styles.tierCard}>
      <ShieldBadge tier={tier} size={72} />
      <Text style={styles.tierLabel}>{tier.label}</Text>
    </View>
  );
}

export default function RewardsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      {/* Header */}
      <LinearGradient
        colors={['#1076C9', '#0047A3']}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.pointsBadge}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.pointsText}>2,450 pts</Text>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        {/* Tier cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reward Tiers</Text>
          <Text style={styles.sectionSub}>Currently at <Text style={{ color: '#A8A9AD', fontFamily: 'Inter_600SemiBold' }}>Silver</Text> tier</Text>
          <View style={styles.tiersRow}>
            {TIERS.map((t) => <TierBadge key={t.level} tier={t} />)}
          </View>
          {/* Progress bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>6,500 / 10,000 pts to Gold</Text>
          </View>
        </View>

        {/* Earn more */}
        <LinearGradient
          colors={['#1076C9', '#0047A3']}
          style={styles.earnCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.earnTitle}>Earn Points Faster</Text>
            <Text style={styles.earnSub}>Top up airtime, pay bills, and refer friends to earn more reward points</Text>
            <TouchableOpacity style={styles.earnBtn}>
              <Text style={styles.earnBtnText}>Start Earning</Text>
            </TouchableOpacity>
          </View>
          <Ionicons name="gift-outline" size={52} color="rgba(255,255,255,0.25)" />
        </LinearGradient>

        {/* Notifications */}
        <View style={[styles.section, { marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>Reward Notifications</Text>
        </View>
        {NOTIFICATIONS.map((n) => (
          <View key={n.id} style={styles.notifCard}>
            <View style={styles.notifHeader}>
              <View style={styles.notifLogo}>
                <Ionicons name="gift" size={18} color="#1076C9" />
                <View style={styles.notifDot} />
              </View>
              <Text style={styles.notifTitle}>{n.title}</Text>
            </View>
            <Text style={styles.notifBody}>{n.body}</Text>
            <View style={styles.notifFooter}>
              <Text style={styles.notifTime}>{n.time}</Text>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.viewBtnText}>View</Text>
                <Ionicons name="chevron-forward" size={14} color="#1076C9" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
  pointsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  pointsText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  section: {
    backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 2 },
  sectionSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#64748B', marginBottom: 16 },
  tiersRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  tierCard: { alignItems: 'center', gap: 8 },
  tierBadge: {
    width: 68, height: 80, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    gap: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  tierNumber: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff' },
  tierStars: { flexDirection: 'row', gap: 2 },
  tierLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#0F172A' },
  progressSection: { gap: 6 },
  progressBar: { height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#1076C9', borderRadius: 4 },
  progressText: { fontSize: 12, color: '#64748B', fontFamily: 'Inter_400Regular', textAlign: 'center' },
  earnCard: {
    margin: 16, marginTop: 12, borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    shadowColor: '#1076C9', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4,
  },
  earnTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: 6 },
  earnSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 18, fontFamily: 'Inter_400Regular', marginBottom: 14 },
  earnBtn: {
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16,
    paddingVertical: 8, alignSelf: 'flex-start',
  },
  earnBtnText: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  notifCard: {
    backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 10,
    borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  notifLogo: { position: 'relative' },
  notifDot: {
    position: 'absolute', top: -2, right: -2, width: 8, height: 8,
    borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: '#fff',
  },
  notifTitle: { flex: 1, fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#0F172A', lineHeight: 20 },
  notifBody: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  notifFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notifTime: { fontSize: 12, color: '#94A3B8', fontFamily: 'Inter_400Regular' },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewBtnText: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
});
