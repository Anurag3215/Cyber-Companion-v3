import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { AwarenessScreen } from '../screens/AwarenessScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

type TabKey = 'home' | 'history' | 'learn' | 'me';

export const RootNavigator: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState(true); // default true for immediate interactive access
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [isDark, setIsDark] = useState(false);

  if (!hasOnboarded) {
    return <OnboardingScreen onComplete={() => setHasOnboarded(true)} />;
  }

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const navBg = isDark ? '#0F172A' : '#FFFFFF';
  const borderCol = isDark ? '#1E293B' : '#F1F5F9';
  const activeColor = isDark ? '#2DD4BF' : '#0D9488';
  const inactiveColor = isDark ? '#64748B' : '#94A3B8';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Main Tab Views */}
      <View style={styles.body}>
        {currentTab === 'home' && (
          <DashboardScreen
            onNavigateToLearn={() => setCurrentTab('learn')}
            isDark={isDark}
          />
        )}
        {currentTab === 'history' && <HistoryScreen isDark={isDark} />}
        {currentTab === 'learn' && <AwarenessScreen isDark={isDark} />}
        {currentTab === 'me' && <ProfileScreen isDark={isDark} />}
      </View>

      {/* 4-Tab Bottom Navigation Bar (Home, History, Learn, Me) */}
      <View style={[styles.bottomNav, { backgroundColor: navBg, borderTopColor: borderCol }]}>
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

        {/* 2. History */}
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

        {/* 3. Learn */}
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

        {/* 4. Me */}
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
    </SafeAreaView>
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
    paddingBottom: 16,
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
