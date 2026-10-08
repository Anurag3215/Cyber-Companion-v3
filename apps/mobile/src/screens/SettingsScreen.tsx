import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Tokens } from '../design-system/tokens';

export const SettingsScreen: React.FC = () => {
  const [wifiAlerts, setWifiAlerts] = useState(true);
  const [urlInterception, setUrlInterception] = useState(true);
  const [quietHours, setQuietHours] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'Clear Local Data',
      'This will erase local scan cache and reset offline awareness history. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {} },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy & Settings</Text>
      <Text style={styles.subtitle}>Manage privacy preferences, quiet hours, and local data.</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Alert Controls</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingTitle}>Insecure Wi-Fi Banners</Text>
            <Text style={styles.settingDesc}>Notify when connecting to open or captive networks</Text>
          </View>
          <Switch value={wifiAlerts} onValueChange={setWifiAlerts} trackColor={{ true: '#0284C7' }} />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingTitle}>Clipboard URL Scanning</Text>
            <Text style={styles.settingDesc}>Prompt to verify copied URLs before opening</Text>
          </View>
          <Switch
            value={urlInterception}
            onValueChange={setUrlInterception}
            trackColor={{ true: '#0284C7' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Quiet Hours</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingTextWrap}>
            <Text style={styles.settingTitle}>Mute Non-Critical Tips (22:00 - 08:00)</Text>
            <Text style={styles.settingDesc}>Only high-risk active threats trigger alerts at night</Text>
          </View>
          <Switch value={quietHours} onValueChange={setQuietHours} trackColor={{ true: '#0284C7' }} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Data & Privacy</Text>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleClearCache}>
          <Text style={styles.dangerBtnText}>Clear Local Cache & Scan History</Text>
        </TouchableOpacity>
        <Text style={styles.privacyNote}>
          Cyber Companion operates under strict Zero-PII principles. Your Wi-Fi SSIDs, installed app lists, and personal data are never sent to external servers.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.dark.background,
  },
  content: {
    padding: Tokens.spacing.lg,
  },
  title: {
    fontSize: Tokens.typography.titleLarge.fontSize,
    fontWeight: Tokens.typography.titleLarge.fontWeight,
    color: Tokens.colors.dark.textPrimary,
  },
  subtitle: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    marginTop: 4,
    marginBottom: Tokens.spacing.lg,
  },
  section: {
    backgroundColor: Tokens.colors.dark.surface,
    borderRadius: Tokens.radii.lg,
    padding: Tokens.spacing.lg,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
    marginBottom: Tokens.spacing.lg,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Tokens.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Tokens.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  settingTextWrap: {
    flex: 1,
    marginRight: Tokens.spacing.md,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Tokens.colors.dark.textPrimary,
  },
  settingDesc: {
    fontSize: 12,
    color: Tokens.colors.dark.textMuted,
    marginTop: 2,
  },
  dangerBtn: {
    backgroundColor: '#881337',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: Tokens.radii.md,
    alignItems: 'center',
    marginTop: Tokens.spacing.xs,
  },
  dangerBtnText: {
    color: '#FFE4E6',
    fontWeight: '700',
    fontSize: 13,
  },
  privacyNote: {
    fontSize: 11,
    color: Tokens.colors.dark.textMuted,
    marginTop: Tokens.spacing.md,
    lineHeight: 16,
  },
});
