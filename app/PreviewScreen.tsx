import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import type { PromptKey } from '@/constants/prompts';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const router = useRouter();

  const handleAnalyze = (promptKey: PromptKey) => {
    router.push({
      pathname: '/ResultScreen',
      params: { photoUri, promptKey },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.retakeButton]}
          onPress={() => router.back()}
        >
          <Text style={styles.retakeText}>Retake</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.analysisButtonsContainer}>
        <Text style={styles.analysisTitle}>Choose Analysis Type:</Text>

        <TouchableOpacity
          style={[styles.analysisButton, styles.academicButton]}
          onPress={() => handleAnalyze('academic')}
        >
          <Text style={styles.analysisButtonText}>🎓 Academic Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analysisButton, styles.safetyButton]}
          onPress={() => handleAnalyze('safety')}
        >
          <Text style={styles.analysisButtonText}>⚠️ Safety Analysis</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.analysisButton, styles.inventoryButton]}
          onPress={() => handleAnalyze('inventory')}
        >
          <Text style={styles.analysisButtonText}>📦 Inventory Analysis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flexGrow: 1,
  },
  image: {
    height: 300,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    gap: 12,
    backgroundColor: '#000',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: '#4b5563',
  },
  retakeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  analysisButtonsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  analysisTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  analysisButton: {
    paddingVertical: 16,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  academicButton: {
    backgroundColor: '#7C3AED',
  },
  safetyButton: {
    backgroundColor: '#DC2626',
  },
  inventoryButton: {
    backgroundColor: '#2563EB',
  },
});