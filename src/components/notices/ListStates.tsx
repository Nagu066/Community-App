import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ListPaginationErrorProps {
  error: string;
  onRetry: () => void;
  isLoading?: boolean;
}

export const ListPaginationError: React.FC<ListPaginationErrorProps> = ({
  error,
  onRetry,
  isLoading,
}) => {
  return (
    <View style={styles.paginationErrorContainer}>
      <View style={styles.paginationErrorRow}>
        <Feather name="alert-triangle" size={14} color="#DC2626" style={{ marginRight: 6 }} />
        <Text style={styles.paginationErrorText}>{error}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onRetry}
        disabled={isLoading}
        style={styles.retryPaginationButton}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.retryPaginationText}>Retry Loading More</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const ListFooterLoader: React.FC = () => {
  return (
    <View style={styles.footerLoaderContainer}>
      <ActivityIndicator size="small" color="#64748B" />
      <Text style={styles.footerLoaderText}>Loading more notices...</Text>
    </View>
  );
};

interface ListEmptyStateProps {
  category: string;
  onResetFilter?: () => void;
}

export const ListEmptyState: React.FC<ListEmptyStateProps> = ({
  category,
  onResetFilter,
}) => {
  return (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={44} color="#94A3B8" style={{ marginBottom: 12 }} />
      <Text style={styles.emptyTitle}>No Notices Found</Text>
      <Text style={styles.emptySubtitle}>
        {category === 'all'
          ? 'There are currently no community notices available.'
          : `There are no notices under the "${category}" category right now.`}
      </Text>
      {category !== 'all' && onResetFilter && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onResetFilter}
          style={styles.resetButton}>
          <Text style={styles.resetButtonText}>View All Notices</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface ScreenErrorStateProps {
  message: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export const ScreenErrorState: React.FC<ScreenErrorStateProps> = ({
  message,
  onRetry,
  isRetrying,
}) => {
  return (
    <View style={styles.screenErrorContainer}>
      <Feather name="wifi-off" size={44} color="#DC2626" style={{ marginBottom: 12 }} />
      <Text style={styles.screenErrorTitle}>Unable to Load Notices</Text>
      <Text style={styles.screenErrorSubtitle}>{message}</Text>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onRetry}
        disabled={isRetrying}
        style={styles.screenErrorButton}>
        {isRetrying ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.screenErrorButtonText}>Try Again</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const LoadingSkeleton: React.FC = () => {
  return (
    <View style={styles.skeletonList}>
      {[1, 2, 3, 4, 5].map((key) => (
        <View key={key} style={styles.skeletonCard}>
          <View style={styles.skeletonRow}>
            <View style={styles.skeletonBadge} />
            <View style={styles.skeletonSmallDot} />
          </View>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonSubTitle} />
          <View style={styles.skeletonFooter} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationErrorContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECACA',
    gap: 8,
  },
  paginationErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paginationErrorText: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryPaginationButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryPaginationText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  footerLoaderContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerLoaderText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  screenErrorContainer: {
    flex: 1,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  screenErrorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  screenErrorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  screenErrorSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  screenErrorButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  screenErrorButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  skeletonList: {
    paddingVertical: 12,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skeletonBadge: {
    width: 70,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  skeletonSmallDot: {
    width: 30,
    height: 14,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  skeletonTitle: {
    height: 16,
    width: '85%',
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  skeletonSubTitle: {
    height: 14,
    width: '50%',
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  skeletonFooter: {
    height: 12,
    width: '35%',
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
});
