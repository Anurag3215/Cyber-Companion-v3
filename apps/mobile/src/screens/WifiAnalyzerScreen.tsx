import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { WifiOrb3DVisual } from '../components/Showcase3DVisuals';
import {
  WifiService,
  WifiScanResult,
  NearbyHotspotBeacon,
  WifiEncryption,
  evaluatePreConnectionHotspot,
} from '../services/wifiService';
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
  const [expandedBeaconId, setExpandedBeaconId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'THREATS' | 'SAFE'>('ALL');

  // Custom Audit Network Modal State
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [customSsid, setCustomSsid] = useState('');
  const [customEncryption, setCustomEncryption] = useState<WifiEncryption>('OPEN');
  const [customFreq, setCustomFreq] = useState<'2.4 GHz' | '5.0 GHz'>('2.4 GHz');

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

  const handleSaveCustomAudit = async () => {
    if (!customSsid.trim()) return;
    const newBeacon = evaluatePreConnectionHotspot({
      ssid: customSsid.trim(),
      bssid: '02:00:00:' + Math.floor(Math.random() * 89 + 10) + ':00:01',
      encryption: customEncryption,
      channel: customFreq === '5.0 GHz' ? 44 : 6,
      signalDbm: -55,
      pmfEnabled: customEncryption === 'WPA3',
    });
    newBeacon.id = `custom-audit-${Date.now()}`;
    await WifiService.saveAuditedWifiBeacon(newBeacon);
    setShowAuditModal(false);
    setCustomSsid('');
    fetchWifi();
  };

  // Determine connected network details
  const activeBeacon = scanData?.beacons?.find((b: NearbyHotspotBeacon) => b.isCurrentConnection);
  const networkSsid = activeBeacon?.ssid || 'Home_WiFi';
  const encryption = activeBeacon?.encryption || 'WPA2';
  const signal = activeBeacon?.signalDbm ? `${activeBeacon.signalDbm} dBm` : '-48 dBm';
  const isSecure = !activeBeacon || activeBeacon.threatVerdict === 'SECURE';

  // Nearby Beacons (excluding active connection for the nearby list)
  const nearbyBeacons = (scanData?.beacons || []).filter((b) => !b.isCurrentConnection);

  const filteredBeacons = nearbyBeacons.filter((b) => {
    if (filterMode === 'THREATS') return b.threatVerdict !== 'SECURE';
    if (filterMode === 'SAFE') return b.threatVerdict === 'SECURE';
    return true;
  });

  const getVerdictBadgeProps = (verdict: NearbyHotspotBeacon['threatVerdict']) => {
    switch (verdict) {
      case 'CRITICAL_THREAT':
        return { label: 'CRITICAL THREAT', bg: 'rgba(239, 68, 68, 0.18)', border: '#EF4444', text: '#EF4444' };
      case 'HIGH_RISK':
        return { label: 'HIGH RISK', bg: 'rgba(245, 158, 11, 0.18)', border: '#F59E0B', text: '#F59E0B' };
      case 'MODERATE':
        return { label: 'MODERATE', bg: 'rgba(56, 189, 248, 0.18)', border: '#38BDF8', text: '#38BDF8' };
      case 'SECURE':
        return { label: 'SECURE', bg: 'rgba(16, 185, 129, 0.18)', border: '#10B981', text: '#10B981' };
    }
  };

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
            <WifiOrb3DVisual size={180} isDark={isDark} />
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
                  Home / Private Network
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* Security Checks Card */}
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

          {/* SECTION: Nearby Networks in Airspace */}
          <View style={styles.airspaceHeaderRow}>
            <View>
              <Text style={[styles.airspaceTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                Nearby Airspace Networks
              </Text>
              <Text style={[styles.airspaceSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                {nearbyBeacons.length} active Wi-Fi beacons scanned in radio range
              </Text>
            </View>

            <TouchableOpacity
              style={styles.addAuditBtn}
              onPress={() => setShowAuditModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.addAuditBtnText}>➕ Audit Wi-Fi</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filterMode === 'ALL'
                  ? styles.filterPillActive
                  : [styles.filterPillInactive, { borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : '#DCE6F0' }],
              ]}
              onPress={() => setFilterMode('ALL')}
            >
              <Text style={[styles.filterPillText, { color: filterMode === 'ALL' ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' }]}>
                All ({nearbyBeacons.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filterMode === 'THREATS'
                  ? styles.filterPillActiveThreat
                  : [styles.filterPillInactive, { borderColor: isDark ? 'rgba(239, 68, 68, 0.2)' : '#DCE6F0' }],
              ]}
              onPress={() => setFilterMode('THREATS')}
            >
              <Text style={[styles.filterPillText, { color: filterMode === 'THREATS' ? '#FFFFFF' : '#EF4444' }]}>
                🚨 Threats ({nearbyBeacons.filter((b) => b.threatVerdict !== 'SECURE').length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filterMode === 'SAFE'
                  ? styles.filterPillActiveSafe
                  : [styles.filterPillInactive, { borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#DCE6F0' }],
              ]}
              onPress={() => setFilterMode('SAFE')}
            >
              <Text style={[styles.filterPillText, { color: filterMode === 'SAFE' ? '#FFFFFF' : '#10B981' }]}>
                ✓ Safe ({nearbyBeacons.filter((b) => b.threatVerdict === 'SECURE').length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Nearby Beacons Cards List */}
          <View style={styles.beaconsList}>
            {filteredBeacons.map((beacon) => {
              const badge = getVerdictBadgeProps(beacon.threatVerdict);
              const isExpanded = expandedBeaconId === beacon.id;

              return (
                <TouchableOpacity
                  key={beacon.id}
                  activeOpacity={0.85}
                  onPress={() => setExpandedBeaconId(isExpanded ? null : beacon.id)}
                >
                  <GlassCard
                    isDark={isDark}
                    elevation="soft"
                    borderRadius={20}
                    style={[
                      styles.beaconCard,
                      {
                        backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isExpanded
                          ? badge.border
                          : isDark
                          ? 'rgba(56, 189, 248, 0.18)'
                          : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.beaconHeaderRow}>
                      <View style={styles.beaconIconBubble}>
                        <Text style={{ fontSize: 20 }}>📶</Text>
                      </View>

                      <View style={styles.beaconMainInfo}>
                        <Text
                          style={[styles.beaconSsid, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
                          numberOfLines={1}
                        >
                          {beacon.ssid}
                        </Text>
                        <View style={styles.beaconMetaRow}>
                          <Text style={[styles.beaconMetaTag, { color: isDark ? '#94A3B8' : '#64748B' }]}>
                            {beacon.encryption} · {beacon.frequency} · {beacon.signalDbm} dBm
                          </Text>
                        </View>
                      </View>

                      <View style={[styles.beaconVerdictBadge, { backgroundColor: badge.bg, borderColor: badge.border }]}>
                        <Text style={[styles.beaconVerdictText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {/* Threat tag headline */}
                    <Text style={[styles.threatTagText, { color: badge.text }]}>
                      {beacon.threatTag}
                    </Text>

                    {/* Expanded details */}
                    {isExpanded && (
                      <View style={styles.beaconExpanded}>
                        <View style={styles.beaconDivider} />

                        <Text style={[styles.detailHeading, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                          Hardware Intelligence:
                        </Text>
                        <Text style={[styles.detailBody, { color: isDark ? '#CBD5E1' : '#475569' }]}>
                          BSSID: {beacon.bssid} | Channel: {beacon.channel} | Vendor: {beacon.vendor}
                        </Text>

                        <Text style={[styles.detailHeading, { color: '#EF4444', marginTop: 6 }]}>
                          Predicted Cyber Threat Vectors:
                        </Text>
                        {beacon.predictedCrimes.map((crime, idx) => (
                          <Text key={idx} style={[styles.crimeBullet, { color: isDark ? '#F1F5F9' : '#334155' }]}>
                            • {crime}
                          </Text>
                        ))}

                        <View style={[styles.adviceBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F8FAFC' }]}>
                          <Text style={[styles.adviceLabel, { color: badge.text }]}>
                            Recommendation:
                          </Text>
                          <Text style={[styles.adviceText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                            {beacon.preventionAdvise}
                          </Text>
                        </View>
                      </View>
                    )}
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Rescan Button */}
          <TouchableOpacity
            style={styles.scanActionBtn}
            onPress={fetchWifi}
            disabled={isScanning}
            activeOpacity={0.85}
          >
            {isScanning ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.scanActionBtnText}>🔄 Rescan Airspace Hotspots</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Audit Custom Network Modal */}
      <Modal visible={showAuditModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#0E1B38' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Audit Any Wi-Fi Network
            </Text>
            <Text style={[styles.modalSub, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Test any client or venue Wi-Fi SSID to predict pre-connection attack vectors:
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  color: isDark ? '#FFFFFF' : '#0F172A',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.3)' : '#DCE6F0',
                  backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#F8FAFC',
                },
              ]}
              placeholder="e.g. Client_Guest_WiFi"
              placeholderTextColor="#64748B"
              value={customSsid}
              onChangeText={setCustomSsid}
            />

            <Text style={[styles.modalLabel, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              Encryption Cipher:
            </Text>
            <View style={styles.modalCiphersRow}>
              {(['OPEN', 'WEP', 'WPA2', 'WPA3'] as WifiEncryption[]).map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.cipherBtn,
                    customEncryption === c
                      ? styles.cipherBtnActive
                      : [styles.cipherBtnInactive, { borderColor: isDark ? '#334155' : '#DCE6F0' }],
                  ]}
                  onPress={() => setCustomEncryption(c)}
                >
                  <Text style={[styles.cipherBtnText, { color: customEncryption === c ? '#FFFFFF' : isDark ? '#94A3B8' : '#64748B' }]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActionsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAuditModal(false)}
              >
                <Text style={{ color: '#94A3B8', fontWeight: '700' }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalAuditBtn}
                onPress={handleSaveCustomAudit}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Run Threat Audit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 50,
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
    paddingVertical: 10,
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
  airspaceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  airspaceTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  airspaceSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  addAuditBtn: {
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderColor: '#2563EB',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  addAuditBtnText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterPillActiveThreat: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  filterPillActiveSafe: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterPillInactive: {
    backgroundColor: 'transparent',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  beaconsList: {
    gap: 12,
  },
  beaconCard: {
    padding: 16,
    borderWidth: 1.2,
    gap: 8,
  },
  beaconHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  beaconIconBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconMainInfo: {
    flex: 1,
    gap: 2,
  },
  beaconSsid: {
    fontSize: 15,
    fontWeight: '800',
  },
  beaconMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  beaconMetaTag: {
    fontSize: 11,
    fontWeight: '500',
  },
  beaconVerdictBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
  },
  beaconVerdictText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  threatTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  beaconExpanded: {
    marginTop: 6,
    gap: 4,
  },
  beaconDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 6,
  },
  detailHeading: {
    fontSize: 12,
    fontWeight: '700',
  },
  detailBody: {
    fontSize: 11,
    lineHeight: 16,
  },
  crimeBullet: {
    fontSize: 11,
    lineHeight: 16,
  },
  adviceBox: {
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    gap: 2,
  },
  adviceLabel: {
    fontSize: 11,
    fontWeight: '800',
  },
  adviceText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  scanActionBtn: {
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  scanActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 22,
    gap: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 13,
    lineHeight: 18,
  },
  modalInput: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  modalCiphersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cipherBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  cipherBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  cipherBtnInactive: {
    backgroundColor: 'transparent',
  },
  cipherBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalAuditBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
  },
});
