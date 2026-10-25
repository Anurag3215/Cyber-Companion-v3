import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ScanHubScreen } from '../screens/ScanHubScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { AwarenessScreen } from '../screens/AwarenessScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AmbientBackground } from '../design-system/AmbientBackground';
import { GlassNavigationBar, TabKey } from '../design-system/GlassNavigationBar';

export const RootNavigator: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const { isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  // Calculate precise top padding so content is strictly below camera bezel and system clock/icons
  const topPadding =
    Platform.OS === 'android'
      ? (StatusBar.currentHeight || 28) + 8
      : Math.max(insets.top, 12);

  if (!hasOnboarded || showIntro) {
    return (
      <OnboardingScreen
        onComplete={() => {
          setHasOnboarded(true);
          setShowIntro(false);
        }}
        isDark={isDark}
      />
    );
  }

  return (
    <AmbientBackground isDark={isDark}>
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <ExpoStatusBar style={isDark ? 'light' : 'dark'} />

        {/* Main Tab Views */}
        <View style={styles.body}>
          {currentTab === 'home' && (
            <DashboardScreen
              onNavigateToScanners={() => setCurrentTab('scan')}
              onNavigateToLearn={() => setCurrentTab('learn')}
              isDark={isDark}
              toggleTheme={toggleTheme}
            />
          )}
          {currentTab === 'scan' && <ScanHubScreen isDark={isDark} />}
          {currentTab === 'history' && <HistoryScreen isDark={isDark} />}
          {currentTab === 'learn' && <AwarenessScreen isDark={isDark} />}
          {currentTab === 'me' && (
            <ProfileScreen
              isDark={isDark}
              onNavigateToScanners={() => setCurrentTab('scan')}
              onReplayIntro={() => setShowIntro(true)}
              toggleTheme={toggleTheme}
            />
          )}
        </View>

        {/* Floating Liquid Glass Navigation Bar */}
        <GlassNavigationBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onQuickAction={() => setCurrentTab('scan')}
          quickActionLabel="⚡ Quick Scan"
          isDark={isDark}
        />
      </View>
    </AmbientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  body: {
    flex: 1,
  },
});
