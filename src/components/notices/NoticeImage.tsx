import { Image } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface NoticeImageProps {
  uri: string | null;
  aspectRatio?: number;
  height?: number;
  width?: number | `${number}%`;
  borderRadius?: number;
  category?: string;
  isThumbnail?: boolean;
}

const CATEGORY_STYLES: Record<
  string,
  {
    bg: string;
    border: string;
    badgeBg: string;
    icon: string;
    title: string;
    sub: string;
    badgeText: string;
  }
> = {
  emergency: {
    bg: '#7F1D1D',
    border: '#EF4444',
    badgeBg: '#DC2626',
    icon: '🚨',
    title: 'EMERGENCY ALERT',
    sub: 'Community Safety Notice',
    badgeText: 'EMERGENCY',
  },
  event: {
    bg: '#4C1D95',
    border: '#8B5CF6',
    badgeBg: '#7C3AED',
    icon: '📅',
    title: 'COMMUNITY EVENT',
    sub: 'Gatherings & Recreation',
    badgeText: 'EVENT',
  },
  service: {
    bg: '#0C4A6E',
    border: '#0284C7',
    badgeBg: '#0369A1',
    icon: '🛠️',
    title: 'COMMUNITY SERVICE',
    sub: 'Health, Facilities & Maintenance',
    badgeText: 'SERVICE',
  },
  general: {
    bg: '#0F172A',
    border: '#475569',
    badgeBg: '#334155',
    icon: '📢',
    title: 'GENERAL NOTICE',
    sub: 'Administration & Community Updates',
    badgeText: 'GENERAL',
  },
};

export const NoticeImage: React.FC<NoticeImageProps> = ({
  uri,
  aspectRatio = 16 / 9,
  height,
  width = '100%',
  borderRadius = 8,
  category = 'general',
  isThumbnail = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(uri));

  const catKey = category?.toLowerCase();
  const theme = CATEGORY_STYLES[catKey] || CATEGORY_STYLES.general;

  // Render category-specific fallback when uri is null or image fails to load
  if (!uri || hasError) {
    if (isThumbnail) {
      // Compact 68x68 thumbnail layout with zero text overflow
      return (
        <View
          style={[
            styles.thumbFallbackContainer,
            {
              borderRadius,
              width,
              height: height || 68,
              backgroundColor: theme.bg,
              borderColor: theme.border,
            },
          ]}>
          <View style={[styles.thumbBadge, { backgroundColor: theme.badgeBg }]}>
            <Text style={styles.thumbIcon}>{theme.icon}</Text>
          </View>
          <Text numberOfLines={1} style={styles.thumbText}>
            {theme.badgeText}
          </Text>
        </View>
      );
    }

    // Full 16:9 hero banner fallback layout for detail screen
    return (
      <View
        style={[
          styles.heroFallbackContainer,
          {
            borderRadius,
            width,
            ...(height ? { height } : { aspectRatio }),
            backgroundColor: theme.bg,
            borderColor: theme.border,
          },
        ]}>
        {/* Subtle decorative circles */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        {/* Center content */}
        <View style={[styles.heroIconBadge, { backgroundColor: theme.badgeBg }]}>
          <Text style={styles.heroIcon}>{theme.icon}</Text>
        </View>
        <Text style={styles.heroTitle}>{theme.title}</Text>
        <Text style={styles.heroSubtitle}>{theme.sub}</Text>
      </View>
    );
  }

  // Active network image with loading overlay and error recovery
  return (
    <View
      style={[
        styles.imageWrapper,
        {
          borderRadius,
          width,
          ...(height ? { height } : { aspectRatio }),
        },
      ]}>
      <Image
        source={{ uri }}
        style={styles.image}
        contentFit="cover"
        transition={300}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
      {isLoading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="small" color="#64748B" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Thumbnail fallback styles (fits within 68x68)
  thumbFallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbIcon: {
    fontSize: 18,
  },
  thumbText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  // Hero fallback styles (16:9 banner)
  heroFallbackContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    top: -50,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
    borderStyle: 'dashed',
    top: -90,
  },
  heroIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroIcon: {
    fontSize: 32,
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 4,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
});
