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
import { Sparkles, Briefcase, FileText, CheckCircle, AlertCircle } from 'lucide-react-native';
import { createCVJob } from '../../../lib/api';

const INDUSTRIES = ['Tech', 'Finance', 'Marketing', 'Healthcare', 'Executive', 'General'];

export default function CreateCVScreen() {
  const [targetIndustry, setTargetIndustry] = useState('Tech');
  const [targetRole, setTargetRole] = useState('');
  const [originalCV, setOriginalCV] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!originalCV.trim()) {
      Alert.alert('Missing Content', 'Please paste your current CV or experience text.');
      return;
    }
    if (!targetRole.trim()) {
      Alert.alert('Missing Job Title', 'Please specify your target job title.');
      return;
    }

    setLoading(true);
    try {
      const result = await createCVJob({
        originalCV,
        targetIndustry,
        targetRole,
        jobDescription
      });

      setLoading(false);
      // Navigate to detailed result screen
      router.push(`/result/${result.id}` as any);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('CV Revamp Error', err.message || 'Failed to process CV revamp.');
    }
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
            <Sparkles color="#0284c7" size={14} />
            <Text style={styles.badgeText}>Sophi AI Engine v2.4</Text>
          </View>
          <Text style={styles.title}>Revamp Your CV</Text>
          <Text style={styles.subtitle}>
            Transform your resume into a high-scoring ATS application tailored for your target role.
          </Text>
        </View>

        {/* Target Industry Selector */}
        <Text style={styles.label}>1. Select Target Industry</Text>
        <View style={styles.industryRow}>
          {INDUSTRIES.map(ind => (
            <TouchableOpacity
              key={ind}
              style={[
                styles.chip,
                targetIndustry === ind && styles.chipActive
              ]}
              onPress={() => setTargetIndustry(ind)}
            >
              <Text style={[
                styles.chipText,
                targetIndustry === ind && styles.chipTextActive
              ]}>
                {ind}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Target Job Title */}
        <Text style={styles.label}>2. Target Job Title</Text>
        <View style={styles.inputContainer}>
          <Briefcase color="#64748b" size={20} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="e.g. Senior Software Engineer / Financial Analyst"
            placeholderTextColor="#94a3b8"
            value={targetRole}
            onChangeText={setTargetRole}
          />
        </View>

        {/* Current Resume Text */}
        <Text style={styles.label}>3. Paste Current CV / Resume Text</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Paste your existing resume summary, experience bullets, and skills here..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={8}
          textAlignVertical="top"
          value={originalCV}
          onChangeText={setOriginalCV}
        />

        {/* Optional Job Description */}
        <View style={styles.labelRow}>
          <Text style={styles.label}>4. Target Job Posting (Optional)</Text>
          <Text style={styles.optionalTag}>Recommended</Text>
        </View>
        <TextInput
          style={styles.textAreaSmall}
          placeholder="Paste the job description or requirements to align keywords directly..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={jobDescription}
          onChangeText={setJobDescription}
        />

        {/* Submit Action Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleGenerate}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.submitText}>Analyzing & Revamping CV...</Text>
            </View>
          ) : (
            <View style={styles.submitRow}>
              <Sparkles color="#fff" size={18} style={{ marginRight: 8 }} />
              <Text style={styles.submitText}>Generate ATS Revamped CV</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <Text style={styles.costInfo}>Uses 1 CV Credit per revamp</Text>
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
    backgroundColor: '#e0f2fe', 
    alignSelf: 'flex-start', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20, 
    gap: 6,
    marginBottom: 8 
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#0369a1' },
  title: { fontSize: 26, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 4, lineHeight: 20 },
  label: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginTop: 14, marginBottom: 8 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 8 },
  optionalTag: { fontSize: 11, fontWeight: 'bold', color: '#0284c7', backgroundColor: '#e0f2fe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  industryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chip: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1' },
  chipActive: { backgroundColor: '#0f2b48', borderColor: '#0f2b48' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#475569' },
  chipTextActive: { color: '#fff', fontWeight: 'bold' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 12, 
    paddingHorizontal: 12 
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 15, color: '#0f172a' },
  textArea: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 14, 
    color: '#0f172a',
    minHeight: 140
  },
  textAreaSmall: { 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 12, 
    padding: 14, 
    fontSize: 14, 
    color: '#0f172a',
    minHeight: 90
  },
  submitButton: { 
    backgroundColor: '#0f2b48', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 24,
    shadowColor: '#0f2b48',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  submitRow: { flexDirection: 'row', alignItems: 'center' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  costInfo: { textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 8, fontWeight: '600' }
});
