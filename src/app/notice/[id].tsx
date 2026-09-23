import { NoticeImage } from '@/components/notices/NoticeImage';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useNoticeDetail } from '@/hooks/useNoticeDetail';
import {
  CATEGORY_COLORS,
  formatNoticeDate,
  isNoticeExpired,
  isNoticeFuture,
} from '@/utils/noticeUtils';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { notice, isLoading, error, retry } = useNoticeDetail(id);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#1E293B" />
          <Text style={styles.loadingText}>Loading notice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !notice) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader />
        <View style={styles.centerContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Failed to Load Notice</Text>
          <Text style={styles.errorMessage}>{error || 'Notice not found.'}</Text>
          <View style={styles.errorActions}>
            <TouchableOpacity activeOpacity={0.7} onPress={retry} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const isHighPriority = notice.priority === 'high';
  const isExpired = isNoticeExpired(notice);
  const isFuture = isNoticeFuture(notice);
  const categoryConfig = CATEGORY_COLORS[notice.category.toLowerCase()] || CATEGORY_COLORS.general;
  const hasEmptyBody = !notice.body || notice.body.trim().length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Notice Details" subtitle={notice.department} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* High priority notice alert banner */}
        {isHighPriority && (
          <View style={styles.highPriorityBanner}>
            <Text style={styles.highPriorityBannerIcon}>🚨</Text>
            <View style={styles.highPriorityTextContainer}>
              <Text style={styles.highPriorityBannerTitle}>HIGH PRIORITY COMMUNITY NOTICE</Text>
              <Text style={styles.highPriorityBannerSubtitle}>
                Please read carefully and heed all recommended community instructions.
              </Text>
            </View>
          </View>
        )}

        {/* Expired Notice Warning Banner */}
        {isExpired && (
          <View style={styles.expiredBanner}>
            <Text style={styles.expiredBannerIcon}>⏳</Text>
            <Text style={styles.expiredBannerText}>
              This notice has expired and is kept for historical community records.
            </Text>
          </View>
        )}

        {/* Featured Image or Category Fallback Banner */}
        <View style={styles.imageContainer}>
          <NoticeImage
            uri={notice.image_url}
            aspectRatio={16 / 9}
            borderRadius={12}
            category={notice.category}
            isThumbnail={false}
          />
        </View>

        {/* Header Metadata */}
        <View style={styles.contentHeader}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryConfig.bg, borderColor: categoryConfig.border },
              ]}>
              <Text style={[styles.categoryBadgeText, { color: categoryConfig.text }]}>
                {categoryConfig.label}
              </Text>
            </View>

            {isFuture && (
              <View style={styles.futureBadge}>
                <Text style={styles.futureBadgeText}>Upcoming Notice</Text>
              </View>
            )}

            <View style={styles.readConfirmedBadge}>
              <Text style={styles.readConfirmedText}>✓ Read</Text>
            </View>
          </View>

          {/* Full Title (handles long titles cleanly) */}
          <Text style={[styles.title, isHighPriority && styles.highPriorityTitle]}>
            {notice.title}
          </Text>

          {/* Department & Date */}
          <View style={styles.metaCard}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Department</Text>
              <Text style={styles.metaValue}>{notice.department}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Published</Text>
              <Text style={styles.metaValue}>{formatNoticeDate(notice.published_at)}</Text>
            </View>
            {notice.expires_at ? (
              <>
                <View style={styles.metaDivider} />
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>Expires</Text>
                  <Text style={[styles.metaValue, isExpired && styles.expiredMetaValue]}>
                    {formatNoticeDate(notice.expires_at)}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </View>

        {/* Notice Body */}
        <View style={styles.bodySection}>
          <Text style={styles.sectionHeader}>Notice Information</Text>

          {hasEmptyBody ? (
            /* Edge case: empty body */
            <View style={styles.emptyBodyCard}>
              <Text style={styles.emptyBodyIcon}>ℹ️</Text>
              <Text style={styles.emptyBodyTitle}>No Additional Body Content Provided</Text>
              <Text style={styles.emptyBodyText}>
                The {notice.department} did not include additional written details for this notice.
                If you have questions, please contact the band administration office.
              </Text>
            </View>
          ) : (
            <Text style={styles.bodyText}>{notice.body}</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 14,
  },
  highPriorityBanner: {
    backgroundColor: '#FEE2E2',
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  highPriorityBannerIcon: {
    fontSize: 22,
  },
  highPriorityTextContainer: {
    flex: 1,
  },
  highPriorityBannerTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  highPriorityBannerSubtitle: {
    fontSize: 12,
    color: '#991B1B',
    marginTop: 2,
  },
  expiredBanner: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  expiredBannerIcon: {
    fontSize: 16,
  },
  expiredBannerText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  imageContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  contentHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  futureBadge: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  futureBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  readConfirmedBadge: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  readConfirmedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
    marginBottom: 16,
  },
  highPriorityTitle: {
    color: '#991B1B',
  },
  metaCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E2E8F0',
  },
  metaLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  expiredMetaValue: {
    color: '#DC2626',
  },
  bodySection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 25,
    color: '#1E293B',
  },
  emptyBodyCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  emptyBodyIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  emptyBodyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  emptyBodyText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
});
