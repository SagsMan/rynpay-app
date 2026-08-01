import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  showFlag?: boolean;
  style?: ViewStyle;
  error?: boolean;
  label?: string;
  keyboardType?: 'phone-pad' | 'email-address' | 'default';
  secureTextEntry?: boolean;
  editable?: boolean;
}

export default function PhoneInput({
  value, onChangeText, placeholder = 'Enter your Mobile No.',
  showFlag = true, style, error = false, label,
  keyboardType = 'phone-pad', secureTextEntry = false, editable = true,
}: Props) {
  const colors = useColors();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.destructive : focused ? colors.primary : colors.border;
  const borderWidth = focused || error ? 1.5 : 1;

  return (
    <View style={style}>
      {label && <Text style={[styles.label, { color: focused ? colors.primary : colors.textSecondary }]}>{label}</Text>}
      <View style={[styles.container, { borderColor, borderWidth }]}>
        {showFlag && (
          <View style={styles.countryCode}>
            <Text style={styles.flag}>🇳🇬</Text>
            <Text style={[styles.code, { color: colors.text }]}>+234</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textPlaceholder}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={editable}
          style={[styles.input, { color: colors.text }]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {value.length > 0 && !secureTextEntry && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clear}>
            <Text style={{ color: colors.textLight, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 12, fontFamily: 'Inter_500Medium', marginBottom: 4, marginLeft: 2 },
  container: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, backgroundColor: '#fff',
    height: 54, paddingHorizontal: 14,
  },
  countryCode: { flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 2 },
  flag: { fontSize: 18 },
  code: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  divider: { width: 1, height: 20, marginHorizontal: 6 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', height: '100%' },
  clear: { padding: 4 },
});
