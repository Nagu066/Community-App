import { DevControlsModal } from '@/components/notices/DevControlsModal';
import {
  ListEmptyState,
  ListFooterLoader,
  ListPaginationError,
  LoadingSkeleton,
  ScreenErrorState,
} from '@/components/notices/ListStates';
import { NoticeCard } from '@/components/notices/NoticeCard';
import { NoticeCategoryFilter } from '@/components/notices/NoticeCategoryFilter';
import { StaleBanner } from '@/components/notices/StaleBanner';
import { useNotices } from '@/hooks/useNotices';
import { Notice } from '@/types/notice';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoticesListScreen() {
  const router = useRouter();
  const [isDevModalVisible, setIsDevModalVisible] = useState(false);

  const {
    notices,
    category,
    setCategory,
    isLoading,
    isRefreshing,
    isLoadingMore,
    hasMore,
    error,
    paginationError,
    isStale,
    readIds,
    isRead,
    refresh,
    loadMore,
    simulateFailures,
    toggleSimulateFailures,
    clearReadNotices,
    markAsRead,
    refreshReadIds,
  } = useNotices();

  // Re-sync read notices when returning to this screen
  useFocusEffect(
    useCallback(() => {
      refreshReadIds();
    }, [refreshReadIds])
  );

  const handleOpenNotice = (notice: Notice) => {
    markAsRead(notice.id);
    router.push({
      pathname: '/notice/[id]',
      params: { id: notice.id },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar with Title & Dev Controls */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.brandTitle}>Melyn Community</Text>
          <Text style={styles.brandSubtitle}>Notices & Announcements</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsDevModalVisible(true)}
          style={[styles.devControlsBtn, simulateFailures && styles.devControlsBtnAlert]}>
          <Feather
            name="sliders"
            size={12}
            color={simulateFailures ? '#DC2626' : '#475569'}
            style={{ marginRight: 5 }}
          />
          <Text style={[styles.devControlsBtnText, simulateFailures && styles.devControlsBtnTextAlert]}>
            {simulateFailures ? '1/5 Failures' : 'Controls'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <NoticeCategoryFilter
        selectedCategory={category}
        onSelectCategory={(cat) => setCategory(cat)}
      />

      {/* Offline / Stale Data Banner */}
      {isStale && <StaleBanner onRetry={refresh} isRetrying={isRefreshing} />}

      {/* Main List Content */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : error && notices.length === 0 ? (
        <ScreenErrorState message={error} onRetry={refresh} isRetrying={isRefreshing} />
      ) : (
        <FlatList
          data={notices}
          extraData={readIds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NoticeCard
              notice={item}
              isRead={isRead(item.id)}
              onPress={() => handleOpenNotice(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={refresh}
              colors={['#1E293B']}
              tintColor="#1E293B"
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <ListEmptyState
              category={category}
              onResetFilter={category !== 'all' ? () => setCategory('all') : undefined}
            />
          }
          ListFooterComponent={
            paginationError ? (
              <ListPaginationError
                error={paginationError}
                onRetry={loadMore}
                isLoading={isLoadingMore}
              />
            ) : isLoadingMore ? (
              <ListFooterLoader />
            ) : !hasMore && notices.length > 0 ? (
              <View style={styles.endOfListContainer}>
                <Text style={styles.endOfListText}>You have viewed all {notices.length} notices</Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Developer / Reviewer Controls Modal */}
      <DevControlsModal
        visible={isDevModalVisible}
        onClose={() => setIsDevModalVisible(false)}
        simulateFailures={simulateFailures}
        onToggleSimulateFailures={toggleSimulateFailures}
        onClearReadNotices={clearReadNotices}
        readCount={readIds.size}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  devControlsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  devControlsBtnAlert: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  devControlsBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  devControlsBtnTextAlert: {
    color: '#DC2626',
  },
  listContent: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  endOfListContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endOfListText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
