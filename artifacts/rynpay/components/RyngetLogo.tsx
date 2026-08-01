import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

interface Props {
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export default function RyngetLogo({ size = 48, showText = true, textColor = '#0F172A' }: Props) {
  const h = size;
  const w = size * 0.62;
  return (
    <View style={styles.row}>
      <Svg width={w} height={h} viewBox="0 0 26 44">
        <Defs>
          <LinearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#E5007D" />
            <Stop offset="1" stopColor="#1076C9" />
          </LinearGradient>
        </Defs>
        {/* Stylized R: vertical bar + bowl (right) + diagonal leg */}
        <Path
          fillRule="evenodd"
          fill="url(#rg)"
          d="M2,2 L2,42 L8,42 L8,26 L12,26 L20,42 L27,42 L19,26 C23,24 25,20 25,13 C25,6 21,2 14,2 Z M8,9 L13,9 C17,9 18,11 18,13 C18,17 16,18 13,18 L8,18 Z"
        />
      </Svg>
      {showText && (
        <Svg width={size * 0.78} height={h} viewBox="0 0 34 44" style={styles.payText}>
          <SvgText
            x="1" y="37"
            fill={textColor}
            fontSize="28"
            fontWeight="700"
            fontFamily="Inter"
            letterSpacing="-0.5"
          >
            Pay
          </SvgText>
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  payText: { marginLeft: 2 },
});
