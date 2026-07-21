import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  Platform, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Target, CheckCircle2, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react-native';
import { analyzeATSCompatibility } from '../../../lib/api';

export default function ATSCheckerScreen() {
  const [cvText, setCvText] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const router = useRouter();

  const handleScan = () => {
    if (!cvText.trim() || !jobDesc.trim()) {
      Alert.alert('Missing Input', 'Please paste both your CV text and the target Job Description.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = analyzeATSCompatibility(cvText, jobDesc);
      setAnalysis(res);
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setAnalysis(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.badge}>
            <Target color="#ca8a04" size={14} />
            <Text style={styles.badgeText}>Instant Keyword Scanner</Text>
          </View>
          <Text style={styles.title}>ATS Match Checker</Text>
          <Text style={styles.subtitle}>
            Compare your resume text against any job posting to discover missing keywords and calculate your match percentage.
          </Text>
        </View>

        {!analysis ? (
          <View style={styles.formSection}>
            <Text style={styles.label}>1. Paste Resume / CV Text</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Paste your current resume content..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={cvText}
              onChangeText={setCvText}
            />

            <Text style={styles.label}>2. Paste Target Job Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Paste the job posting requirements or duties..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={jobDesc}
              onChangeText={setJobDesc}
            />

            <TouchableOpacity 
              style={styles.scanButton} 
              onPress={handleScan}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <View style={styles.scanRow}>
                  <Target color="#fff" size={18} style={{ marginRight: 8 }} />
                  <Text style={styles.scanText}>Run ATS Compatibility Scan</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            {/* Score Hero */}
            <View style={styles.scoreHero}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreNumber}>{analysis.score}%</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreTitle}>
                  {analysis.score >= 80 ? 'Strong Match!' : 'Optimization Recommended'}
                </Text>
                <Text style={styles.scoreSub}>
                  {analysis.score >= 80 
                    ? 'Your resume contains essential keywords for this position.' 
                    : 'Add missing target keywords to improve ATS pass rates.'}
                </Text>
              </View>
            </View>

            {/* Matched Keywords */}
            <Text style={styles.sectionHeading}>Found Keywords ({analysis.matchedKeywords.length})</Text>
            <View style={styles.pillContainer}>
              {analysis.matchedKeywords.length > 0 ? (
                analysis.matchedKeywords.map((kw: string, i: number) => (
                  <View key={i} style={styles.matchedPill}>
                    <CheckCircle2 color="#16a34a" size={12} />
                    <Text style={styles.matchedText}>{kw}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No direct keyword matches identified.</Text>
              )}
            </View>

            {/* Missing Keywords */}
            <Text style={styles.sectionHeading}>Missing Critical Keywords ({analysis.missingKeywords.length})</Text>
            <View style={styles.pillContainer}>
              {analysis.missingKeywords.length > 0 ? (
                analysis.missingKeywords.map((kw: string, i: number) => (
                  <View key={i} style={styles.missingPill}>
                    <AlertTriangle color="#ea580c" size={12} />
                    <Text style={styles.missingText}>{kw}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No major missing keywords!</Text>
              )}
            </View>

            {/* Action Buttons */}
            <TouchableOpacity 
              style={styles.revampBannerBtn}
              onPress={() => router.push('/create')}
            >
              <Sparkles color="#fff" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.revampBannerText}>Revamp this CV with Sophi AI</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <RefreshCw color="#64748b" size={16} style={{ marginRight: 6 }} />
              <Text style={styles.resetBtnText}>Scan Another Job</Text>
            </TouchableOpacity>
          </View>
        )}
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
  header: { marginBottom: 20, marginTop: 8 },
  badge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fef9c3', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20, 
    gap: 6,
    marginBottom: 8 
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#854d0e' },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, lineHeight: 20 },
  formSection: { gap: 8 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 8 },
  textArea: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 14, 
    color: '#0f172a',
    minHeight: 120
  },
  scanButton: { 
    backgroundColor: '#0f2b48', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 16 
  },
  scanRow: { flexDirection: 'row', alignItems: 'center' },
  scanText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  resultsSection: { gap: 14 },
  scoreHero: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0', 
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 16
  },
  scoreCircle: { 
    width: 68, 
    height: 68, 
    borderRadius: 34, 
    backgroundColor: '#f0f9ff', 
    borderWidth: 3, 
    borderColor: '#0284c7', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  scoreNumber: { fontSize: 22, fontWeight: '900', color: '#0284c7' },
  scoreTitle: { fontSize: 17, fontWeight: 'bold', color: '#0f172a' },
  scoreSub: { fontSize: 13, color: '#64748b', marginTop: 2, lineHeight: 18 },
  sectionHeading: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 8 },
  pillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  matchedPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#dcfce7', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  matchedText: { fontSize: 12, fontWeight: 'bold', color: '#15803d' },
  missingPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffedd5', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  missingText: { fontSize: 12, fontWeight: 'bold', color: '#c2410c' },
  emptyText: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
  revampBannerBtn: { 
    backgroundColor: '#0f2b48', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 14, 
    borderRadius: 12, 
    marginTop: 12 
  },
  revampBannerText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  resetBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10 },
  resetBtnText: { color: '#64748b', fontWeight: '600', fontSize: 14 }
});
