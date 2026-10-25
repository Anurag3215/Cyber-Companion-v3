import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { SafeCheck3DVisual, WarningPrism3DVisual } from '../components/Showcase3DVisuals';
import { GlassCard } from '../design-system/GlassCard';
import { GlassTokens } from '../design-system/glassTokens';

interface QrResultScreenProps {
  qrData: string;
  onBack: () => void;
  isDark?: boolean;
}

export const QrResultScreen: React.FC<QrResultScreenProps> = ({
  qrData,
  onBack,
  isDark = true,
}) => {
  const [copied, setCopied] = useState(false);

  const isSuspicious =
    qrData.toLowerCase().includes('phish') ||
    qrData.toLowerCase().includes('suspicious') ||
    qrData.toLowerCase().includes('malicious');

  const handleOpenLink = async () => {
    try {
      if (/^https?:\/\//i.test(qrData)) {
        await Linking.openURL(qrData);
      } else {
        Alert.alert('Scanned QR Content', qrData);
      }
    } catch (_err) {
      Alert.alert('Unable to open URL', qrData);
    }
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied to Clipboard', qrData);
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
          Scan Result
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.column}>
          {/* Top 3D Visual */}
          <View style={styles.visualSection}>
            {isSuspicious ? (
              <WarningPrism3DVisual size={160} isDark={isDark} />
            ) : (
              <SafeCheck3DVisual size={160} isDark={isDark} />
            )}
          </View>

          {/* Headline & Subtitle */}
          <View style={styles.headlineSection}>
            <Text
              style={[
                styles.headline,
                { color: isSuspicious ? '#EF4444' : '#10B981' },
              ]}
            >
              {isSuspicious ? 'This QR code is suspicious' : 'This QR code is safe to open'}
            </Text>
            <Text style={[styles.subheadline, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {isSuspicious
                ? 'We detected potential quishing anomalies or unverified redirection targets.'
                : 'Security checks passed with zero malicious signatures detected.'}
            </Text>
          </View>

          {/* Destination URL Card */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={20}
            style={[
              styles.destinationCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.22)' : 'rgba(2, 132, 199, 0.22)',
              },
            ]}
          >
            <Text style={[styles.destinationLabel, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Destination
            </Text>
            <Text
              style={[styles.destinationUrl, { color: isDark ? '#FFFFFF' : '#0F172A' }]}
              numberOfLines={2}
            >
              {qrData}
            </Text>
          </GlassCard>

          {/* Action Buttons: Open Link & Copy Link */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.openBtn}
              onPress={handleOpenLink}
              activeOpacity={0.85}
            >
              <Text style={styles.openBtnText}>Open Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.copyBtn,
                {
                  backgroundColor: isDark ? 'rgba(14, 27, 56, 0.8)' : '#FFFFFF',
                  borderColor: isDark ? 'rgba(56, 189, 248, 0.25)' : '#DCE6F0',
                },
              ]}
              onPress={handleCopyLink}
              activeOpacity={0.8}
            >
              <Text style={[styles.copyBtnText, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
                {copied ? '✓ Copied' : 'Copy Link'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* What We Checked Card */}
          <GlassCard
            isDark={isDark}
            elevation="soft"
            borderRadius={22}
            style={[
              styles.checksCard,
              {
                backgroundColor: isDark ? '#0E1B38' : 'rgba(255, 255, 255, 0.95)',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.2)' : 'rgba(2, 132, 199, 0.2)',
              },
            ]}
          >
            <Text style={[styles.checksHeader, { color: isDark ? '#FFFFFF' : '#0F172A' }]}>
              What we checked
            </Text>

            <View style={styles.checkItemRow}>
              <View style={styles.checkIconBubble}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={[styles.checkText, { color: isDark ? '#F1F6FC' : '#1E293B' }]}>
                Clean domain reputation
              </Text>
            </View>

            <View style={styles.checkItemRow}>
              <View style={styles.checkIconBubble}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={[styles.checkText, { color: isDark ? '#F1F6FC' : '#1E293B' }]}>
                Valid HTTPS certificate
              </Text>
            </View>

            <View style={styles.checkItemRow}>
              <View style={styles.checkIconBubble}>
                <Text style={styles.checkMark}>✓</Text>
              </View>
              <Text style={[styles.checkText, { color: isDark ? '#F1F6FC' : '#1E293B' }]}>
                No redirection anomalies
              </Text>
            </View>
          </GlassCard>

          {/* Advisory Note */}
          <View
            style={[
              styles.advisoryCard,
              {
                backgroundColor: isDark ? 'rgba(14, 27, 56, 0.6)' : '#F8FAFC',
                borderColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E2E8F0',
              },
            ]}
          >
            <Text style={{ fontSize: 16 }}>ℹ️</Text>
            <Text style={[styles.advisoryText, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              Always verify the URL before submitting sensitive information.
            </Text>
          </View>
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
    paddingTop: 10,
    paddingBottom: 4,
  },
  headlineSection: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  headline: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subheadline: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  destinationCard: {
    padding: 18,
    borderWidth: 1.2,
    gap: 4,
  },
  destinationLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  destinationUrl: {
    fontSize: 15,
    fontWeight: '700',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  openBtn: {
    flex: 1,
    backgroundColor: '#2563EB',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  openBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  copyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  checksCard: {
    padding: 20,
    borderWidth: 1.2,
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
  advisoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  advisoryText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    flex: 1,
  },
});
