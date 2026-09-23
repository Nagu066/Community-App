import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface StaleBannerProps {
  onRetry: () => void;
  isRetrying?: boolean;
}

export const StaleBanner: React.FC<StaleBannerProps> = ({ onRetry, isRetrying }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📡</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Offline Mode / Stale Notices</Text>
        <Text style={styles.description}>
          Showing last saved notices. Network updates failed.
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onRetry}
        disabled={isRetrying}
        style={styles.retryButton}>
        <Text style={styles.retryText}>{isRetrying ? 'Checking...' : 'Retry'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  description: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  retryButton: {
    backgroundColor: '#92400E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
