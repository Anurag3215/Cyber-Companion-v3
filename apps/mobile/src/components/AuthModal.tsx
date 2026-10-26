import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth, UserRole } from '../services/AuthContext';
import { CyberLogo } from './CyberLogo';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  isDark?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, isDark = true }) => {
  const { signIn, signUp, loginAsGuest, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('USER');

  // Form fields
  const [name, setName] = useState('Arun');
  const [identifier, setIdentifier] = useState('arun');
  const [email, setEmail] = useState('arun@cybercompanion.io');
  const [password, setPassword] = useState('password123');

  // Validation errors
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const bg = isDark ? '#090D16' : '#FFFFFF';
  const cardBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#F8FAFC' : '#0F172A';
  const subtextColor = isDark ? '#94A3B8' : '#64748B';
  const teal = isDark ? '#2DD4BF' : '#0D9488';
  const cyan = '#38BDF8';
  const danger = '#EF4444';
  const purple = '#A855F7';

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage('');
    setFieldErrors({});
    if (role === 'ADMIN') {
      setIdentifier('admin');
      setName('Arun (Admin)');
      setEmail('arun.admin@cybercompanion.io');
    } else {
      setIdentifier('arun');
      setName('Arun');
      setEmail('arun@cybercompanion.io');
    }
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setFieldErrors({});

    if (mode === 'signin') {
      const res = await signIn(identifier, password, selectedRole);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Authentication failed');
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
      }
    } else {
      const res = await signUp(name, identifier, email, password, selectedRole);
      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.error || 'Registration failed');
        if (res.fieldErrors) {
          setFieldErrors(res.fieldErrors);
        }
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
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Logo & Headline */}
          <View style={styles.header}>
            <CyberLogo size={52} isDark={isDark} animated={true} />
            <Text style={[styles.headline, { color: textColor }]}>
              {selectedRole === 'ADMIN' ? '👑 Administrator Portal' : '🛡️ Sentinel Identity Access'}
            </Text>
            <Text style={[styles.subline, { color: subtextColor }]}>
              {selectedRole === 'ADMIN'
                ? 'Elevated Root Privileges · Policy & Threat Cache Management'
                : 'Zero-Trust cryptographically verified mobile session'}
            </Text>
          </View>

          {/* Role Selector Bar: User vs Admin */}
          <View style={styles.roleContainer}>
            <Text style={[styles.roleTitle, { color: subtextColor }]}>SELECT ACCESS LEVEL</Text>
            <View style={[styles.roleSelector, { backgroundColor: cardBg, borderColor: borderCol }]}>
              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  selectedRole === 'USER' && { backgroundColor: isDark ? 'rgba(45,212,191,0.2)' : '#E0F2FE' },
                  selectedRole === 'USER' && { borderColor: teal, borderWidth: 1 },
                ]}
                onPress={() => handleRoleSelect('USER')}
                activeOpacity={0.8}
              >
                <Text style={styles.roleIcon}>🛡️</Text>
                <Text
                  style={[
                    styles.roleText,
                    { color: selectedRole === 'USER' ? teal : subtextColor },
                    selectedRole === 'USER' && { fontWeight: '700' },
                  ]}
                >
                  User (Arun)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleBtn,
                  selectedRole === 'ADMIN' && { backgroundColor: isDark ? 'rgba(168,85,247,0.2)' : '#F3E8FF' },
                  selectedRole === 'ADMIN' && { borderColor: purple, borderWidth: 1 },
                ]}
                onPress={() => handleRoleSelect('ADMIN')}
                activeOpacity={0.8}
              >
                <Text style={styles.roleIcon}>👑</Text>
                <Text
                  style={[
                    styles.roleText,
                    { color: selectedRole === 'ADMIN' ? purple : subtextColor },
                    selectedRole === 'ADMIN' && { fontWeight: '700' },
                  ]}
                >
                  Admin (Root)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mode Switcher Tabs: Sign In vs Register */}
          <View style={[styles.tabBar, { backgroundColor: cardBg, borderColor: borderCol }]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                mode === 'signin' && { backgroundColor: isDark ? '#334155' : '#FFFFFF' },
              ]}
              onPress={() => {
                setMode('signin');
                setErrorMessage('');
                setFieldErrors({});
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: mode === 'signin' ? cyan : subtextColor },
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
                setFieldErrors({});
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: mode === 'signup' ? cyan : subtextColor },
                  mode === 'signup' && { fontWeight: '700' },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Global Error Alert Banner */}
          {errorMessage ? (
            <View style={[styles.errorBox, { borderColor: danger }]}>
              <Text style={[styles.errorText, { color: danger }]}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: subtextColor }]}>FULL NAME</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: cardBg, borderColor: fieldErrors.username ? danger : borderCol, color: textColor },
                  ]}
                  placeholder="e.g. Arun"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: subtextColor }]}>
                {mode === 'signup' ? 'DESIRED USERNAME' : 'USERNAME OR EMAIL'}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBg, borderColor: fieldErrors.username ? danger : borderCol, color: textColor },
                ]}
                placeholder="e.g. arun"
                placeholderTextColor="#64748B"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
              />
              {fieldErrors.username ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.username}</Text>
              ) : null}
            </View>

            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: subtextColor }]}>SECURE EMAIL</Text>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: cardBg, borderColor: fieldErrors.email ? danger : borderCol, color: textColor },
                  ]}
                  placeholder="arun@domain.com"
                  placeholderTextColor="#64748B"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {fieldErrors.email ? (
                  <Text style={styles.fieldErrorText}>{fieldErrors.email}</Text>
                ) : null}
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: subtextColor }]}>MASTER KEY (PASSWORD)</Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: cardBg, borderColor: fieldErrors.password ? danger : borderCol, color: textColor },
                ]}
                placeholder="•••••••••••• (min 6 chars)"
                placeholderTextColor="#64748B"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              {fieldErrors.password ? (
                <Text style={styles.fieldErrorText}>{fieldErrors.password}</Text>
              ) : null}
            </View>

            {/* Quick Demo Credentials Tip */}
            <View style={[styles.tipCard, { backgroundColor: isDark ? 'rgba(56,189,248,0.08)' : '#F0F9FF', borderColor: 'rgba(56,189,248,0.2)' }]}>
              <Text style={[styles.tipTitle, { color: cyan }]}>💡 Valid Credentials for Presentation:</Text>
              <Text style={[styles.tipBody, { color: subtextColor }]}>
                • User Access: <Text style={{ color: textColor, fontWeight: '700' }}>arun</Text> / <Text style={{ color: textColor, fontWeight: '700' }}>password123</Text>
                {'\n'}• Admin Access: <Text style={{ color: purple, fontWeight: '700' }}>admin</Text> / <Text style={{ color: textColor, fontWeight: '700' }}>password123</Text>
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: selectedRole === 'ADMIN' ? purple : teal },
              ]}
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {mode === 'signin'
                    ? selectedRole === 'ADMIN'
                      ? 'Authenticate as Admin →'
                      : 'Authenticate as Arun →'
                    : 'Create Verified Profile →'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Controls */}
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
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    maxWidth: 280,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 8,
    textAlign: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 6,
  },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  roleIcon: {
    fontSize: 16,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
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
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
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
    letterSpacing: 1,
  },
  input: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  fieldErrorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 2,
    marginLeft: 2,
  },
  tipCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
    marginTop: 4,
  },
  tipTitle: {
    fontSize: 11,
    fontWeight: '700',
  },
  tipBody: {
    fontSize: 11,
    lineHeight: 16,
  },
  submitBtn: {
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    marginTop: 18,
    gap: 12,
  },
  guestBtn: {
    paddingVertical: 8,
  },
  guestBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeBtn: {
    paddingVertical: 6,
  },
  closeBtnText: {
    fontSize: 13,
  },
});
