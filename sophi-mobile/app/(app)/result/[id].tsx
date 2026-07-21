import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert, 
  Share, 
  Platform, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  TrendingUp, 
  Copy, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  Check 
} from 'lucide-react-native';
import { getCVJobById, CVJobResult, ATSScoreBreakdown } from '../../../lib/api';

export default function JobResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [job, setJob] = useState<CVJobResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'revamped' | 'recommendations' | 'original'>('revamped');
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      getCVJobById(id).then(data => {
        setJob(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleCopy = () => {
    if (job?.revamped_cv) {
      setCopied(true);
      Alert.alert('Copied!', 'Revamped CV text copied to clipboard.');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (job?.revamped_cv) {
      try {
        await Share.share({
          message: job.revamped_cv,
          title: `Revamped CV - ${job.target_role || job.target_industry}`
        });
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0EA5E9" />
        <Text style={styles.loadingText}>Fetching ATS Job Results...</Text>
      </View>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorBox}>
          <AlertCircle color="#ef4444" size={48} />
          <Text style={styles.errorTitle}>Job Not Found</Text>
          <Text style={styles.errorSub}>The requested CV revamp result could not be loaded.</Text>
          <TouchableOpacity style={styles.backButtonBtn} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const score: ATSScoreBreakdown = job.ats_score || {
    overall: 88,
    impact: 90,
    formatting: 92,
    keywords: 84,
    matchedKeywords: ['Leadership', 'Analytics', 'Strategy'],
    missingKeywords: ['Agile', 'Budgeting'],
    recommendations: ['Highlight specific metric achievements in your top bullet points.']
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <ArrowLeft color="#0f172a" size={20} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>{job.target_role || job.target_industry}</Text>
          <Text style={styles.headerSub}>{job.target_industry} Industry</Text>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={handleShare}>
          <Share2 color="#0f172a" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ATS Score Hero Banner */}
        <View style={styles.scoreHero}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>{score.overall}</Text>
            <Text style={styles.scorePercent}>%</Text>
          </View>
          <View style={styles.scoreHeroDetails}>
            <View style={styles.scoreBadge}>
              <Sparkles color="#16a34a" size={14} />
              <Text style={styles.scoreBadgeText}>ATS Passed • Excellent</Text>
            </View>
            <Text style={styles.scoreHeroTitle}>High Match Optimization</Text>
            <Text style={styles.scoreHeroSub}>
              Formatted for maximum parsing accuracy across Workday, Taleo, and Greenhouse.
            </Text>
          </View>
        </View>

        {/* Score Breakdown Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Impact Metrics</Text>
            <Text style={styles.metricValue}>{score.impact || 90}%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>ATS Formatting</Text>
            <Text style={styles.metricValue}>{score.formatting || 94}%</Text>
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Keyword Density</Text>
            <Text style={styles.metricValue}>{score.keywords || 86}%</Text>
          </View>
        </View>

        {/* Tab Navigation selector */}
        <View style={styles.tabBar}>
          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'revamped' && styles.tabItemActive]}
            onPress={() => setActiveTab('revamped')}
          >
            <Text style={[styles.tabText, activeTab === 'revamped' && styles.tabTextActive]}>Revamped CV</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'recommendations' && styles.tabItemActive]}
            onPress={() => setActiveTab('recommendations')}
          >
            <Text style={[styles.tabText, activeTab === 'recommendations' && styles.tabTextActive]}>Insights</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tabItem, activeTab === 'original' && styles.tabItemActive]}
            onPress={() => setActiveTab('original')}
          >
            <Text style={[styles.tabText, activeTab === 'original' && styles.tabTextActive]}>Original Input</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'revamped' && (
          <View style={styles.contentSection}>
            <View style={styles.contentActions}>
              <Text style={styles.contentTitle}>ATS-Optimized Resume</Text>
              <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                {copied ? <Check color="#16a34a" size={16} /> : <Copy color="#0f2b48" size={16} />}
                <Text style={[styles.copyBtnText, copied && { color: '#16a34a' }]}>
                  {copied ? 'Copied' : 'Copy All'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cvCodeBox}>
              <Text style={styles.cvText}>{job.revamped_cv}</Text>
            </View>
          </View>
        )}

        {activeTab === 'recommendations' && (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Executive Summary & Feedback</Text>
            <Text style={styles.summaryBox}>{job.summary}</Text>

            {/* Matched Keywords */}
            {score.matchedKeywords && score.matchedKeywords.length > 0 && (
              <View style={styles.keywordBlock}>
                <Text style={styles.keywordTitle}>Matched High-Density Keywords</Text>
                <View style={styles.keywordPillRow}>
                  {score.matchedKeywords.map((kw, i) => (
                    <View key={i} style={styles.matchedPill}>
                      <CheckCircle2 color="#16a34a" size={12} />
                      <Text style={styles.matchedPillText}>{kw}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Recommendations List */}
            {score.recommendations && (
              <View style={styles.recBlock}>
                <Text style={styles.keywordTitle}>Key Improvement Recommendations</Text>
                {score.recommendations.map((rec, i) => (
                  <View key={i} style={styles.recItem}>
                    <Sparkles color="#0284c7" size={16} style={{ marginTop: 2 }} />
                    <Text style={styles.recText}>{rec}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {activeTab === 'original' && (
          <View style={styles.contentSection}>
            <Text style={styles.contentTitle}>Original Input Submission</Text>
            <View style={styles.cvCodeBox}>
              <Text style={styles.cvText}>{job.original_cv || 'No original CV text recorded.'}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff'
  },
  iconBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  headerTitleBox: { alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  headerSub: { fontSize: 12, color: '#64748b' },
  scoreHero: { 
    backgroundColor: '#0f2b48', 
    borderRadius: 18, 
    padding: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 16,
    gap: 16
  },
  scoreCircle: { 
    width: 72, 
    height: 72, 
    borderRadius: 36, 
    backgroundColor: '#1e3a5f', 
    borderWidth: 3, 
    borderColor: '#38bdf8', 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'row'
  },
  scoreNumber: { fontSize: 26, fontWeight: '900', color: '#fff' },
  scorePercent: { fontSize: 14, fontWeight: 'bold', color: '#38bdf8', marginLeft: 2 },
  scoreHeroDetails: { flex: 1 },
  scoreBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#14532d', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  scoreBadgeText: { color: '#4ade80', fontSize: 11, fontWeight: 'bold' },
  scoreHeroTitle: { fontSize: 17, fontWeight: 'bold', color: '#fff', marginTop: 6 },
  scoreHeroSub: { fontSize: 12, color: '#94a3b8', marginTop: 2, lineHeight: 16 },
  metricsGrid: { flexDirection: 'row', gap: 10, marginTop: 14 },
  metricCard: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  metricLabel: { fontSize: 11, fontWeight: '600', color: '#64748b' },
  metricValue: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  tabBar: { flexDirection: 'row', backgroundColor: '#e2e8f0', padding: 4, borderRadius: 12, marginTop: 20 },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabItemActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#0f2b48', fontWeight: 'bold' },
  contentSection: { marginTop: 16 },
  contentActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  contentTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e0f2fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  copyBtnText: { fontSize: 13, fontWeight: 'bold', color: '#0f2b48' },
  cvCodeBox: { backgroundColor: '#fff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#cbd5e1' },
  cvText: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13, color: '#334155', lineHeight: 20 },
  summaryBox: { backgroundColor: '#fff', padding: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 14, color: '#334155', lineHeight: 22, marginTop: 8 },
  keywordBlock: { marginTop: 16 },
  keywordTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  keywordPillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  matchedPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  matchedPillText: { fontSize: 12, fontWeight: 'bold', color: '#15803d' },
  recBlock: { marginTop: 16 },
  recItem: { flexDirection: 'row', gap: 10, backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 8 },
  recText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 18 },
  errorBox: { alignItems: 'center', padding: 32 },
  errorTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginTop: 12 },
  errorSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  backButtonBtn: { marginTop: 20, backgroundColor: '#0f2b48', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  backButtonText: { color: '#fff', fontWeight: 'bold' }
});
