import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scanners' | 'awareness'>('dashboard');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <View style={styles.header}>
        <Text style={styles.title}>Cyber Companion</Text>
        <Text style={styles.subtitle}>Intelligent Mobile & Web Threat Protection</Text>
      </View>

      <View style={styles.content}>
        {activeTab === 'dashboard' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Security Health Score</Text>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreNumber}>85</Text>
              <Text style={styles.scoreLabel}>SECURE</Text>
            </View>
            <Text style={styles.cardDescription}>
              All core defense modules active: Wi-Fi Risk, URL Scanner, QR Sandbox, Permission Auditor.
            </Text>
          </View>
        )}

        {activeTab === 'scanners' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Scan Hub</Text>
            <Text style={styles.cardDescription}>
              Inspect Wi-Fi networks, evaluate URLs against Threat Intelligence, or sandbox QR codes.
            </Text>
          </View>
        )}

        {activeTab === 'awareness' && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Awareness Center</Text>
            <Text style={styles.cardDescription}>
              Daily tip: Public charging stations (Juice Jacking) can steal data. Always use a USB data blocker!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.navBar}>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'dashboard' && styles.navItemActive]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'scanners' && styles.navItemActive]}
          onPress={() => setActiveTab('scanners')}
        >
          <Text style={styles.navText}>Scanners</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navItem, activeTab === 'awareness' && styles.navItemActive]}
          onPress={() => setActiveTab('awareness')}
        >
          <Text style={styles.navText}>Awareness</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#38BDF8',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#10B981',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  cardDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  navBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    backgroundColor: '#0F172A',
  },
  navItem: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#38BDF8',
  },
  navText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
});
