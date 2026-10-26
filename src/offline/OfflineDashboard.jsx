import React, {useCallback, useState} from 'react';
import {Alert, View, Text, TouchableOpacity, StyleSheet, SafeAreaView} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getSession, logoutAttendance, requireAttendanceAccess} from './session';
import {pendingAttendance} from './queue';
import {subscribeAutoSync} from './autoSync';
import {getEmployeePunchTime} from '../utils/attendanceStorage';

export default function OfflineDashboard({navigation}) {
  const account = getSession();
  const [pending, setPending] = useState([]);
  const [action, setAction] = useState(null);
  useFocusEffect(useCallback(() => {
    let active = true;
    const refresh = async () => {
      if (!account || account.employee?.offline_attendance !== true) {
        navigation.reset({index: 0, routes: [{name: 'Login'}]});
        return;
      }
      await requireAttendanceAccess(account.server, account.employee.emp_code);
      const records = await pendingAttendance(account);
      const last = records[records.length - 1];
      const punch = await getEmployeePunchTime(account.employee.emp_code);
      if (active) {
        setPending(records);
        setAction(last ? (last.action === 'CHECK_IN' ? 'CHECK_OUT' : 'CHECK_IN') :
          (punch ? 'CHECK_OUT' : 'CHECK_IN'));
      }
    };
    const load = () => refresh().catch(error => { if (active) { Alert.alert('Attendance', error.message); } });
    load();
    const unsubscribe = subscribeAutoSync(load);
    return () => { active = false; unsubscribe(); };
  }, [account, navigation]));
  const signOut = async () => {
    try {
      await logoutAttendance();
      navigation.reset({index: 0, routes: [{name: 'Login'}]});
    } catch (error) { Alert.alert('Logout failed', error.message); }
  };

  const initials = account?.employee?.name
    ? account.employee.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?';
  const isCheckOut = action === 'CHECK_OUT';

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.title}>{account?.employee?.name}</Text>
          <Text style={styles.subtitle}>{account?.employee?.emp_code}</Text>

          <View style={styles.badge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>Automatic attendance sync</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Pending records</Text>
            <View style={styles.pendingPill}>
              <Text style={styles.pendingPillText}>{pending.length}</Text>
            </View>
          </View>

          <Text style={styles.note}>
            Saved on this device. Attendance syncs automatically when internet is available.
          </Text>

          <TouchableOpacity
            style={[styles.primaryBtn, isCheckOut && styles.primaryBtnOut, !action && styles.btnDisabled]}
            disabled={!action}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Selfie', {
              attendanceAction: action, userinfo: account.employee,
            })}
          >
            <Text style={styles.primaryBtnText}>
              {isCheckOut ? 'Check Out' : 'Check In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7} onPress={signOut}>
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: '#F4F6F9'},
  container: {flex: 1, padding: 20, justifyContent: 'center'},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#0A1628',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 6},
    elevation: 4,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#0A1628',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {color: '#FFFFFF', fontSize: 22, fontWeight: '700'},
  title: {fontSize: 20, fontWeight: '700', color: '#0A1628', textAlign: 'center'},
  subtitle: {fontSize: 13, color: '#7A8699', marginTop: 2, marginBottom: 14},
  badge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF4E5', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, marginBottom: 18,
  },
  badgeDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B', marginRight: 6},
  badgeText: {fontSize: 13, fontWeight: '600', color: '#B45309'},
  divider: {height: 1, width: '100%', backgroundColor: '#EEF1F5', marginBottom: 16},
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', marginBottom: 16,
  },
  rowLabel: {fontSize: 15, color: '#0A1628', fontWeight: '500'},
  pendingPill: {
    backgroundColor: '#E7EEFF', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  pendingPillText: {color: '#2952CC', fontWeight: '700', fontSize: 14},
  note: {
    fontSize: 13, color: '#7A8699', textAlign: 'center', lineHeight: 18, marginBottom: 22,
  },
  primaryBtn: {
    width: '100%', backgroundColor: '#2952CC',
    paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginBottom: 12,
  },
  primaryBtnOut: {backgroundColor: '#B42318'},
  btnDisabled: {opacity: 0.4},
  primaryBtnText: {color: '#FFFFFF', fontSize: 16, fontWeight: '700'},
  logoutBtn: {paddingVertical: 10},
  logoutBtnText: {color: '#7A8699', fontSize: 14, fontWeight: '600'},
});