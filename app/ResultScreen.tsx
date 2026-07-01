import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { analyzeImage, imageToBase64 } from '../lib/gemini';
import { PROMPTS, type PromptKey } from '@/constants/prompts';

interface AnalysisResult {
  [key: string]: any;
}

export default function ResultScreen(): React.ReactElement {
  const { photoUri, promptKey } = useLocalSearchParams<{ photoUri: string; promptKey: PromptKey }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('ResultScreen - photoUri:', photoUri, 'promptKey:', promptKey);

        if (!photoUri) {
          throw new Error('No image URI provided');
        }

        if (!promptKey || !PROMPTS[promptKey]) {
          throw new Error('Invalid analysis type selected');
        }

        // Convert image file to base64
        console.log('Converting image to base64...');
        const base64Image = await imageToBase64(photoUri);
        console.log('Base64 conversion complete, length:', base64Image.length);

        // Get the prompt for this analysis type
        const prompt = PROMPTS[promptKey];

        console.log('Sending to Gemini API...');
        const result = await analyzeImage(base64Image, prompt);
        console.log('Gemini API response:', result);

        // Parse the response
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          const responseText = result.candidates[0].content.parts[0].text;
          
          // Try to parse as JSON
          let parsedAnalysis: AnalysisResult;
          try {
            parsedAnalysis = JSON.parse(responseText);
          } catch {
            // If JSON parsing fails, create a basic analysis from the text
            parsedAnalysis = {
              rawResponse: responseText,
            };
          }

          setAnalysis(parsedAnalysis);
        } else {
          throw new Error('Unexpected response format from Gemini API');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        console.error('Analysis error:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [photoUri, promptKey]);

  // Loading state
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Analyzing image...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Analysis Failed</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Text style={styles.errorHint}>Please try taking another photo or check your connection.</Text>
      </View>
    );
  }

  // Analysis result state
  if (!analysis) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorMessage}>No analysis available</Text>
      </View>
    );
  }

  const getAnalysisTypeTitle = () => {
    switch (promptKey) {
      case 'academic':
        return '🎓 Academic Analysis';
      case 'safety':
        return '⚠️ Safety Analysis';
      case 'inventory':
        return '📦 Inventory Analysis';
      default:
        return 'Analysis Results';
    }
  };

  const renderAnalysisContent = () => {
    if (!analysis) return null;

    switch (promptKey) {
      case 'academic':
        return (
          <>
            {analysis.objects && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Objects</Text>
                {Array.isArray(analysis.objects) ? (
                  analysis.objects.map((obj, index) => (
                    <Text key={index} style={styles.bulletPoint}>• {obj}</Text>
                  ))
                ) : (
                  <Text style={styles.sectionText}>{analysis.objects}</Text>
                )}
              </View>
            )}
            {analysis.educationalContext && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Educational Context</Text>
                <Text style={styles.sectionText}>{analysis.educationalContext}</Text>
              </View>
            )}
            {analysis.feedback && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Feedback</Text>
                <Text style={styles.sectionText}>{analysis.feedback}</Text>
              </View>
            )}
          </>
        );

      case 'safety':
        return (
          <>
            {analysis.hazards && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hazards</Text>
                <Text style={styles.sectionText}>{analysis.hazards}</Text>
              </View>
            )}
            {analysis.riskLevel && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Risk Level</Text>
                <Text style={[styles.sectionText, getRiskLevelColor(analysis.riskLevel)]}>
                  {analysis.riskLevel.toUpperCase()}
                </Text>
              </View>
            )}
          </>
        );

      case 'inventory':
        return (
          <>
            {analysis.assets && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Assets</Text>
                {Array.isArray(analysis.assets) ? (
                  analysis.assets.map((asset, index) => (
                    <Text key={index} style={styles.bulletPoint}>• {asset}</Text>
                  ))
                ) : (
                  <Text style={styles.sectionText}>{analysis.assets}</Text>
                )}
              </View>
            )}
            {analysis.notes && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.sectionText}>{analysis.notes}</Text>
              </View>
            )}
          </>
        );

      default:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionText}>{JSON.stringify(analysis, null, 2)}</Text>
          </View>
        );
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return styles.riskHigh;
      case 'medium':
        return styles.riskMedium;
      case 'low':
        return styles.riskLow;
      default:
        return {};
    }
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  errorHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 6,
    marginLeft: 8,
  },
  headerSection: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  riskHigh: {
    color: '#DC2626',
    fontWeight: '700',
  },
  riskMedium: {
    color: '#F59E0B',
    fontWeight: '700',
  },
  riskLow: {
    color: '#10B981',
    fontWeight: '700',
  },
});
