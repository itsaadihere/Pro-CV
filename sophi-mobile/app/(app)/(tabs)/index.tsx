import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl, 
  Platform, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { 
  Settings, 
  PlusCircle, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Bot, 
  Target, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react-native';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const router = useRouter();

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      setProfile(prof);

      const { data: cvJobs } = await supabase
        .from('cv_jobs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (cvJobs) setJobs(cvJobs);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Safe Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/logo.svg')} 
            style={styles.logo} 
            contentFit="contain" 
          />
          <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Settings color="#0f2b48" size={24} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Welcome back, {profile?.full_name || 'User'}!</Text>
              <Text style={styles.cardSubtitle}>{profile?.email}</Text>
            </View>
          </View>
        </View>

        {/* Credits Card */}
        <View style={[styles.card, styles.creditsCard]}>
          <View>
            <Text style={styles.creditsLabel}>Credits Remaining</Text>
            <Text style={styles.creditsValue}>{credits}</Text>
          </View>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push(credits > 0 ? '/create' : '/profile')}
          >
            <PlusCircle color="#fff" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.primaryButtonText}>{credits > 0 ? 'Create CV' : 'Buy Slots'}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Launch Action Cards */}
        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity 
            style={[styles.quickCard, { backgroundColor: '#0f2b48' }]}
            onPress={() => router.push('/create')}
          >
            <View style={styles.quickCardIcon}>
              <Sparkles color="#38bdf8" size={22} />
            </View>
            <Text style={[styles.quickCardTitle, { color: '#fff' }]}>AI Revamp</Text>
            <Text style={[styles.quickCardSub, { color: '#94a3b8' }]}>Transform your CV for ATS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickCard}
            onPress={() => router.push('/chat')}
          >
            <View style={[styles.quickCardIcon, { backgroundColor: '#f0f9ff' }]}>
              <Bot color="#0284c7" size={22} />
            </View>
            <Text style={styles.quickCardTitle}>AI Coach</Text>
            <Text style={styles.quickCardSub}>Interview & career advice</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickCard}
            onPress={() => router.push('/ats-checker')}
          >
            <View style={[styles.quickCardIcon, { backgroundColor: '#fefce8' }]}>
              <Target color="#ca8a04" size={22} />
            </View>
            <Text style={styles.quickCardTitle}>ATS Scanner</Text>
            <Text style={styles.quickCardSub}>Match CV against job post</Text>
          </TouchableOpacity>
        </View>

        {/* History Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Your CV Revamp History</Text>
          <Text style={styles.historyCount}>{jobs.length} jobs</Text>
        </View>

        {jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText color="#94a3b8" size={36} />
            <Text style={styles.emptyTitle}>No revamp jobs found</Text>
            <Text style={styles.emptySubtitle}>You haven't optimized any CVs yet. Tap Create CV to start.</Text>
            <TouchableOpacity 
              style={[styles.primaryButton, { marginTop: 16 }]}
              onPress={() => router.push('/create')}
            >
              <PlusCircle color="#fff" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.primaryButtonText}>Create First CV</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.map(job => (
            <TouchableOpacity 
              key={job.id} 
              style={styles.jobCard}
              onPress={() => router.push(`/result/${job.id}` as any)}
              activeOpacity={0.7}
            >
              <View style={styles.jobRow}>
                <Calendar color="#64748b" size={16} />
                <Text style={styles.jobDate}>
                  {new Date(job.created_at).toLocaleDateString()}
                </Text>
                <View style={styles.jobStatus}>
                  <Text style={styles.jobStatusText}>{job.status || 'COMPLETED'}</Text>
                </View>
              </View>

              <Text style={styles.jobIndustry}>{job.target_industry || 'General Role'}</Text>

              <View style={styles.jobBottomRow}>
                <View style={styles.jobScoreRow}>
                  <TrendingUp color="#16a34a" size={16} />
                  <Text style={styles.jobScoreLabel}>ATS Match Score:</Text>
                  <Text style={styles.jobScoreValue}>
                    {typeof job.ats_score === 'object' ? job.ats_score?.overall : 88}%
                  </Text>
                </View>
                <ChevronRight color="#94a3b8" size={18} />
              </View>
            </TouchableOpacity>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 32, 
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 8) : 8 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20, 
    paddingTop: 8,
    paddingBottom: 8 
  },
  logo: { width: 120, height: 38 },
  logoutButton: { paddingVertical: 6, paddingHorizontal: 10 },
  logoutText: { color: '#ef4444', fontWeight: 'bold', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { backgroundColor: '#f4f7fb', width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  cardSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  creditsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  creditsLabel: { fontSize: 12, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' },
  creditsValue: { fontSize: 32, fontWeight: '900', color: '#020617' },
  primaryButton: { backgroundColor: '#0f2b48', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  primaryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  historyCount: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  quickGrid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  quickCard: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 12, 
    borderRadius: 14, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    justifyContent: 'space-between'
  },
  quickCardIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#1e3a5f', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  quickCardTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  quickCardSub: { fontSize: 11, color: '#64748b', marginTop: 2 },
  emptyState: { alignItems: 'center', padding: 32, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 4, textAlign: 'center' },
  jobCard: { backgroundColor: '#fff', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  jobRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  jobDate: { fontSize: 13, color: '#64748b', marginLeft: 6, flex: 1 },
  jobStatus: { backgroundColor: '#dcfce7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  jobStatusText: { fontSize: 10, fontWeight: 'bold', color: '#15803d', textTransform: 'uppercase' },
  jobIndustry: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
  jobBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  jobScoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  jobScoreLabel: { fontSize: 13, color: '#64748b' },
  jobScoreValue: { fontSize: 15, fontWeight: '800', color: '#15803d' },
});
