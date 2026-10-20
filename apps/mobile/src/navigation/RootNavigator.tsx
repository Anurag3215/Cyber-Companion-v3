import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ScanHubScreen } from '../screens/ScanHubScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { AwarenessScreen } from '../screens/AwarenessScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

type TabKey = 'home' | 'scan' | 'history' | 'learn' | 'me';

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

  // Pure adherence to existing palette for both dark and light modes
  const bg = isDark ? '#090D16' : '#F8FAFC';
  const navBg = isDark ? '#0F172A' : '#FFFFFF';
  const borderCol = isDark ? '#1E293B' : '#E2E8F0';
  const activeColor = isDark ? '#2DD4BF' : '#0D9488';
  const inactiveColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <View style={[styles.container, { backgroundColor: bg, paddingTop: topPadding }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={bg}
        translucent={true}
      />

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

      {/* 5-Tab Bottom Navigation Bar (Home, Scan, History, Learn, Me) */}
      <View
        style={[
          styles.bottomNav,
          {
            backgroundColor: navBg,
            borderTopColor: borderCol,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        {/* 1. Home */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentTab('home')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, { color: currentTab === 'home' ? activeColor : inactiveColor }]}>
            🏠
          </Text>
          <Text
            style={[
              styles.navLabel,
              {
                color: currentTab === 'home' ? activeColor : inactiveColor,
                fontWeight: currentTab === 'home' ? '700' : '500',
              },
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        {/* 2. Scan */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentTab('scan')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, { color: currentTab === 'scan' ? activeColor : inactiveColor }]}>
            ⚡
          </Text>
          <Text
            style={[
              styles.navLabel,
              {
                color: currentTab === 'scan' ? activeColor : inactiveColor,
                fontWeight: currentTab === 'scan' ? '700' : '500',
              },
            ]}
          >
            Scan
          </Text>
        </TouchableOpacity>

        {/* 3. History */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentTab('history')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, { color: currentTab === 'history' ? activeColor : inactiveColor }]}>
            🕒
          </Text>
          <Text
            style={[
              styles.navLabel,
              {
                color: currentTab === 'history' ? activeColor : inactiveColor,
                fontWeight: currentTab === 'history' ? '700' : '500',
              },
            ]}
          >
            History
          </Text>
        </TouchableOpacity>

        {/* 4. Learn */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentTab('learn')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, { color: currentTab === 'learn' ? activeColor : inactiveColor }]}>
            📖
          </Text>
          <Text
            style={[
              styles.navLabel,
              {
                color: currentTab === 'learn' ? activeColor : inactiveColor,
                fontWeight: currentTab === 'learn' ? '700' : '500',
              },
            ]}
          >
            Learn
          </Text>
        </TouchableOpacity>

        {/* 5. Me */}
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setCurrentTab('me')}
          activeOpacity={0.7}
        >
          <Text style={[styles.navIcon, { color: currentTab === 'me' ? activeColor : inactiveColor }]}>
            👤
          </Text>
          <Text
            style={[
              styles.navLabel,
              {
                color: currentTab === 'me' ? activeColor : inactiveColor,
                fontWeight: currentTab === 'me' ? '700' : '500',
              },
            ]}
          >
            Me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 3,
  },
  navLabel: {
    fontSize: 11,
    letterSpacing: -0.1,
  },
});
