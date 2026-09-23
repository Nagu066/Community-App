import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NoticeCategory } from '@/types/notice';

interface NoticeCategoryFilterProps {
  selectedCategory: NoticeCategory;
  onSelectCategory: (category: NoticeCategory) => void;
}

type FeatherIconName = keyof typeof Feather.glyphMap;

interface CategoryConfig {
  key: NoticeCategory;
  label: string;
  iconName: FeatherIconName;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'all', label: 'All Notices', iconName: 'layers' },
  { key: 'emergency', label: 'Emergency', iconName: 'alert-triangle' },
  { key: 'event', label: 'Events', iconName: 'calendar' },
  { key: 'service', label: 'Services', iconName: 'tool' },
  { key: 'general', label: 'General', iconName: 'bell' },
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
          const iconColor = isSelected ? '#FFFFFF' : '#64748B';

          return (
            <TouchableOpacity
              key={cat.key}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(cat.key)}
              style={[styles.chip, isSelected && styles.activeChip]}>
              <Feather
                name={cat.iconName}
                size={13}
                color={iconColor}
                style={styles.chipIcon}
              />
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
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeChip: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
