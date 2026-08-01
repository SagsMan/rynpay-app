import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet,
  ViewStyle, TextStyle, ActivityIndicator, View,
} from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outline' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
}

export default function PrimaryButton({
  title, onPress, variant = 'filled', disabled = false,
  loading = false, style, textStyle, icon, size = 'md',
}: Props) {
  const colors = useColors();

  const isDisabled = disabled || loading;
  const height = size === 'sm' ? 42 : 54;

  let bg = 'transparent';
  let borderWidth = 0;
  let borderColor = 'transparent';
  let txtColor = colors.primaryForeground;

  if (variant === 'filled') {
    bg = isDisabled ? '#A8C8EF' : colors.primary;
    txtColor = '#FFFFFF';
  } else if (variant === 'outline') {
    borderWidth = 1.5;
    borderColor = isDisabled ? colors.border : colors.primary;
    txtColor = isDisabled ? colors.textLight : colors.primary;
  } else {
    txtColor = colors.primary;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.82}
      style={[
        styles.base,
        { height, backgroundColor: bg, borderWidth, borderColor, borderRadius: height / 2 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'filled' ? '#fff' : colors.primary} />
      ) : (
        <View style={styles.inner}>
          {icon}
          <Text style={[styles.text, { color: txtColor }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { fontSize: 16, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.1 },
});
