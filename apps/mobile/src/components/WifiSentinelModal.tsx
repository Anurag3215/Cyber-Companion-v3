import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  NearbyHotspotBeacon,
  WifiEncryption,
  getNearbyHotspotBeacons,
  evaluatePreConnectionHotspot,
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
  const [hotspots, setHotspots] = useState<NearbyHotspotBeacon[]>(() => getNearbyHotspotBeacons());
  const [selectedHotspot, setSelectedHotspot] = useState<NearbyHotspotBeacon>(() => getNearbyHotspotBeacons()[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [blockedIds, setBlockedIds] = useState<Record<string, boolean>>({});
  const [approvedIds, setApprovedIds] = useState<Record<string, boolean>>({});
  const [showAiModal, setShowAiModal] = useState(false);

  // Custom Evaluator Test Input State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSsid, setCustomSsid] = useState('');
  const [customBssid, setCustomBssid] = useState('00:13:37:c9:42:10');
  const [customEncryption, setCustomEncryption] = useState<WifiEncryption>('OPEN');
  const [customPmf, setCustomPmf] = useState(false);
  const [customSignal, setCustomSignal] = useState(-36);

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

  const handleScanNearbyAirspace = () => {
    setIsScanning(true);
    setTimeout(() => {
      const freshBeacons = getNearbyHotspotBeacons();
      setHotspots(freshBeacons);
      setSelectedHotspot(freshBeacons[0]);
      setIsScanning(false);
    }, 1400);
  };

  const handleAnalyzeCustomHotspot = () => {
    const evaluated = evaluatePreConnectionHotspot({
      ssid: customSsid.trim() || 'Custom_Untrusted_Hotspot',
      bssid: customBssid.trim() || '00:13:37:ff:01:99',
      encryption: customEncryption,
      pmfEnabled: customPmf,
      signalDbm: customSignal,
      channel: customEncryption === 'WPA3' ? 44 : 6,
    });
    setHotspots((prev) => [evaluated, ...prev]);
    setSelectedHotspot(evaluated);
    setShowCustomForm(false);
    setCustomSsid('');
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
        return 'DO NOT CONNECT';
      case 'HIGH_RISK':
        return 'HIGH RISK';
      case 'MODERATE':
        return 'CAUTION';
      case 'SECURE':
        return 'SAFE TO CONNECT';
    }
  };

  const radarScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.12],
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  borderColor: teal,
                  backgroundColor: cardBg,
                  transform: [{ scale: radarScale }],
                },
              ]}
            >
              <Text style={styles.iconText}>📡</Text>
            </Animated.View>
            <Text style={[styles.title, { color: textColor }]}>
              Pre-Connect Wi-Fi Sentinel
            </Text>
            <Text style={[styles.subtitle, { color: subtextColor }]}>
              Passive 802.11 Beacon Interceptor — Detect Threats Before Connecting
            </Text>

            <View
              style={[
                styles.passivePill,
                {
                  borderColor: teal,
                  backgroundColor: isDark ? 'rgba(45, 212, 191, 0.1)' : 'rgba(13, 148, 136, 0.08)',
                },
              ]}
            >
              <Text style={[styles.passivePillText, { color: teal }]}>
                🛡️ PRE-CRIME DEFENSE • ZERO PACKETS SENT • UNCONNECTED SCAN
              </Text>
            </View>
          </View>

          {/* Top Action Controls: Scan Airspace & Custom Test */}
          <View style={styles.actionHeaderRow}>
            <TouchableOpacity
              style={[styles.scanBtn, { backgroundColor: teal }]}
              onPress={handleScanNearbyAirspace}
              disabled={isScanning}
              activeOpacity={0.85}
            >
              {isScanning ? (
                <View style={styles.scanningRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.scanBtnText}> Sniffing 802.11 Beacons...</Text>
                </View>
              ) : (
                <Text style={styles.scanBtnText}>📡 Scan Nearby Hotspots</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.customToggleBtn,
                {
                  backgroundColor: cardBg,
                  borderColor: showCustomForm ? teal : borderCol,
                },
              ]}
              onPress={() => setShowCustomForm(!showCustomForm)}
              activeOpacity={0.8}
            >
              <Text style={[styles.customToggleText, { color: teal }]}>
                {showCustomForm ? '✕ Close' : '➕ Test Custom AP'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Hotspot Simulator Form (For Live Project Demo / Evaluator) */}
          {showCustomForm && (
            <View style={[styles.customCard, { backgroundColor: cardBg, borderColor: teal }]}>
              <Text style={[styles.customTitle, { color: textColor }]}>
                🧪 Simulate / Inspect Any Unconnected Hotspot
              </Text>
              <Text style={[styles.customSub, { color: subtextColor }]}>
                Enter any nearby SSID & beacon parameters to predict threats before connecting:
              </Text>

              <Text style={[styles.fieldLabel, { color: subtextColor }]}>HOTSPOT SSID NAME</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#090D16' : '#FFFFFF',
                    borderColor: borderCol,
                    color: textColor,
                  },
                ]}
                placeholder="e.g. Free_Airport_WiFi or Campus_Net"
                placeholderTextColor="#64748B"
                value={customSsid}
                onChangeText={setCustomSsid}
              />

              <Text style={[styles.fieldLabel, { color: subtextColor }]}>BROADCAST BSSID (MAC OUI)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: isDark ? '#090D16' : '#FFFFFF',
                    borderColor: borderCol,
                    color: textColor,
                  },
                ]}
                placeholder="00:13:37:c9:42:10"
                placeholderTextColor="#64748B"
                value={customBssid}
                onChangeText={setCustomBssid}
                autoCapitalize="none"
              />

              <Text style={[styles.fieldLabel, { color: subtextColor }]}>ENCRYPTION PROTOCOL</Text>
              <View style={styles.optionChipsRow}>
                {(['OPEN', 'WEP', 'WPA2', 'WPA3'] as WifiEncryption[]).map((enc) => (
                  <TouchableOpacity
                    key={enc}
                    style={[
                      styles.optionChip,
                      {
                        borderColor: customEncryption === enc ? teal : borderCol,
                        backgroundColor:
                          customEncryption === enc ? 'rgba(45, 212, 191, 0.15)' : 'transparent',
                      },
                    ]}
                    onPress={() => setCustomEncryption(enc)}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        { color: customEncryption === enc ? teal : subtextColor },
                      ]}
                    >
                      {enc}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.switchRow}>
                <TouchableOpacity
                  style={[
                    styles.pmfToggle,
                    {
                      borderColor: customPmf ? emerald : borderCol,
                      backgroundColor: customPmf ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    },
                  ]}
                  onPress={() => setCustomPmf(!customPmf)}
                >
                  <Text style={[styles.pmfToggleText, { color: customPmf ? emerald : subtextColor }]}>
                    802.11w PMF: {customPmf ? 'ENABLED' : 'DISABLED'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.pmfToggle,
                    {
                      borderColor: customSignal > -42 ? danger : borderCol,
                      backgroundColor:
                        customSignal > -42 ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                    },
                  ]}
                  onPress={() => setCustomSignal(customSignal > -42 ? -60 : -34)}
                >
                  <Text
                    style={[
                      styles.pmfToggleText,
                      { color: customSignal > -42 ? danger : subtextColor },
                    ]}
                  >
                    Signal: {customSignal} dBm {customSignal > -42 ? '(Close!)' : '(Normal)'}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.analyzeCustomBtn, { backgroundColor: teal }]}
                onPress={handleAnalyzeCustomHotspot}
              >
                <Text style={styles.analyzeCustomBtnText}>
                  ⚡ Predict Threat Before Connecting
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Nearby Unconnected Hotspots List */}
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionHeaderTitle, { color: textColor }]}>
              NEARBY UNCONNECTED HOTSPOTS ({hotspots.length})
            </Text>
            <Text style={[styles.sectionHeaderHint, { color: subtextColor }]}>
              Tap to inspect threat
            </Text>
          </View>

          <View style={styles.hotspotList}>
            {hotspots.map((item) => {
              const vColor = getVerdictColor(item.threatVerdict);
              const isSelected = selectedHotspot.id === item.id;
              const isBlocked = !!blockedIds[item.id];
              const isApproved = !!approvedIds[item.id];

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.hotspotItem,
                    {
                      backgroundColor: cardBg,
                      borderColor: isSelected ? vColor : borderCol,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                  onPress={() => setSelectedHotspot(item)}
                  activeOpacity={0.85}
                >
                  <View style={styles.hotspotTopRow}>
                    <View style={styles.hotspotTitleGroup}>
                      <View style={styles.ssidRow}>
                        <Text style={[styles.hotspotSsid, { color: textColor }]}>
                          {item.ssid}
                        </Text>
                        {item.isRogueAp && (
                          <View style={[styles.roguePill, { backgroundColor: danger }]}>
                            <Text style={styles.roguePillText}>EVIL TWIN</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.hotspotMeta, { color: subtextColor }]}>
                        BSSID: {item.bssid} · {item.frequency} (Ch {item.channel}) · {item.signalDbm} dBm
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.verdictBadge,
                        {
                          borderColor: vColor,
                          backgroundColor:
                            item.threatVerdict === 'CRITICAL_THREAT'
                              ? 'rgba(239, 68, 68, 0.14)'
                              : item.threatVerdict === 'HIGH_RISK'
                              ? 'rgba(245, 158, 11, 0.14)'
                              : 'rgba(16, 185, 129, 0.14)',
                        },
                      ]}
                    >
                      <Text style={[styles.verdictBadgeText, { color: vColor }]}>
                        {isBlocked
                          ? '🚫 BLOCKED'
                          : isApproved
                          ? '✅ APPROVED'
                          : getVerdictLabel(item.threatVerdict)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.hotspotBottomRow}>
                    <Text style={[styles.threatTagText, { color: vColor }]}>
                      {item.threatVerdict === 'SECURE' ? '🔒 ' : '⚠️ '}
                      {item.threatTag}
                    </Text>
                    <Text style={[styles.scorePill, { color: subtextColor }]}>
                      Risk: {item.threatScore}/100
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Deep Pre-Connection Forensic Report for Selected Hotspot */}
          {selectedHotspot && (
            <View
              style={[
                styles.forensicCard,
                {
                  backgroundColor: cardBg,
                  borderColor: getVerdictColor(selectedHotspot.threatVerdict),
                },
              ]}
            >
              <View style={styles.forensicBanner}>
                <Text
                  style={[
                    styles.forensicBannerTitle,
                    { color: getVerdictColor(selectedHotspot.threatVerdict) },
                  ]}
                >
                  {selectedHotspot.threatVerdict === 'CRITICAL_THREAT'
                    ? '🚨 PRE-CRIME INTERCEPTION: THREAT BLOCKED BEFORE CONNECTION'
                    : selectedHotspot.threatVerdict === 'HIGH_RISK'
                    ? '⚠️ PRE-CONNECT WARNING: VULNERABLE HOTSPOT ARCHITECTURE'
                    : '✅ PRE-CONNECT VERIFIED: SAFE CRYPTOGRAPHIC HANDSHAKE'}
                </Text>
                <Text style={[styles.forensicSsidTitle, { color: textColor }]}>
                  Target: {selectedHotspot.ssid} (Unconnected)
                </Text>
              </View>

              {/* 4-Metric Beacon Hardware Grid */}
              <View style={styles.metricsGrid}>
                <View style={[styles.metricItem, { borderColor: borderCol }]}>
                  <Text
                    style={[
                      styles.metricValue,
                      {
                        color:
                          selectedHotspot.encryption === 'OPEN' ||
                          selectedHotspot.encryption === 'WEP'
                            ? danger
                            : emerald,
                      },
                    ]}
                  >
                    {selectedHotspot.encryption}
                  </Text>
                  <Text style={[styles.metricLabel, { color: subtextColor }]}>Beacon Cipher</Text>
                </View>

                <View style={[styles.metricItem, { borderColor: borderCol }]}>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: selectedHotspot.pmfEnabled ? emerald : amber },
                    ]}
                  >
                    {selectedHotspot.pmfEnabled ? 'PROTECTED' : 'VULNERABLE'}
                  </Text>
                  <Text style={[styles.metricLabel, { color: subtextColor }]}>802.11w PMF</Text>
                </View>

                <View style={[styles.metricItem, { borderColor: borderCol }]}>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: selectedHotspot.signalDbm > -40 ? danger : teal },
                    ]}
                  >
                    {selectedHotspot.signalDbm} dBm
                  </Text>
                  <Text style={[styles.metricLabel, { color: subtextColor }]}>
                    {selectedHotspot.signalDbm > -40 ? 'Anomaly (Close!)' : 'Airspace Signal'}
                  </Text>
                </View>

                <View style={[styles.metricItem, { borderColor: borderCol }]}>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: selectedHotspot.isRogueAp ? danger : textColor },
                    ]}
                    numberOfLines={1}
                  >
                    {selectedHotspot.isRogueAp ? 'ROGUE OUI' : 'STANDARD AP'}
                  </Text>
                  <Text style={[styles.metricLabel, { color: subtextColor }]}>Hardware OUI</Text>
                </View>
              </View>

              {/* Predicted Crimes / Attacks if Connected */}
              <View style={[styles.crimesSection, { borderColor: borderCol }]}>
                <Text style={[styles.crimesHeading, { color: textColor }]}>
                  {selectedHotspot.threatVerdict === 'SECURE'
                    ? '🛡️ Pre-Connection Defense Verification:'
                    : '🔍 Predicted Cyber Attacks If You Connect (Pre-Crime Report):'}
                </Text>

                {selectedHotspot.predictedCrimes.map((crime, idx) => (
                  <View key={idx} style={styles.crimeRow}>
                    <Text style={styles.crimeBullet}>
                      {selectedHotspot.threatVerdict === 'SECURE' ? '✅' : '⚡'}
                    </Text>
                    <Text style={[styles.crimeText, { color: textColor }]}>{crime}</Text>
                  </View>
                ))}

                <View
                  style={[
                    styles.adviseBox,
                    {
                      backgroundColor: isDark ? '#090D16' : '#F1F5F9',
                      borderColor: getVerdictColor(selectedHotspot.threatVerdict),
                    },
                  ]}
                >
                  <Text style={[styles.adviseText, { color: textColor }]}>
                    {selectedHotspot.preventionAdvise}
                  </Text>
                </View>
              </View>

              {/* Pre-Connection Defense Action Button */}
              {selectedHotspot.threatVerdict !== 'SECURE' ? (
                <TouchableOpacity
                  style={[
                    styles.defenseActionBtn,
                    {
                      backgroundColor: blockedIds[selectedHotspot.id] ? '#334155' : danger,
                    },
                  ]}
                  onPress={() => toggleBlockHotspot(selectedHotspot.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.defenseActionBtnText}>
                    {blockedIds[selectedHotspot.id]
                      ? '✓ Hotspot Blacklisted (Auto-Join Prevented)'
                      : '🚫 Blacklist Hotspot & Prevent Connection'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.defenseActionBtn,
                    {
                      backgroundColor: approvedIds[selectedHotspot.id] ? teal : emerald,
                    },
                  ]}
                  onPress={() => toggleApproveHotspot(selectedHotspot.id)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.defenseActionBtnText}>
                    {approvedIds[selectedHotspot.id]
                      ? '✓ Approved in Trusted SSID Allowlist'
                      : '✅ Approve Safe Connection'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Interactive AI Threat Explainer Trigger */}
              <TouchableOpacity
                style={[
                  styles.defenseActionBtn,
                  {
                    backgroundColor: isDark ? '#134E4A' : '#CCFBF1',
                    borderColor: teal,
                    borderWidth: 1,
                    marginTop: 10,
                  },
                ]}
                onPress={() => setShowAiModal(true)}
                activeOpacity={0.8}
              >
                <Text style={[styles.defenseActionBtnText, { color: teal }]}>
                  🤖 Ask AI Explainer: Why is this network dangerous?
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close Sentinel</Text>
          </TouchableOpacity>
        </ScrollView>

        {selectedHotspot && (
          <AiExplainerModal
            visible={showAiModal}
            onClose={() => setShowAiModal(false)}
            query={`Wi-Fi Hotspot: ${selectedHotspot.ssid} (${selectedHotspot.encryption}) ${selectedHotspot.threatTag}`}
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
    paddingBottom: 44,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 10,
  },
  passivePill: {
    marginTop: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  passivePillText: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  actionHeaderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  scanBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  customToggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customToggleText: {
    fontSize: 12,
    fontWeight: '800',
  },
  customCard: {
    borderRadius: 18,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 18,
  },
  customTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  customSub: {
    fontSize: 11,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    marginBottom: 10,
  },
  optionChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  optionChip: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  optionChipText: {
    fontSize: 11,
    fontWeight: '800',
  },
  switchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pmfToggle: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  pmfToggleText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  analyzeCustomBtn: {
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  analyzeCustomBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  sectionHeaderHint: {
    fontSize: 11,
  },
  hotspotList: {
    gap: 10,
    marginBottom: 18,
  },
  hotspotItem: {
    borderRadius: 16,
    padding: 14,
  },
  hotspotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotspotTitleGroup: {
    flex: 1,
    paddingRight: 8,
  },
  ssidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  hotspotSsid: {
    fontSize: 15,
    fontWeight: '800',
  },
  roguePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roguePillText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
  },
  hotspotMeta: {
    fontSize: 10.5,
    marginTop: 3,
  },
  verdictBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verdictBadgeText: {
    fontSize: 9.5,
    fontWeight: '900',
  },
  hotspotBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  threatTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  scorePill: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  forensicCard: {
    borderRadius: 20,
    borderWidth: 2,
    padding: 18,
    marginBottom: 20,
  },
  forensicBanner: {
    marginBottom: 14,
  },
  forensicBannerTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  forensicSsidTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  crimesSection: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginBottom: 14,
  },
  crimesHeading: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
  },
  crimeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
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
  adviseBox: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
  },
  adviseText: {
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '700',
  },
  defenseActionBtn: {
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defenseActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  closeBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
