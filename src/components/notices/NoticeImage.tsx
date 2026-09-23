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
  showFallbackOnMissing?: boolean;
}

export const NoticeImage: React.FC<NoticeImageProps> = ({
  uri,
  aspectRatio = 16 / 9,
  height,
  width = '100%',
  borderRadius = 8,
  category = 'Notice',
  showFallbackOnMissing = true,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(uri));

  if (!uri && !showFallbackOnMissing) {
    return null;
  }

  if (!uri || hasError) {
    return (
      <View
        style={[
          styles.fallbackContainer,
          {
            borderRadius,
            width,
            ...(height ? { height } : { aspectRatio }),
          },
        ]}>
        <Text style={styles.fallbackIcon}>🖼️</Text>
        <Text style={styles.fallbackCategoryText}>{category.toUpperCase()}</Text>
        {hasError && <Text style={styles.fallbackErrorText}>Image preview unavailable</Text>}
      </View>
    );
  }

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
  fallbackContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  fallbackIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  fallbackCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  fallbackErrorText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
