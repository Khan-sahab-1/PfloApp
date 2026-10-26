import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useColorScheme,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../styles/Colors';

const { width, height } = Dimensions.get('window');

/**
 * Prominent In-App Disclosure & Consent Modal for Location & Background Tracking
 * Designed in strict compliance with Google Play's User Data & Prominent Disclosure Policy:
 * https://support.google.com/googleplay/android-developer/answer/10144311#prominent-disclosure
 */
const LocationDisclosureModal = ({
  visible,
  onAccept,
  onDeny,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDeny}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          {/* Header Icon */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={36} color="#FFFFFF" />
            </View>
            <Text style={[styles.title, isDark && styles.textLight]}>
              Location Access &amp; Duty Tracking
            </Text>
            <Text style={[styles.subtitle, isDark && styles.textMutedDark]}>
              Prominent Disclosure &amp; Consent
            </Text>
          </View>

          {/* Content */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Core Google Play Policy Statement (DO NOT ALTER) */}
            <View style={styles.highlightBox}>
              <Ionicons name="information-circle" size={24} color="#D97706" style={{ marginTop: 2 }} />
              <Text style={styles.highlightText}>
                <Text style={{ fontWeight: '700' }}>PFLO</Text> collects location data to enable{' '}
                <Text style={{ fontWeight: '700' }}>
                  real-time employee duty tracking, route calculation, and shift attendance verification
                </Text>{' '}
                even when the app is closed or not in use.
              </Text>
            </View>

            {/* Disclosure Details */}
            <View style={styles.featureList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, { backgroundColor: '#EEF2FF' }]}>
                  <Ionicons name="time-outline" size={20} color="#4F46E5" />
                </View>
                <View style={styles.featureTextWrap}>
                  <Text style={[styles.featureTitle, isDark && styles.textLight]}>
                    Working Hours Only
                  </Text>
                  <Text style={[styles.featureDesc, isDark && styles.textMutedDark]}>
                    Location tracking is active strictly during your designated work shift. It automatically stops when you clock out or your shift ends.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, { backgroundColor: '#ECFDF5' }]}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#059669" />
                </View>
                <View style={styles.featureTextWrap}>
                  <Text style={[styles.featureTitle, isDark && styles.textLight]}>
                    Privacy &amp; Security First
                  </Text>
                  <Text style={[styles.featureDesc, isDark && styles.textMutedDark]}>
                    Your coordinates are encrypted and sent only to your employer's secure portal. PFLO never sells or shares your location data with third parties or advertisers.
                  </Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <View style={[styles.featureIconWrap, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="notifications-outline" size={20} color="#D97706" />
                </View>
                <View style={styles.featureTextWrap}>
                  <Text style={[styles.featureTitle, isDark && styles.textLight]}>
                    Visible Status Notification
                  </Text>
                  <Text style={[styles.featureDesc, isDark && styles.textMutedDark]}>
                    An ongoing notification remains visible in your status bar while live tracking is running so you are always in full control.
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.acceptButton}
              activeOpacity={0.85}
              onPress={onAccept}
              accessibilityRole="button"
              accessibilityLabel="Agree and Continue"
            >
              <Text style={styles.acceptButtonText}>Agree &amp; Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.denyButton}
              activeOpacity={0.7}
              onPress={onDeny}
              accessibilityRole="button"
              accessibilityLabel="Deny location tracking"
            >
              <Text style={[styles.denyButtonText, isDark && styles.textMutedDark]}>
                No Thanks / Deny
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: Math.min(width - 32, 420),
    maxHeight: height * 0.88,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  cardDark: {
    backgroundColor: '#161922',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.BUTTON || '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: COLORS.BUTTON || '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  scroll: {
    maxHeight: height * 0.46,
  },
  scrollContent: {
    paddingVertical: 4,
  },
  highlightBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    gap: 10,
  },
  highlightText: {
    flex: 1,
    fontSize: 13.5,
    lineHeight: 20,
    color: '#92400E',
  },
  featureList: {
    gap: 14,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#64748B',
  },
  footer: {
    marginTop: 18,
    gap: 10,
  },
  acceptButton: {
    backgroundColor: COLORS.BUTTON || '#4F46E5',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.BUTTON || '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  denyButton: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  denyButtonText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: '600',
  },
  textLight: {
    color: '#F8FAFC',
  },
  textMutedDark: {
    color: '#94A3B8',
  },
});

export default LocationDisclosureModal;

