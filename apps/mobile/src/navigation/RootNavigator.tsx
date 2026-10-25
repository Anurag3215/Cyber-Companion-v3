import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ScanHubScreen } from '../screens/ScanHubScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { AwarenessScreen } from '../screens/AwarenessScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { WifiAnalyzerScreen } from '../screens/WifiAnalyzerScreen';
import { UrlScannerScreen } from '../screens/UrlScannerScreen';
import { UrlResultScreen } from '../screens/UrlResultScreen';
import { QrScannerScreen } from '../screens/QrScannerScreen';
import { QrResultScreen } from '../screens/QrResultScreen';
import { PermissionAnalyzerScreen } from '../screens/PermissionAnalyzerScreen';
import { SecurityScoreScreen } from '../screens/SecurityScoreScreen';
import { AuthModal } from '../components/AuthModal';
import { AmbientBackground } from '../design-system/AmbientBackground';
import { GlassNavigationBar, TabKey } from '../design-system/GlassNavigationBar';
import { ThreatInspectionResponse } from '../services/apiClient';

type SubScreenKey =
  | 'main'
  | 'wifi-analyzer'
  | 'url-scanner'
  | 'url-result'
  | 'qr-scanner'
  | 'qr-result'
  | 'permission-analyzer'
  | 'security-score';

export const RootNavigator: React.FC = () => {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabKey>('home');
  const [activeScreen, setActiveScreen] = useState<SubScreenKey>('main');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sub-screen parameters
  const [urlResult, setUrlResult] = useState<ThreatInspectionResponse | null>(null);
  const [qrResultData, setQrResultData] = useState<string>('https://legitimate-service.com/portal');

  const { isDark = true, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const topPadding =
    Platform.OS === 'android'
      ? (StatusBar.currentHeight || 28) + 8
      : Math.max(insets.top, 12);

  if (!hasOnboarded) {
    return (
      <>
        <WelcomeScreen
          onGetStarted={() => setHasOnboarded(true)}
          onSignIn={() => setShowAuthModal(true)}
          isDark={isDark}
        />
        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          isDark={isDark}
        />
      </>
    );
  }

  return (
    <AmbientBackground isDark={isDark}>
      <View style={[styles.container, { paddingTop: topPadding }]}>
        <ExpoStatusBar style={isDark ? 'light' : 'dark'} />

        {/* Sub-screen Overlays */}
        {activeScreen === 'wifi-analyzer' && (
          <WifiAnalyzerScreen
            onBack={() => setActiveScreen('main')}
            isDark={isDark}
          />
        )}

        {activeScreen === 'url-scanner' && (
          <UrlScannerScreen
            onBack={() => setActiveScreen('main')}
            onScanComplete={(result) => {
              setUrlResult(result);
              setActiveScreen('url-result');
            }}
            isDark={isDark}
          />
        )}

        {activeScreen === 'url-result' && urlResult && (
          <UrlResultScreen
            result={urlResult}
            onBack={() => setActiveScreen('url-scanner')}
            isDark={isDark}
          />
        )}

        {activeScreen === 'qr-scanner' && (
          <QrScannerScreen
            onBack={() => setActiveScreen('main')}
            onScanComplete={(data) => {
              setQrResultData(data);
              setActiveScreen('qr-result');
            }}
            isDark={isDark}
          />
        )}

        {activeScreen === 'qr-result' && (
          <QrResultScreen
            qrData={qrResultData}
            onBack={() => setActiveScreen('qr-scanner')}
            isDark={isDark}
          />
        )}

        {activeScreen === 'permission-analyzer' && (
          <PermissionAnalyzerScreen
            onBack={() => setActiveScreen('main')}
            isDark={isDark}
          />
        )}

        {activeScreen === 'security-score' && (
          <SecurityScoreScreen
            onBack={() => setActiveScreen('main')}
            onNavigateToPermissionAnalyzer={() => setActiveScreen('permission-analyzer')}
            isDark={isDark}
          />
        )}

        {/* Main Tab Views when in 'main' */}
        {activeScreen === 'main' && (
          <View style={styles.body}>
            {currentTab === 'home' && (
              <DashboardScreen
                onNavigateToScanners={() => setCurrentTab('tools')}
                onNavigateToLearn={() => setCurrentTab('awareness')}
                onNavigateToWifiAnalyzer={() => setActiveScreen('wifi-analyzer')}
                onNavigateToUrlScanner={() => setActiveScreen('url-scanner')}
                onNavigateToQrScanner={() => setActiveScreen('qr-scanner')}
                onNavigateToPermissionAnalyzer={() => setActiveScreen('permission-analyzer')}
                onNavigateToSecurityScore={() => setActiveScreen('security-score')}
                isDark={isDark}
                toggleTheme={toggleTheme}
              />
            )}

            {(currentTab === 'tools' || currentTab === 'scan') && (
              <ScanHubScreen
                onNavigateToWifiAnalyzer={() => setActiveScreen('wifi-analyzer')}
                onNavigateToUrlScanner={() => setActiveScreen('url-scanner')}
                onNavigateToQrScanner={() => setActiveScreen('qr-scanner')}
                onNavigateToPermissionAnalyzer={() => setActiveScreen('permission-analyzer')}
                isDark={isDark}
              />
            )}

            {currentTab === 'history' && <HistoryScreen isDark={isDark} />}

            {(currentTab === 'awareness' || currentTab === 'learn') && (
              <AwarenessScreen isDark={isDark} />
            )}

            {(currentTab === 'settings' || currentTab === 'me') && (
              <ProfileScreen
                isDark={isDark}
                onNavigateToScanners={() => setCurrentTab('tools')}
                onReplayIntro={() => setHasOnboarded(false)}
                toggleTheme={toggleTheme}
              />
            )}

            {/* Floating Liquid Glass Navigation Bar (4 Showcase Tabs) */}
            <GlassNavigationBar
              currentTab={currentTab}
              onSelectTab={(tab) => {
                setCurrentTab(tab);
                setActiveScreen('main');
              }}
              onQuickAction={() => setActiveScreen('url-scanner')}
              quickActionLabel="⚡ Quick Scan"
              isDark={isDark}
            />
          </View>
        )}

        {/* Global Auth Modal */}
        <AuthModal
          visible={showAuthModal}
          onClose={() => setShowAuthModal(false)}
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
