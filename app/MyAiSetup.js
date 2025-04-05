import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../src/firebaseConfig';
import { collection, setDoc, doc } from 'firebase/firestore';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import styles from './styles/MyAi.styles'; // External styles

const personalities = [
  { label: 'Study Buddy', emoji: '📚' },
  { label: 'Chill Friend', emoji: '😎' },
  { label: 'Hype Bot', emoji: '🔥' },
  { label: 'Nerd Mode', emoji: '🧠' },
  { label: 'Zen Master', emoji: '🧘' },
  { label: 'Party Mode', emoji: '🎉' },
  { label: 'Motivator', emoji: '💪' },
  { label: 'Comedian', emoji: '🤣' },
];

// Replace with your actual keys
const API_KEY_1 = 'sk_3418ed275c01c492c87544993d6244eb04dc775e02c8a244';
const API_KEY_2 = 'sk_20e8a6433fcc42c82206459644f74b1319175406fd11ece7';

const voices = [
  { label: 'Angela', id: 'eBvoGh8YGJn1xokno71w', emoji: '🗣️', key: API_KEY_1 },
  { label: 'John', id: 'dPah2VEoifKnZT37774q', emoji: '🎙️', key: API_KEY_1 },
  { label: 'Emily', id: '1hlpeD1ydbI2ow0Tt3EW', emoji: '💬', key: API_KEY_1 },
  { label: 'Denzel', id: 'dhwafD61uVd8h85wAZSE', emoji: '🧔🏾', key: API_KEY_2 },
  { label: 'Monica', id: '2zRM7PkgwBPiau2jvVXc', emoji: '👩🏽', key: API_KEY_2 },
  { label: 'Bolaji', id: 'XUUzbXUrNRSPyhvz0zPi', emoji: '', key: API_KEY_2 },
];

const AiSetup = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [aiName, setAiName] = useState('');
  const [selectedPersonalities, setSelectedPersonalities] = useState([]);
  const [aiVoice, setAiVoice] = useState(null);
  const [loading, setLoading] = useState(false);

  const togglePersonality = (label) => {
    setSelectedPersonalities((prev) =>
      prev.includes(label)
        ? prev.filter((p) => p !== label)
        : [...prev, label]
    );
  };

  const previewRealVoice = async (voiceObj) => {
    try {
      const { id, label, key } = voiceObj;
      setAiVoice(id);

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${id}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': key,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: `Hi, I'm ${label}, and I’ll be your voice on UniVibe!`,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.6,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        Alert.alert('Voice Error', 'Failed to generate voice preview.');
        return;
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const fileUri = FileSystem.cacheDirectory + `${id}.mp3`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
      await sound.playAsync();
    } catch (error) {
      console.error('Voice preview failed:', error);
      Alert.alert('Error', 'Something went wrong playing the voice.');
    }
  };

  const saveToFirebase = async () => {
    try {
      setLoading(true);
      const uid = auth.currentUser.uid;
  
      const userDoc = doc(collection(db, 'users'), uid); // 👈 correct modular usage
  
      await setDoc(userDoc, {
        ai: {
          name: aiName,
          personalities: selectedPersonalities,
          voice: aiVoice,
          createdAt: new Date().toISOString(),
        },
      }, { merge: true });
  
      setTimeout(() => {
        setLoading(false);
        navigation.replace('MyAiChat'); // or your next screen
      }, 2000);
    } catch (err) {
      console.error('Error saving AI to Firebase:', err);
      Alert.alert('Error', 'Could not save your AI. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Building your perfect AI...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>👋 Welcome to UniVibe AI</Text>
          <Text style={styles.subtitle}>Let’s get you set up with your own assistant.</Text>
          <TouchableOpacity style={styles.button} onPress={() => setStep(2)}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>🤖 Name your AI</Text>
          <TextInput
            value={aiName}
            onChangeText={setAiName}
            placeholder="e.g. Nova"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.button, !aiName.trim() && styles.disabledButton]}
            onPress={() => setStep(3)}
            disabled={!aiName.trim()}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>🎭 Choose your AI’s vibe(s)</Text>
          <Text style={styles.subtitle}>Pick as many as you like.</Text>

          {personalities.map((p) => (
            <TouchableOpacity
              key={p.label}
              style={[
                styles.personalityOption,
                selectedPersonalities.includes(p.label) && styles.selectedOption,
              ]}
              onPress={() => togglePersonality(p.label)}
            >
              <Text style={styles.personalityText}>{p.emoji} {p.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, selectedPersonalities.length === 0 && styles.disabledButton]}
            onPress={() => setStep(4)}
            disabled={selectedPersonalities.length === 0}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </>
      )}

      {step === 4 && (
        <>
          <Text style={styles.title}>🎧 Choose a Voice</Text>
          <Text style={styles.subtitle}>Tap to preview. One voice, one vibe.</Text>

          {voices.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[
                styles.personalityOption,
                aiVoice === v.id && styles.selectedOption,
              ]}
              onPress={() => previewRealVoice(v)}
            >
              <Text style={styles.personalityText}>{v.emoji} {v.label}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.button, !aiVoice && styles.disabledButton]}
            onPress={saveToFirebase}
            disabled={!aiVoice}
          >
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default AiSetup;