import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NoticeCategory } from '@/types/notice';

interface NoticeCategoryFilterProps {
  selectedCategory: NoticeCategory;
  onSelectCategory: (category: NoticeCategory) => void;
}

const CATEGORIES: { key: NoticeCategory; label: string; icon?: string }[] = [
  { key: 'all', label: 'All Notices' },
  { key: 'emergency', label: 'Emergency', icon: '🚨' },
  { key: 'event', label: 'Events', icon: '📅' },
  { key: 'service', label: 'Services', icon: '🛠️' },
  { key: 'general', label: 'General', icon: '📢' },
];

export const NoticeCategoryFilter: React.FC<NoticeCategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(cat.key)}
              style={[styles.chip, isSelected && styles.activeChip]}>
              {cat.icon ? <Text style={styles.chipIcon}>{cat.icon}</Text> : null}
              <Text style={[styles.chipText, isSelected && styles.activeChipText]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeChip: {
    backgroundColor: '#1E293B',
    borderColor: '#1E293B',
  },
  chipIcon: {
    marginRight: 6,
    fontSize: 13,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
});
