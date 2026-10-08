import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ScanHubScreen } from '../screens/ScanHubScreen';
import { AwarenessScreen } from '../screens/AwarenessScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { Tokens } from '../design-system/tokens';

export const RootNavigator: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'scanners' | 'awareness' | 'settings'>('dashboard');

  if (!hasOnboarded) {
    return <OnboardingScreen onComplete={() => setHasOnboarded(true)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#090D16" />
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>Cyber Companion</Text>
        <TouchableOpacity onPress={() => setCurrentTab('settings')}>
          <Text style={styles.settingsIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {currentTab === 'dashboard' && (
          <DashboardScreen onNavigateToScanners={() => setCurrentTab('scanners')} />
        )}
        {currentTab === 'scanners' && <ScanHubScreen />}
        {currentTab === 'awareness' && <AwarenessScreen />}
        {currentTab === 'settings' && <SettingsScreen />}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'dashboard' && styles.navBtnActive]}
          onPress={() => setCurrentTab('dashboard')}
        >
          <Text style={[styles.navLabel, currentTab === 'dashboard' && styles.navLabelActive]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'scanners' && styles.navBtnActive]}
          onPress={() => setCurrentTab('scanners')}
        >
          <Text style={[styles.navLabel, currentTab === 'scanners' && styles.navLabelActive]}>
            Scanners
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'awareness' && styles.navBtnActive]}
          onPress={() => setCurrentTab('awareness')}
        >
          <Text style={[styles.navLabel, currentTab === 'awareness' && styles.navLabelActive]}>
            Awareness
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, currentTab === 'settings' && styles.navBtnActive]}
          onPress={() => setCurrentTab('settings')}
        >
          <Text style={[styles.navLabel, currentTab === 'settings' && styles.navLabelActive]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Tokens.colors.dark.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Tokens.spacing.lg,
    paddingVertical: Tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Tokens.colors.dark.border,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#38BDF8',
  },
  settingsIcon: {
    fontSize: 20,
    color: Tokens.colors.dark.textSecondary,
  },
  body: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Tokens.colors.dark.border,
    backgroundColor: '#0F172A',
  },
  navBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  navBtnActive: {
    borderTopWidth: 2,
    borderTopColor: '#38BDF8',
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Tokens.colors.dark.textMuted,
  },
  navLabelActive: {
    color: '#38BDF8',
  },
});
