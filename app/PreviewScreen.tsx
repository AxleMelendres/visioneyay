import React from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PreviewScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
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

        <TouchableOpacity
          style={[styles.button, styles.analyzeButton]}
          onPress={() => router.push({ pathname: '/ResultScreen', params: { photoUri } })}
        >
          <Text style={styles.analyzeText}>Analyze</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 32,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: '#4b5563', // neutral grey
  },
  retakeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  analyzeButton: {
    backgroundColor: '#2563eb', // accent blue
  },
  analyzeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});