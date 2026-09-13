import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { PROFILE_GROUPS, PROFILE_USER } from '../data/profile';
import { ChevronRightIcon, SettingsIcon } from '../components/Icons';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingTop: insets.top + 8 }]} showsVerticalScrollIndicator={false}>
      <View style={styles.headerRow}>
        <Text style={styles.heading}>Profile</Text>
        <SettingsIcon />
      </View>

      <View style={styles.profileCard}>
        <LinearGradient colors={['#C8FF4D', '#6fbf3b']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.avatar}>
          <Text style={styles.avatarText}>{PROFILE_USER.initials}</Text>
        </LinearGradient>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.name}>{PROFILE_USER.name}</Text>
          <Text style={styles.email}>{PROFILE_USER.email}</Text>
        </View>
        <View style={styles.unverifiedBadge}>
          <Text style={styles.unverifiedText}>Unverified</Text>
        </View>
      </View>

      {PROFILE_GROUPS.map((group) => (
        <View key={group.title}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          <View style={styles.groupCard}>
            {group.items.map((item, idx) => (
              <Pressable key={item.name} style={[styles.item, idx > 0 && styles.itemBorder]}>
                <View style={[styles.itemMark, { backgroundColor: item.bg }]}>
                  <Text style={[styles.itemMarkText, { color: item.fg }]}>{item.mark}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemSub}>{item.sub}</Text>
                </View>
                {item.value ? <Text style={styles.itemValue}>{item.value}</Text> : null}
                <ChevronRightIcon />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingHorizontal: 20, paddingBottom: 24, gap: 20 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heading: { fontFamily: fontFamily.display, fontSize: 26, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 15, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline },
  avatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fontFamily.display, fontSize: 19, fontWeight: '700', color: colors.bg },
  name: { fontFamily: fontFamily.display, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  email: { fontSize: 12.5, color: colors.textDim, marginTop: 2 },
  unverifiedBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: colors.downSoftest },
  unverifiedText: { fontSize: 11, fontWeight: '600', color: colors.downText },
  groupTitle: { fontSize: 11, letterSpacing: 1.6, color: colors.textDim, fontWeight: '600', paddingBottom: 10 },
  groupCard: { borderRadius: 18, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.borderHairline, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14 },
  itemBorder: { borderTopWidth: 1, borderTopColor: colors.divider },
  itemMark: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  itemMarkText: { fontFamily: fontFamily.displayBold, fontSize: 13 },
  itemName: { fontSize: 14, fontWeight: '500', color: colors.textHigh },
  itemSub: { fontSize: 11.5, color: colors.textDim, marginTop: 2 },
  itemValue: { fontSize: 12.5, fontWeight: '600', color: colors.textMuted },
  logout: { height: 48, borderRadius: 14, backgroundColor: colors.downSoft, borderWidth: 1, borderColor: colors.downBorder, alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontSize: 14, fontWeight: '600', color: colors.downText },
});
