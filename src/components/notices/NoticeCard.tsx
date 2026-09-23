import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Notice } from '@/types/notice';
import { CATEGORY_COLORS, formatNoticeDate, isNoticeExpired, isNoticeFuture } from '@/utils/noticeUtils';
import { NoticeImage } from './NoticeImage';

interface NoticeCardProps {
  notice: Notice;
  isRead: boolean;
  onPress: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, isRead, onPress }) => {
  const isHighPriority = notice.priority === 'high';
  const isExpired = isNoticeExpired(notice);
  const isFuture = isNoticeFuture(notice);
  const categoryConfig = CATEGORY_COLORS[notice.category.toLowerCase()] || CATEGORY_COLORS.general;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.card,
        isRead && styles.readCard,
        isHighPriority && styles.highPriorityCard,
        isExpired && styles.expiredCard,
      ]}>
      {/* High Priority Alert Header */}
      {isHighPriority && (
        <View style={styles.highPriorityHeader}>
          <Feather name="alert-triangle" size={13} color="#DC2626" style={{ marginRight: 6 }} />
          <Text style={styles.highPriorityLabel}>HIGH PRIORITY ALERT</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        {/* Meta Bar: Category, Read Status, Status Badges */}
        <View style={styles.metaRow}>
          <View style={styles.metaBadges}>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: categoryConfig.bg, borderColor: categoryConfig.border },
              ]}>
              <Feather
                name={categoryConfig.icon}
                size={11}
                color={categoryConfig.text}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.categoryBadgeText, { color: categoryConfig.text }]}>
                {categoryConfig.label}
              </Text>
            </View>

            {isExpired && (
              <View style={styles.expiredBadge}>
                <Feather name="clock" size={10} color="#64748B" style={{ marginRight: 3 }} />
                <Text style={styles.expiredBadgeText}>Expired</Text>
              </View>
            )}

            {isFuture && (
              <View style={styles.futureBadge}>
                <Feather name="calendar" size={10} color="#B45309" style={{ marginRight: 3 }} />
                <Text style={styles.futureBadgeText}>Upcoming</Text>
              </View>
            )}
          </View>

          {/* Read / Unread Status Indicator */}
          {!isRead ? (
            <View style={styles.unreadIndicator}>
              <View style={styles.unreadDot} />
              <Text style={styles.unreadText}>NEW</Text>
            </View>
          ) : (
            <Text style={styles.readText}>Read</Text>
          )}
        </View>

        {/* Content Row: Text + thumbnail */}
        <View style={styles.bodyRow}>
          <View style={styles.textContainer}>
            {/* Title - gracefully handles very long titles */}
            <Text
              numberOfLines={3}
              style={[styles.title, isRead && styles.readTitle, isHighPriority && styles.highPriorityTitle]}>
              {notice.title}
            </Text>

            {/* Department */}
            <Text style={styles.departmentText}>{notice.department}</Text>
          </View>

          <View style={styles.thumbnailContainer}>
            <NoticeImage
              uri={notice.image_url}
              height={68}
              width={68}
              borderRadius={8}
              category={notice.category}
              isThumbnail={true}
            />
          </View>
        </View>

        {/* Footer: Date and details hint */}
        <View style={styles.footerRow}>
          <Text style={styles.dateText}>
            {isFuture ? `Scheduled for: ${formatNoticeDate(notice.published_at)}` : formatNoticeDate(notice.published_at)}
          </Text>
          <View style={styles.viewDetailsRow}>
            <Text style={styles.viewMoreText}>View details</Text>
            <Feather name="chevron-right" size={13} color="#2563EB" style={{ marginLeft: 2 }} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  readCard: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.88,
  },
  highPriorityCard: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
    backgroundColor: '#FFF5F5',
  },
  expiredCard: {
    opacity: 0.65,
  },
  highPriorityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
    gap: 6,
  },
  highPriorityIcon: {
    fontSize: 12,
  },
  highPriorityLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
    letterSpacing: 0.5,
  },
  cardContent: {
    padding: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  expiredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  expiredBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  futureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  futureBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  unreadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2563EB',
  },
  readText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  bodyRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  textContainer: {
    flex: 1,
  },
  thumbnailContainer: {
    marginLeft: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 4,
  },
  readTitle: {
    color: '#475569',
    fontWeight: '600',
  },
  highPriorityTitle: {
    color: '#991B1B',
  },
  departmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#F1F5F9',
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  viewDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
