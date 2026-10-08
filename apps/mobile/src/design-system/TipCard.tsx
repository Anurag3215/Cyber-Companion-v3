import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Tokens } from './tokens';

interface TipCardProps {
  title: string;
  summary: string;
  category: string;
  readingGrade?: number;
}

export const TipCard: React.FC<TipCardProps> = ({
  title,
  summary,
  category,
  readingGrade = 6,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.badgeRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category.replace('_', ' ')}</Text>
        </View>
        <Text style={styles.gradeText}>Grade {readingGrade} Reading Level</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.summary}>{summary}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Tokens.colors.dark.surface,
    borderRadius: Tokens.radii.lg,
    padding: Tokens.spacing.lg,
    marginVertical: Tokens.spacing.sm,
    borderWidth: 1,
    borderColor: Tokens.colors.dark.border,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Tokens.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Tokens.radii.full,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  categoryText: {
    color: '#BFDBFE',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  gradeText: {
    fontSize: 11,
    color: Tokens.colors.dark.textMuted,
  },
  title: {
    fontSize: Tokens.typography.titleMedium.fontSize,
    fontWeight: Tokens.typography.titleMedium.fontWeight,
    color: Tokens.colors.dark.textPrimary,
    marginBottom: Tokens.spacing.xs,
  },
  summary: {
    fontSize: Tokens.typography.body.fontSize,
    color: Tokens.colors.dark.textSecondary,
    lineHeight: 21,
  },
});
