import React from 'react';
import {
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface DevControlsModalProps {
  visible: boolean;
  onClose: () => void;
  simulateFailures: boolean;
  onToggleSimulateFailures: () => void;
  onClearReadNotices: () => void;
  readCount: number;
}

export const DevControlsModal: React.FC<DevControlsModalProps> = ({
  visible,
  onClose,
  simulateFailures,
  onToggleSimulateFailures,
  onClearReadNotices,
  readCount,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>
              <View style={styles.header}>
                <Text style={styles.title}>🛠️ Developer / Reviewer Controls</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>
                Settings for testing API behavior, edge cases, and local persistence.
              </Text>

              {/* Toggle 1-in-5 failures switch */}
              <View style={styles.row}>
                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowLabel}>Simulate 1-in-5 Failures</Text>
                  <Text style={styles.rowDescription}>
                    Simulates random ~20% network drops on requests. Turn off for smooth browsing.
                  </Text>
                </View>
                <Switch
                  value={simulateFailures}
                  onValueChange={onToggleSimulateFailures}
                  trackColor={{ false: '#CBD5E1', true: '#EF4444' }}
                  thumbColor={simulateFailures ? '#FFFFFF' : '#F8FAFC'}
                />
              </View>

              {/* Reset read status */}
              <View style={[styles.row, { borderBottomWidth: 0 }]}>
                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowLabel}>Reset Read Statuses</Text>
                  <Text style={styles.rowDescription}>
                    {readCount} notice{readCount === 1 ? '' : 's'} currently marked as read in storage.
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onClearReadNotices();
                    onClose();
                  }}
                  style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Reset</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onClose}
                style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeButton: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
    padding: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  actionButton: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  doneButton: {
    backgroundColor: '#1E293B',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
