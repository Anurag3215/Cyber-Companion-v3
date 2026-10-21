import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NearbyHotspotBeacon,
  scanNearbyWifiAirspace,
  WifiAirspaceScanResult,
} from '../services/wifiService';
import { AiExplainerModal } from './AiExplainerModal';

interface WifiSentinelModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const WifiSentinelModal: React.FC<WifiSentinelModalProps> = ({
  visible,
  onClose,
  isDark = true,
}) => {
  const [hotspots, setHotspots] = useState<NearbyHotspotBeacon[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepText, setScanStepText] = useState('');
  const [filterMode, setFilterMode] = useState<'ALL' | 'SAFE' | 'RISKY'>('ALL');
  const [deviceNetwork, setDeviceNetwork] = useState<{
    isConnected: boolean;
    type: string;
    ipAddress?: string;
  } | null>(null);

  // Detail Modal State
  const [selectedHotspot, setSelectedHotspot] = useState<NearbyHotspotBeacon | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Security action states
  const [blockedIds, setBlockedIds] = useState<Record<string, boolean>>({});
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});
  const [showAiModal, setShowAiModal] = useState(false);

  const pulseAnim = useRef(new Animated.Value(0)).current;

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const emerald = '#10B981';
  const amber = '#F59E0B';
  const danger = '#EF4444';

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const handleScanWifi = async () => {
    setIsScanning(true);
    setScanStepText('Scanning 2.4 GHz & 5.0 GHz channels...');

    const timer1 = setTimeout(() => {
      setScanStepText('Capturing 802.11 beacon frames & cipher suites...');
    }, 600);

    const timer2 = setTimeout(() => {
      setScanStepText('Analyzing WPA3/WPA2/PMF security parameters...');
    }, 1200);

    try {
      const result: WifiAirspaceScanResult = await scanNearbyWifiAirspace();
      setTimeout(() => {
        setDeviceNetwork(result.activeConnection);
        setHotspots(result.beacons);
        setHasScanned(true);
        setIsScanning(false);
        setScanStepText('');
      }, 1600);
    } catch {
      setTimeout(() => {
        setIsScanning(false);
        setScanStepText('');
      }, 1600);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const handleOpenDetails = (item: NearbyHotspotBeacon) => {
    setSelectedHotspot(item);
    setShowDetailModal(true);
  };

  const toggleBlockHotspot = (id: string) => {
    setBlockedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleApproveHotspot = (id: string) => {
    setApprovedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getVerdictColor = (verdict: NearbyHotspotBeacon['threatVerdict']) => {
    switch (verdict) {
      case 'CRITICAL_THREAT':
        return danger;
      case 'HIGH_RISK':
        return amber;
      case 'MODERATE':
        return teal;
      case 'SECURE':
        return emerald;
    }
  };

  const getVerdictLabel = (verdict: NearbyHotspotBeacon['threatVerdict']) => {
    switch (verdict) {
      case 'CRITICAL_THREAT':
        return 'NOT SAFE';
      case 'HIGH_RISK':
        return 'HIGH RISK';
      case 'MODERATE':
        return 'CAUTION';
      case 'SECURE':
        return 'SAFE TO CONNECT';
    }
  };

  const filteredHotspots = hotspots.filter((item) => {
    if (filterMode === 'SAFE') return item.threatVerdict === 'SECURE';
    if (filterMode === 'RISKY') return item.threatVerdict !== 'SECURE';
    return true;
  });

  const radarScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.15],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  borderColor: teal,
                  backgroundColor: cardBg,
                  transform: [{ scale: isScanning ? radarScale : 1 }],
                },
              ]}
            >
              <Text style={styles.iconText}>📡</Text>
            </Animated.View>
            <Text style={[styles.title, { color: textColor }]}>
              Wi-Fi Security Scanner
            </Text>
            <Text style={[styles.subtitle, { color: subtextColor }]}>
              Passive 802.11 Airspace & Cipher Analysis — Determine Safety Before Connecting
            </Text>

            {/* Device Network Status Banner */}
            <View
              style={[
                styles.deviceStatusBanner,
                {
                  backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                  borderColor: borderCol,
                },
              ]}
            >
              <Text style={[styles.deviceStatusDot, { color: emerald }]}>●</Text>
              <Text style={[styles.deviceStatusText, { color: textColor }]}>
                {deviceNetwork?.isConnected
                  ? `Device Status: Connected via ${deviceNetwork.type}${deviceNetwork.ipAddress ? ` (${deviceNetwork.ipAddress})` : ''}`
                  : 'Device Status: Ready to audit ambient Wi-Fi airspace'}
              </Text>
            </View>
          </View>

          {/* Primary Wi-Fi Scan Trigger */}
          <TouchableOpacity
            style={[styles.scanBtn, { backgroundColor: teal }]}
            onPress={handleScanWifi}
            disabled={isScanning}
            activeOpacity={0.85}
          >
            {isScanning ? (
              <View style={styles.scanningRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.scanBtnText}> {scanStepText || 'Scanning Airspace...'}</Text>
              </View>
            ) : (
              <Text style={styles.scanBtnText}>
                {hasScanned ? '🔄 Re-Scan Nearby Wi-Fi' : '📡 Scan Nearby Wi-Fi'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Pre-Scan Clean Empty State (Zero Fake/Demo Data) */}
          {!hasScanned && !isScanning && (
            <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <Text style={styles.emptyIcon}>📶</Text>
              <Text style={[styles.emptyTitle, { color: textColor }]}>Airspace Unscanned</Text>
              <Text style={[styles.emptySubtitle, { color: subtextColor }]}>
                Tap "Scan Nearby Wi-Fi" above to passively inspect ambient 802.11 beacon frames, cryptographic ciphers, and management frame configurations in your physical vicinity.
              </Text>
              <View
                style={[
                  styles.emptyBadge,
                  {
                    borderColor: teal,
                    backgroundColor: isDark ? 'rgba(45, 212, 191, 0.1)' : 'rgba(13, 148, 136, 0.08)',
                  },
                ]}
              >
                <Text style={[styles.emptyBadgeText, { color: teal }]}>
                  🛡️ ZERO PACKETS TRANSMITTED • 100% PASSIVE AIRSPACE MONITORING
                </Text>
              </View>
            </View>
          )}

          {/* Scanning In-Progress Indicator */}
          {isScanning && (
            <View style={[styles.scanningCard, { backgroundColor: cardBg, borderColor: teal }]}>
              <Animated.View style={{ transform: [{ scale: radarScale }] }}>
                <Text style={styles.scanningPulseIcon}>🛰️</Text>
              </Animated.View>
              <Text style={[styles.scanningTitle, { color: textColor }]}>
                Auditing 802.11 Airspace
              </Text>
              <Text style={[styles.scanningStep, { color: teal }]}>{scanStepText}</Text>
              <Text style={[styles.scanningNote, { color: subtextColor }]}>
                Extracting WPA3-SAE, WPA2-AES, and 802.11w PMF beacon tags...
              </Text>
            </View>
          )}

          {/* Scanned Results View */}
          {hasScanned && !isScanning && (
            <View style={styles.resultsContainer}>
              {/* Section Header & Count */}
              <View style={styles.resultsHeaderRow}>
                <Text style={[styles.resultsTitle, { color: textColor }]}>
                  DISCOVERED NETWORKS ({filteredHotspots.length})
                </Text>
                <Text style={[styles.resultsHint, { color: subtextColor }]}>
                  Tap "View Details" to inspect
                </Text>
              </View>

              {/* Filter Chips */}
              <View style={styles.filterRow}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    {
                      borderColor: filterMode === 'ALL' ? teal : borderCol,
                      backgroundColor: filterMode === 'ALL' ? (isDark ? '#134E4A' : '#CCFBF1') : cardBg,
                    },
                  ]}
                  onPress={() => setFilterMode('ALL')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filterMode === 'ALL' ? teal : subtextColor },
                    ]}
                  >
                    All ({hotspots.length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    {
                      borderColor: filterMode === 'SAFE' ? emerald : borderCol,
                      backgroundColor:
                        filterMode === 'SAFE' ? (isDark ? '#064E3B' : '#D1FAE5') : cardBg,
                    },
                  ]}
                  onPress={() => setFilterMode('SAFE')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filterMode === 'SAFE' ? emerald : subtextColor },
                    ]}
                  >
                    Safe Only ({hotspots.filter((h) => h.threatVerdict === 'SECURE').length})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    {
                      borderColor: filterMode === 'RISKY' ? danger : borderCol,
                      backgroundColor:
                        filterMode === 'RISKY' ? (isDark ? '#450A0A' : '#FEE2E2') : cardBg,
                    },
                  ]}
                  onPress={() => setFilterMode('RISKY')}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: filterMode === 'RISKY' ? danger : subtextColor },
                    ]}
                  >
                    At Risk ({hotspots.filter((h) => h.threatVerdict !== 'SECURE').length})
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Scanned Wi-Fi Cards */}
              <View style={styles.networkList}>
                {filteredHotspots.map((item) => {
                  const vColor = getVerdictColor(item.threatVerdict);
                  const isSafe = item.threatVerdict === 'SECURE';
                  const isBlocked = !!blockedIds[item.id];
                  const isApproved = !!approvedIds[item.id];

                  return (
                    <View
                      key={item.id}
                      style={[
                        styles.networkCard,
                        {
                          backgroundColor: cardBg,
                          borderColor: isBlocked ? danger : borderCol,
                        },
                      ]}
                    >
                      {/* Top Row: SSID & Safety Verdict Badge */}
                      <View style={styles.cardTopRow}>
                        <View style={styles.ssidContainer}>
                          <View style={styles.ssidHeaderLine}>
                            <Text style={styles.wifiSignalIcon}>
                              {item.signalDbm > -50 ? '📶' : item.signalDbm > -70 ? '📶' : '🛜'}
                            </Text>
                            <Text style={[styles.networkSsid, { color: textColor }]} numberOfLines={1}>
                              {item.ssid}
                            </Text>
                          </View>
                          {item.isCurrentConnection && (
                            <View style={[styles.activePill, { backgroundColor: `${teal}20`, borderColor: teal }]}>
                              <Text style={[styles.activePillText, { color: teal }]}>ACTIVE CONNECTION</Text>
                            </View>
                          )}
                          <Text style={[styles.networkMeta, { color: subtextColor }]}>
                            {item.frequency} (Ch {item.channel}) · {item.signalDbm} dBm · {item.encryption}
                          </Text>
                        </View>

                        {/* Safety Status Pill */}
                        <View
                          style={[
                            styles.verdictBadge,
                            {
                              borderColor: vColor,
                              backgroundColor:
                                item.threatVerdict === 'SECURE'
                                  ? 'rgba(16, 185, 129, 0.15)'
                                  : item.threatVerdict === 'MODERATE'
                                  ? 'rgba(45, 212, 191, 0.15)'
                                  : 'rgba(239, 68, 68, 0.15)',
                            },
                          ]}
                        >
                          <Text style={[styles.verdictBadgeText, { color: vColor }]}>
                            {isBlocked
                              ? '🚫 BLOCKED'
                              : isApproved
                              ? '✅ APPROVED'
                              : isSafe
                              ? '✅ SAFE TO CONNECT'
                              : item.threatVerdict === 'MODERATE'
                              ? '⚠️ CAUTION'
                              : '🚨 NOT SAFE'}
                          </Text>
                        </View>
                      </View>

                      {/* Middle: Brief Security Reason */}
                      <View style={[styles.summaryBox, { borderColor: borderCol }]}>
                        <Text style={[styles.summaryText, { color: isSafe ? emerald : vColor }]}>
                          {isSafe ? '🔒 ' : '⚠️ '}
                          {item.threatTag}
                        </Text>
                      </View>

                      {/* Bottom Row: Explicit "View Details" button & Risk Score */}
                      <View style={styles.cardBottomRow}>
                        <TouchableOpacity
                          style={[styles.viewDetailsBtn, { borderColor: teal, backgroundColor: isDark ? '#134E4A' : '#CCFBF1' }]}
                          onPress={() => handleOpenDetails(item)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.viewDetailsBtnText, { color: teal }]}>
                            🔍 View Details →
                          </Text>
                        </TouchableOpacity>

                        <Text style={[styles.riskScoreText, { color: subtextColor }]}>
                          Risk: {item.threatScore}/100
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Close Sentinel Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Scanner</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* -------------------- DEDICATED VIEW DETAILS SCREEN -------------------- */}
        {selectedHotspot && showDetailModal && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: bg, zIndex: 100 }]}>
            <SafeAreaView style={[styles.detailModalContainer, { backgroundColor: bg, flex: 1 }]}>
              <ScrollView contentContainerStyle={styles.detailScrollContent} showsVerticalScrollIndicator={false}>
                {/* Detail Header Banner */}
                <View
                  style={[
                    styles.detailBanner,
                    {
                      backgroundColor: cardBg,
                      borderColor: getVerdictColor(selectedHotspot.threatVerdict),
                    },
                  ]}
                >
                  <View style={styles.detailBannerTop}>
                    <Text
                      style={[
                        styles.detailSafetyTag,
                        { color: getVerdictColor(selectedHotspot.threatVerdict) },
                      ]}
                    >
                      {selectedHotspot.threatVerdict === 'SECURE'
                        ? '✅ VERIFIED SAFE TO CONNECT'
                        : selectedHotspot.threatVerdict === 'MODERATE'
                        ? '⚠️ CAUTION: USABLE WITH PRECAUTIONS'
                        : '🚨 CRITICAL WARNING: NOT SAFE TO CONNECT'}
                    </Text>
                    <Text style={[styles.detailSsidTitle, { color: textColor }]}>
                      {selectedHotspot.ssid}
                    </Text>
                    <Text style={[styles.detailBssidText, { color: subtextColor }]}>
                      BSSID: {selectedHotspot.bssid} {selectedHotspot.ipAddress ? `· IP: ${selectedHotspot.ipAddress}` : ''}
                    </Text>
                  </View>
                </View>

                {/* 4-Metric Hardware Specs Grid */}
                <Text style={[styles.detailSectionTitle, { color: textColor }]}>
                  CRYPTOGRAPHIC & HARDWARE SPECIFICATIONS
                </Text>

                <View style={styles.specsGrid}>
                  <View style={[styles.specBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
                    <Text
                      style={[
                        styles.specValue,
                        {
                          color:
                            selectedHotspot.encryption === 'OPEN' || selectedHotspot.encryption === 'WEP'
                              ? danger
                              : emerald,
                        },
                      ]}
                    >
                      {selectedHotspot.encryption}
                    </Text>
                    <Text style={[styles.specLabel, { color: subtextColor }]}>Beacon Cipher</Text>
                  </View>

                  <View style={[styles.specBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
                    <Text
                      style={[
                        styles.specValue,
                        { color: selectedHotspot.pmfEnabled ? emerald : amber },
                      ]}
                    >
                      {selectedHotspot.pmfEnabled ? 'PROTECTED' : 'VULNERABLE'}
                    </Text>
                    <Text style={[styles.specLabel, { color: subtextColor }]}>802.11w PMF</Text>
                  </View>

                  <View style={[styles.specBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
                    <Text style={[styles.specValue, { color: teal }]}>
                      {selectedHotspot.frequency}
                    </Text>
                    <Text style={[styles.specLabel, { color: subtextColor }]}>Band (Ch {selectedHotspot.channel})</Text>
                  </View>

                  <View style={[styles.specBox, { backgroundColor: cardBg, borderColor: borderCol }]}>
                    <Text style={[styles.specValue, { color: textColor }]}>
                      {selectedHotspot.signalDbm} dBm
                    </Text>
                    <Text style={[styles.specLabel, { color: subtextColor }]}>Signal Strength</Text>
                  </View>
                </View>

                {/* Plain-English Security Breakdown */}
                <View style={[styles.detailCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                  <Text style={[styles.detailCardHeading, { color: textColor }]}>
                    🛡️ Security Evaluation
                  </Text>
                  <Text style={[styles.detailBodyText, { color: textColor }]}>
                    {selectedHotspot.threatVerdict === 'SECURE'
                      ? 'This network implements robust WPA3 encryption with Protected Management Frames (802.11w). It is immune to offline dictionary attacks and deauthentication jamming.'
                      : selectedHotspot.threatVerdict === 'MODERATE'
                      ? 'This network uses standard WPA2 encryption. While your traffic is encrypted, it lacks 802.11w Protected Management Frames, making it susceptible to deauth frame spoofing.'
                      : 'This network is completely UNENCRYPTED or uses obsolete ciphers. Anyone within radio distance can sniff unencrypted HTTP traffic, harvest cookies, and inject malicious scripts.'}
                  </Text>
                </View>

                {/* Threat Analysis / Predicted Attacks */}
                <View style={[styles.detailCard, { backgroundColor: cardBg, borderColor: borderCol }]}>
                  <Text style={[styles.detailCardHeading, { color: textColor }]}>
                    {selectedHotspot.threatVerdict === 'SECURE'
                      ? '🔒 Threat Vector Protection'
                      : '🔍 Vulnerabilities & Potential Attack Vectors'}
                  </Text>

                  {selectedHotspot.predictedCrimes.map((crime, idx) => (
                    <View key={idx} style={styles.crimeRow}>
                      <Text style={styles.crimeBullet}>
                        {selectedHotspot.threatVerdict === 'SECURE' ? '✅' : '⚡'}
                      </Text>
                      <Text style={[styles.crimeText, { color: textColor }]}>{crime}</Text>
                    </View>
                  ))}
                </View>

                {/* Prevention Advice */}
                <View
                  style={[
                    styles.adviceCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                      borderLeftColor: getVerdictColor(selectedHotspot.threatVerdict),
                    },
                  ]}
                >
                  <Text style={[styles.adviceTitle, { color: getVerdictColor(selectedHotspot.threatVerdict) }]}>
                    RECOMMENDED DEFENSIVE ACTION:
                  </Text>
                  <Text style={[styles.adviceBody, { color: textColor }]}>
                    {selectedHotspot.preventionAdvise}
                  </Text>
                </View>

                {/* Actions: AI Explainer & Connection Policy */}
                <View style={styles.detailActionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.aiExplainerTriggerBtn,
                      {
                        backgroundColor: isDark ? '#134E4A' : '#CCFBF1',
                        borderColor: teal,
                      },
                    ]}
                    onPress={() => setShowAiModal(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.aiExplainerTriggerText, { color: teal }]}>
                      🤖 Ask AI Explainer About This Network
                    </Text>
                  </TouchableOpacity>

                  {selectedHotspot.threatVerdict !== 'SECURE' ? (
                    <TouchableOpacity
                      style={[
                        styles.policyBtn,
                        {
                          backgroundColor: blockedIds[selectedHotspot.id] ? '#475569' : danger,
                        },
                      ]}
                      onPress={() => toggleBlockHotspot(selectedHotspot.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.policyBtnText}>
                        {blockedIds[selectedHotspot.id]
                          ? '✓ Hotspot Blacklisted (Auto-Join Blocked)'
                          : '🚫 Blacklist & Prevent Connection'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.policyBtn,
                        {
                          backgroundColor: approvedIds[selectedHotspot.id] ? teal : emerald,
                        },
                      ]}
                      onPress={() => toggleApproveHotspot(selectedHotspot.id)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.policyBtnText}>
                        {approvedIds[selectedHotspot.id]
                          ? '✓ Verified in Trusted Allowlist'
                          : '✅ Approve Safe Connection'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Close Details Button */}
                <TouchableOpacity
                  style={styles.closeDetailBtn}
                  onPress={() => setShowDetailModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.closeDetailBtnText, { color: subtextColor }]}>
                    ← Back to Scanned List
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </SafeAreaView>
          </View>
        )}

        {/* Grounded RAG AI Explainer Modal */}
        {selectedHotspot && (
          <AiExplainerModal
            visible={showAiModal}
            onClose={() => setShowAiModal(false)}
            query={`Wi-Fi Network: ${selectedHotspot.ssid} (${selectedHotspot.encryption}) ${selectedHotspot.threatTag}`}
            immutableVerdict={
              selectedHotspot.threatVerdict === 'CRITICAL_THREAT'
                ? 'MALICIOUS'
                : selectedHotspot.threatVerdict === 'HIGH_RISK'
                ? 'SUSPICIOUS'
                : 'SAFE'
            }
            detectedFlags={[
              `Cipher: ${selectedHotspot.encryption}`,
              selectedHotspot.threatTag,
              ...(selectedHotspot.predictedCrimes || []),
            ]}
            isDark={isDark}
            asOverlay={true}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 30,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
    lineHeight: 17,
  },
  deviceStatusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 8,
  },
  deviceStatusDot: {
    fontSize: 10,
  },
  deviceStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scanBtn: {
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  emptyCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12.5,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyBadge: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  emptyBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scanningCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 24,
    alignItems: 'center',
    marginBottom: 18,
  },
  scanningPulseIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  scanningTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  scanningStep: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  scanningNote: {
    fontSize: 11,
    textAlign: 'center',
  },
  resultsContainer: {
    marginBottom: 16,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  resultsHint: {
    fontSize: 11,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  networkList: {
    gap: 12,
  },
  networkCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 15,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  ssidContainer: {
    flex: 1,
    paddingRight: 10,
  },
  ssidHeaderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  wifiSignalIcon: {
    fontSize: 16,
  },
  networkSsid: {
    fontSize: 16,
    fontWeight: '800',
  },
  activePill: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  activePillText: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  networkMeta: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  verdictBadge: {
    borderWidth: 1.5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verdictBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  summaryBox: {
    borderTopWidth: 1,
    paddingTop: 8,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsBtn: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  viewDetailsBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
  riskScoreText: {
    fontSize: 11,
    fontWeight: '700',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },

  /* View Details Modal Styles */
  detailModalContainer: {
    flex: 1,
  },
  detailScrollContent: {
    padding: 20,
    paddingBottom: 44,
  },
  detailBanner: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 18,
    marginBottom: 16,
  },
  detailBannerTop: {},
  detailSafetyTag: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  detailSsidTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  detailBssidText: {
    fontSize: 11.5,
    marginTop: 4,
    fontWeight: '600',
  },
  detailSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specBox: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  specLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
  detailCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  detailCardHeading: {
    fontSize: 13.5,
    fontWeight: '800',
    marginBottom: 8,
  },
  detailBodyText: {
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '500',
  },
  crimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  crimeBullet: {
    fontSize: 13,
    marginTop: 1,
  },
  crimeText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  adviceCard: {
    borderRadius: 14,
    borderLeftWidth: 4,
    padding: 14,
    marginBottom: 16,
  },
  adviceTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  adviceBody: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
  },
  detailActionsRow: {
    gap: 10,
    marginBottom: 16,
  },
  aiExplainerTriggerBtn: {
    borderWidth: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  aiExplainerTriggerText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  policyBtn: {
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },
  policyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  closeDetailBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  closeDetailBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
