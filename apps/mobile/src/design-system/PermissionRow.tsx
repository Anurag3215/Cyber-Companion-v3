import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tokens } from './tokens';
import { RiskBadge, RiskLevel } from './RiskBadge';

interface PermissionRowProps {
  appName: string;
  packageName: string;
  permissions: string[];
  riskLevel: RiskLevel;
  riskReason?: string;
}

export const PermissionRow: React.FC<PermissionRowProps> = ({
  appName,
  packageName,
  permissions,
  riskLevel,
  riskReason,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.appInfo}>
          <Text style={styles.appName}>{appName}</Text>
          <Text style={styles.packageName} numberOfLines={1}>
            {packageName}
          </Text>
        </View>
        <RiskBadge level={riskLevel} />
      </View>

      <View style={styles.permsWrap}>
        {permissions.map((perm, idx) => (
          <View key={idx} style={styles.permTag}>
            <Text style={styles.permText}>{perm}</Text>
          </View>
        ))}
      </View>

      {riskReason && <Text style={styles.reasonText}>{riskReason}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Tokens.colors.dark.surface,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radii.md,
    marginVertical: Tokens.spacing.xs,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appInfo: {
    flex: 1,
    marginRight: Tokens.spacing.sm,
  },
  appName: {
    fontSize: Tokens.typography.bodyBold.fontSize,
    fontWeight: Tokens.typography.bodyBold.fontWeight,
    color: Tokens.colors.dark.textPrimary,
  },
  packageName: {
    fontSize: 11,
    color: Tokens.colors.dark.textMuted,
    marginTop: 2,
  },
  permsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Tokens.spacing.sm,
    gap: 6,
  },
  permTag: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Tokens.radii.sm,
    borderWidth: 1,
    borderColor: '#334155',
  },
  permText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  reasonText: {
    fontSize: 12,
    color: '#F87171',
    marginTop: Tokens.spacing.xs,
  },
});
