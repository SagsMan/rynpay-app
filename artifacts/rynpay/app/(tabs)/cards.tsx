import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_W = width - 56;

const CARD_DESIGNS = [
  {
    id: '1',
    name: 'Classic Black',
    colors: ['#1C1C1C', '#2D2D2D', '#3D3D3D'] as [string, string, string],
    patternColor: 'rgba(255,255,255,0.05)',
    last4: '4521',
    type: 'debit',
  },
  {
    id: '2',
    name: 'Ocean Blue',
    colors: ['#1076C9', '#0E5FAA', '#0B4C8C'] as [string, string, string],
    patternColor: 'rgba(255,255,255,0.1)',
    last4: '8834',
    type: 'virtual',
  },
  {
    id: '3',
    name: 'Hot Pink',
    colors: ['#E5007D', '#C8006B', '#A60058'] as [string, string, string],
    patternColor: 'rgba(255,255,255,0.1)',
    last4: '1290',
    type: 'debit',
  },
];

function CardVisual({ card, isActive }: { card: typeof CARD_DESIGNS[0], isActive: boolean }) {
  return (
    <LinearGradient
      colors={card.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, { width: isActive ? CARD_W : CARD_W * 0.92, opacity: isActive ? 1 : 0.75 }]}
    >
      {/* Pattern overlay */}
      <View style={[styles.cardPattern, { borderColor: card.patternColor }]} />
      <View style={[styles.cardPattern2, { borderColor: card.patternColor }]} />

      <View style={styles.cardTop}>
        <Text style={styles.cardBrand}>RynGet</Text>
        <View style={styles.cardTypeTag}>
          <Text style={styles.cardTypeText}>{card.type.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <View style={styles.chipInner} />
        </View>
      </View>

      <View style={styles.cardNumber}>
        <Text style={styles.cardNumberText}>●●●● ●●●● ●●●● {card.last4}</Text>
      </View>

      <View style={styles.cardBottom}>
        <View>
          <Text style={styles.cardHolderLabel}>CARD HOLDER</Text>
          <Text style={styles.cardHolderName}>JAMES IBRAHIM</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.cardHolderLabel}>EXPIRES</Text>
          <Text style={styles.cardHolderName}>12/28</Text>
        </View>
        {/* Mastercard logo */}
        <View style={styles.mastercardWrap}>
          <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
          <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', marginLeft: -14 }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const CARD_ACTIONS = [
  { id: 'freeze', icon: 'snow-outline', label: 'Freeze Card' },
  { id: 'limits', icon: 'speedometer-outline', label: 'Set Limits' },
  { id: 'pin', icon: 'keypad-outline', label: 'Change PIN' },
  { id: 'block', icon: 'ban-outline', label: 'Block Card' },
];

export default function CardsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeCard, setActiveCard] = useState(0);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={{ flex: 1, backgroundColor: '#EEF3FC' }}>
      <LinearGradient
        colors={['#1076C9', '#0047A3']}
        style={[styles.header, { paddingTop: topPad + 12 }]}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Cards</Text>
            <Text style={styles.headerSub}>Secure. Instant. Everywhere.</Text>
          </View>
          <TouchableOpacity style={styles.addCardBtn}>
            <Ionicons name="add" size={20} color="#1076C9" />
            <Text style={styles.addCardText}>Add Card</Text>
          </TouchableOpacity>
        </View>
        {/* Hero illustration */}
        <Image
          source={require('@/assets/images/hero-card-illustration.png')}
          style={styles.headerIllustration}
          resizeMode="contain"
        />
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 80 }}
      >
        {/* Cards carousel */}
        <View style={styles.cardsCarousel}>
          <ScrollView
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsScroll}
            snapToInterval={CARD_W + 16}
            decelerationRate="fast"
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (CARD_W + 16));
              setActiveCard(Math.min(idx, CARD_DESIGNS.length - 1));
            }}
          >
            {CARD_DESIGNS.map((card, i) => (
              <CardVisual key={card.id} card={card} isActive={activeCard === i} />
            ))}
          </ScrollView>
          {/* Dots */}
          <View style={styles.dots}>
            {CARD_DESIGNS.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeCard && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Card info */}
        <View style={styles.cardInfoSection}>
          <View style={styles.cardInfoRow}>
            <Text style={styles.cardInfoLabel}>Card Type</Text>
            <Text style={styles.cardInfoValue}>{CARD_DESIGNS[activeCard].type === 'debit' ? 'Debit Card' : 'Virtual Card'}</Text>
          </View>
          <View style={styles.cardInfoRow}>
            <Text style={styles.cardInfoLabel}>Card Number</Text>
            <Text style={styles.cardInfoValue}>●●●● ●●●● ●●●● {CARD_DESIGNS[activeCard].last4}</Text>
          </View>
          <View style={styles.cardInfoRow}>
            <Text style={styles.cardInfoLabel}>Status</Text>
            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
          <View style={[styles.cardInfoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.cardInfoLabel}>Spending Limit</Text>
            <Text style={styles.cardInfoValue}>₦500,000 / day</Text>
          </View>
        </View>

        {/* Card actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Card Controls</Text>
          <View style={styles.actionsGrid}>
            {CARD_ACTIONS.map((action) => (
              <TouchableOpacity key={action.id} style={styles.actionItem}>
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={22} color="#1076C9" />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Transactions on this card */}
        <View style={styles.txSection}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          {[1, 2, 3].map((n) => (
            <View key={n} style={styles.txRow}>
              <View style={[styles.txIcon, { backgroundColor: n === 1 ? '#DCFCE7' : n === 2 ? '#FEF3C7' : '#EBF4FF' }]}>
                <Ionicons
                  name={n === 1 ? 'cart-outline' : n === 2 ? 'phone-portrait-outline' : 'swap-horizontal-outline'}
                  size={18}
                  color={n === 1 ? '#22C55E' : n === 2 ? '#F59E0B' : '#1076C9'}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txName}>{n === 1 ? 'Online Shopping' : n === 2 ? 'Airtime Top-up' : 'Transfer'}</Text>
                <Text style={styles.txDate}>Jul {28 - n}, 2026 · {12 + n}:30</Text>
              </View>
              <Text style={[styles.txAmt, { color: n === 1 || n === 2 ? '#EF4444' : '#22C55E' }]}>
                {n === 1 ? '-₦12,500' : n === 2 ? '-₦500' : '+₦45,000'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20, paddingBottom: 0, overflow: 'hidden',
  },
  headerContent: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  headerIllustration: { width: '100%', height: 140, marginBottom: -4 },
  addCardBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7,
  },
  addCardText: { fontSize: 13, color: '#1076C9', fontFamily: 'Inter_600SemiBold' },
  cardsCarousel: { paddingTop: 24 },
  cardsScroll: { paddingHorizontal: 28, gap: 16 },
  card: { borderRadius: 20, padding: 20, height: 200, overflow: 'hidden', position: 'relative' },
  cardPattern: {
    position: 'absolute', width: 180, height: 180, borderRadius: 90,
    borderWidth: 50, top: -60, right: -40,
  },
  cardPattern2: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    borderWidth: 30, bottom: -30, left: -20,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardBrand: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff', letterSpacing: 0.5 },
  cardTypeTag: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  cardTypeText: { fontSize: 9, color: '#fff', fontFamily: 'Inter_600SemiBold', letterSpacing: 1 },
  chipRow: { marginBottom: 12 },
  chip: {
    width: 36, height: 28, backgroundColor: '#D4A843', borderRadius: 5,
    alignItems: 'center', justifyContent: 'center',
  },
  chipInner: { width: 28, height: 20, borderRadius: 3, borderWidth: 1.5, borderColor: '#C29030' },
  cardNumber: { marginBottom: 8 },
  cardNumberText: { fontSize: 15, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter_500Medium', letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  cardHolderLabel: { fontSize: 8, color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter_400Regular', letterSpacing: 1 },
  cardHolderName: { fontSize: 12, color: '#fff', fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5 },
  mastercardWrap: { flexDirection: 'row', alignItems: 'center' },
  mcCircle: { width: 28, height: 28, borderRadius: 14 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingTop: 16 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E1' },
  dotActive: { width: 18, backgroundColor: '#1076C9' },
  cardInfoSection: {
    backgroundColor: '#fff', margin: 16, borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardInfoRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  cardInfoLabel: { fontSize: 13, color: '#64748B', fontFamily: 'Inter_400Regular' },
  cardInfoValue: { fontSize: 13, color: '#0F172A', fontFamily: 'Inter_600SemiBold' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#DCFCE7', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
  activeText: { fontSize: 12, color: '#16A34A', fontFamily: 'Inter_600SemiBold' },
  actionsSection: {
    backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#0F172A', marginBottom: 14 },
  actionsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  actionItem: { alignItems: 'center', gap: 6 },
  actionIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: '#EBF4FF', alignItems: 'center', justifyContent: 'center' },
  actionLabel: { fontSize: 11, color: '#0F172A', fontFamily: 'Inter_400Regular', textAlign: 'center' },
  txSection: {
    backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 16, padding: 18, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txName: { fontSize: 14, fontFamily: 'Inter_500Medium', color: '#0F172A' },
  txDate: { fontSize: 11, color: '#94A3B8', fontFamily: 'Inter_400Regular' },
  txAmt: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});
