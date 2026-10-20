import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../services/AuthContext';
import { CyberLogo } from './CyberLogo';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, isDark = true }) => {
  const { signIn, signUp, loginAsGuest, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('arun@cybercompanion.io');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const danger = '#EF4444';

  const handleSubmit = async () => {
    setErrorMessage('');
    if (mode === 'signin') {
      const res = await signIn(email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Authentication failed');
      }
    } else {
      const res = await signUp(name, email, password);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Registration failed');
      }
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <View style={styles.content}>
          {/* Top Logo & Header */}
          <View style={styles.header}>
            <CyberLogo size={50} isDark={isDark} animated={true} />
            <Text style={[styles.headline, { color: textColor }]}>
              {mode === 'signin' ? 'Sentinel Identity Access' : 'Create Guard Profile'}
            </Text>
            <Text style={[styles.subline, { color: subtextColor }]}>
              Zero-Trust cryptographically secured mobile session
            </Text>
          </View>

          {/* Mode Switcher Tabs */}
          <View style={[styles.tabBar, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                mode === 'signin' && { backgroundColor: isDark ? '#334155' : '#FFFFFF' },
              ]}
              onPress={() => {
                setMode('signin');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: mode === 'signin' ? teal : subtextColor },
                  mode === 'signin' && { fontWeight: '700' },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                mode === 'signup' && { backgroundColor: isDark ? '#334155' : '#FFFFFF' },
              ]}
              onPress={() => {
                setMode('signup');
                setErrorMessage('');
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: mode === 'signup' ? teal : subtextColor },
                  mode === 'signup' && { fontWeight: '700' },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={[styles.errorBox, { borderColor: danger }]}>
              <Text style={[styles.errorText, { color: danger }]}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: subtextColor }]}>OPERATOR NAME</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: cardBg, borderColor: borderCol, color: textColor }]}
                  placeholder="e.g. Maya Chen"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: subtextColor }]}>SENTINEL EMAIL</Text>
              <TextInput
                style={[styles.input, { backgroundColor: cardBg, borderColor: borderCol, color: textColor }]}
                placeholder="operator@domain.com"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: subtextColor }]}>MASTER KEY (PASSWORD)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: cardBg, borderColor: borderCol, color: textColor }]}
                placeholder="••••••••••••"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: teal }]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signin' ? 'Authenticate Session →' : 'Initialize Profile →'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Guest Instant Access */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.guestBtn} onPress={handleGuest} activeOpacity={0.7}>
              <Text style={[styles.guestBtnText, { color: teal }]}>
                ⚡ Continue as Anonymous Guest
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={[styles.closeBtnText, { color: subtextColor }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 14,
    textAlign: 'center',
  },
  subline: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  tabBar: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 3,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorBox: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
  },
  submitBtn: {
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 12,
  },
  guestBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  closeBtn: {
    paddingVertical: 6,
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
