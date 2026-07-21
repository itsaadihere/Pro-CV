import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Platform, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Mail, 
  CreditCard, 
  Sparkles, 
  LogOut, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  Check 
} from 'lucide-react-native';
import { supabase } from '../../../lib/supabase';
import { addCreditsToUser } from '../../../lib/api';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setProfile(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleBuyCredits = async (amount: number, packageName: string) => {
    setPurchasing(true);
    try {
      const newTotal = await addCreditsToUser(amount);
      setProfile((prev: any) => ({ ...prev, cv_credits: newTotal }));
      setPurchasing(false);
      Alert.alert('Purchase Successful!', `Added ${amount} CV Credits to your account (${packageName}). New Balance: ${newTotal}`);
    } catch (e: any) {
      setPurchasing(false);
      Alert.alert('Error', e.message || 'Failed to update credits.');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  const credits = profile?.cv_credits ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card Header */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(profile?.full_name || profile?.email || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{profile?.full_name || 'Sophi Member'}</Text>
            <View style={styles.emailRow}>
              <Mail color="#64748b" size={14} />
              <Text style={styles.userEmail}>{profile?.email}</Text>
            </View>
          </View>
        </View>

        {/* Current Balance Card */}
        <View style={styles.balanceCard}>
          <View>
            <Text style={styles.balanceLabel}>Available CV Credits</Text>
            <Text style={styles.balanceValue}>{credits}</Text>
          </View>
          <View style={styles.balanceBadge}>
            <Sparkles color="#0284c7" size={16} />
            <Text style={styles.balanceBadgeText}>Active Account</Text>
          </View>
        </View>

        {/* Purchase Packages Store */}
        <Text style={styles.sectionTitle}>Get Additional CV Slots</Text>
        <View style={styles.packageGrid}>
          {/* Package 1 */}
          <TouchableOpacity 
            style={styles.packageCard} 
            onPress={() => handleBuyCredits(5, 'Starter Pack')}
            disabled={purchasing}
          >
            <View style={styles.packageHeader}>
              <Text style={styles.packageName}>Starter Pack</Text>
              <Text style={styles.packageCredits}>5 Credits</Text>
            </View>
            <Text style={styles.packagePrice}>$9.99</Text>
            <Text style={styles.packageDesc}>Perfect for immediate job search</Text>
          </TouchableOpacity>

          {/* Package 2 */}
          <TouchableOpacity 
            style={[styles.packageCard, styles.packageCardPopular]} 
            onPress={() => handleBuyCredits(15, 'Pro Pack')}
            disabled={purchasing}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>MOST POPULAR</Text>
            </View>
            <View style={styles.packageHeader}>
              <Text style={[styles.packageName, { color: '#fff' }]}>Pro Pack</Text>
              <Text style={[styles.packageCredits, { color: '#38bdf8' }]}>15 Credits</Text>
            </View>
            <Text style={[styles.packagePrice, { color: '#fff' }]}>$19.99</Text>
            <Text style={[styles.packageDesc, { color: '#94a3b8' }]}>Best value for multiple applications</Text>
          </TouchableOpacity>
        </View>

        {/* Account Menu Settings */}
        <Text style={styles.sectionTitle}>Account & Support</Text>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem}>
            <ShieldCheck color="#64748b" size={20} />
            <Text style={styles.menuText}>Privacy & Security</Text>
            <ChevronRight color="#cbd5e1" size={18} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem}>
            <HelpCircle color="#64748b" size={20} />
            <Text style={styles.menuText}>Help & Support Center</Text>
            <ChevronRight color="#cbd5e1" size={18} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <LogOut color="#ef4444" size={20} />
            <Text style={[styles.menuText, { color: '#ef4444', fontWeight: 'bold' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 40,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 8) : 8 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  userCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginTop: 8,
    gap: 14 
  },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#0f2b48', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  userEmail: { fontSize: 13, color: '#64748b' },
  balanceCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 20, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balanceLabel: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' },
  balanceValue: { fontSize: 36, fontWeight: '900', color: '#020617', marginTop: 2 },
  balanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  balanceBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#0369a1' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginTop: 24, marginBottom: 12 },
  packageGrid: { gap: 12 },
  packageCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  packageCardPopular: { backgroundColor: '#0f2b48', borderColor: '#0f2b48', position: 'relative' },
  popularBadge: { position: 'absolute', top: -10, right: 16, backgroundColor: '#0284c7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  popularText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  packageName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  packageCredits: { fontSize: 14, fontWeight: 'bold', color: '#0284c7' },
  packagePrice: { fontSize: 22, fontWeight: '900', color: '#0f172a', marginTop: 8 },
  packageDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  menuBox: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuText: { flex: 1, fontSize: 15, color: '#0f172a', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#f1f5f9' }
});
