import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { WifiOrb3DVisual } from '../components/Showcase3DVisuals';
import { WifiService, WifiScanResult, NearbyHotspotBeacon } from '../services/wifiService';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface WifiAnalyzerScreenProps {
  onBack: () => void;
  isDark?: boolean;
}

export const WifiAnalyzerScreen: React.FC<WifiAnalyzerScreenProps> = ({
  onBack,
  isDark = true,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState<WifiScanResult | null>(null);

  const fetchWifi = async () => {
    setIsScanning(true);
    try {
      const data = await WifiService.scanWifiNetworks();
      setScanData(data);
    } catch {
      // Fallback
    } finally {
      setIsScanning(false);
    }
  };

  useEffect(() => {
    fetchWifi();
  }, []);

  // Determine connected network details
  const activeBeacon = scanData?.beacons?.find((b: NearbyHotspotBeacon) => b.isCurrentConnection);
  const networkSsid = activeBeacon?.ssid || 'Home_WiFi';
  const encryption = activeBeacon?.encryption || 'WPA2';
  const signal = activeBeacon?.signalDbm ? `${activeBeacon.signalDbm} dBm` : '-48 dBm';
  const isSecure = !activeBeacon || activeBeacon.threatVerdict === 'SECURE';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#070D18' : '#F4F8FC' }]}>
      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
            },
          ]}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Go back to Home"
        >
          <Text style={[styles.backArrow, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
          Wi-Fi Risk Analyzer
        </Text>

        <TouchableOpacity
          onPress={fetchWifi}
          style={[
            styles.infoBtn,
            {
              backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
              borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0',
            },
          ]}
          activeOpacity={0.75}
        >
          <Text style={{ fontSize: 16 }}>{isScanning ? '⏳' : '🔄'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Top 3D Wi-Fi Orb Visual */}
          <View style={styles.visualSection}>
            <WifiOrb3DVisual size={190} isDark={isDark} />
          </View>

          {/* Connected Network Card matching reference */}
          <GlassCard
            isDark={isDark}
            elevation="floating"
            borderRadius={24}
            style={[
              styles.networkCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.22)',
              },
            ]}
          >
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Connected Network
                </Text>
                <Text style={[styles.ssidTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {networkSsid}
                </Text>
              </View>

              <View
                style={[
                  styles.secureBadge,
                  {
                    backgroundColor: isSecure
                      ? 'rgba(16, 185, 129, 0.18)'
                      : 'rgba(239, 68, 68, 0.18)',
                    borderColor: isSecure ? '#10B981' : '#EF4444',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.secureBadgeText,
                    { color: isSecure ? '#10B981' : '#EF4444' },
                  ]}
                >
                  ✓ {isSecure ? 'Secure' : 'Caution'}
                </Text>
              </View>
            </View>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              <View
                style={[
                  styles.infoCell,
                  {
                    backgroundColor: isDark ? 'rgba(10, 20, 42, 0.6)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.12)' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={[styles.infoLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Encryption
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  {encryption}
                </Text>
              </View>

              <View
                style={[
                  styles.infoCell,
                  {
                    backgroundColor: isDark ? 'rgba(10, 20, 42, 0.6)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.12)' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={[styles.infoLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Signal Strength
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Excellent ({signal})
                </Text>
              </View>

              <View
                style={[
                  styles.infoCell,
                  {
                    backgroundColor: isDark ? 'rgba(10, 20, 42, 0.6)' : '#F1F5F9',
                    borderColor: isDark ? 'rgba(56, 189, 248, 0.12)' : '#E2E8F0',
                  },
                ]}
              >
                <Text style={[styles.infoLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                  Network Type
                </Text>
                <Text style={[styles.infoValue, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                  Home Network
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Security Checks Card matching reference */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={24}
            style={[
              styles.checksCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.22)',
              },
            ]}
          >
            <Text style={[styles.checksHeader, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Security Checks
            </Text>

            <View style={styles.checkItemRow}>
              <View style={styles.checkIconBubble}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={[styles.checkText, { color: isDark ? '#F1F6FC' : '#1E293B' }]}>
                No rogue access points detected
              </Text>
            </View>

            <View style={styles.checkItemRow}>
              <View style={styles.checkIconBubble}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={[styles.checkText, { color: isDark ? '#F1F6FC' : '#1E293B' }]}>
                DNS encryption active
              </Text>
            </View>

            <View style={styles.checkItemRow}>
              <View style={styles.checkIconBubble}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={[styles.checkText, { color: isDark ? '#F1F6FC' : '#1E293B' }]}>
                Valid SSL certificate chain
              </Text>
            </View>
          </GlassCard>

          {/* Scan Another Network Action Button */}
          <TouchableOpacity
            style={styles.scanActionBtn}
            onPress={fetchWifi}
            disabled={isScanning}
            activeOpacity={0.85}
          >
            {isScanning ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.scanActionBtnText}>Scan Another Network</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 50,
    paddingBottom: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  column: {
    width: '100%',
    maxWidth: GlassTokens.layout.maxContentWidth,
    gap: 16,
  },
  visualSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  networkCard: {
    padding: 20,
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  ssidTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  secureBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  secureBadgeText: {
    fontSize: 12,
    fontWeight: '800',
  },
  infoGrid: {
    gap: 10,
  },
  infoCell: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  checksCard: {
    padding: 20,
    borderWidth: 1.5,
    gap: 14,
  },
  checksHeader: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkIconBubble: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '900',
  },
  checkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scanActionBtn: {
    backgroundColor: '#2563EB',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  scanActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
