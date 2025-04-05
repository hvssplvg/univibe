import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';
import { Audio } from 'expo-av';


// Directly adding OpenAI API Key (replace with your actual key)
const OPENAI_API_KEY = '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';  // Replace with your actual OpenAI API key

// 🔑 Voice API Keys for Each Personality
const API_KEYS = {
  'eBvoGh8YGJn1xokno71w': 'sk_3418ed275c01c492c87544993d6244eb04dc775e02c8a244', // Angela
  'dPah2VEoifKnZT37774q': 'sk_3418ed275c01c492c87544993d6244eb04dc775e02c8a244', // John
  '1hlpeD1ydbI2ow0Tt3EW': 'sk_3418ed275c01c492c87544993d6244eb04dc775e02c8a244', // Emily
  'dhwafD61uVd8h85wAZSE': 'sk_20e8a6433fcc42c82206459644f74b1319175406fd11ece7', // Denzel
  '2zRM7PkgwBPiau2jvVXc': 'sk_20e8a6433fcc42c82206459644f74b1319175406fd11ece7', // Monica
  'XUUzbXUrNRSPyhvz0zPi': 'sk_20e8a6433fcc42c82206459644f74b1319175406fd11ece7', // Bolaji
};

// 🔊 Text-to-Speech Voice Playback using ElevenLabs API
export const playVoice = async (text, voiceId) => {
  if (!text || !voiceId) {
    console.warn('Missing text or voiceId for TTS');
    return;
  }

  try {
    const key = API_KEYS[voiceId];
    if (!key) {
      console.warn('No API key found for voiceId:', voiceId);
      return;
    }

    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.6,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!res.ok) {
      throw new Error(`TTS API error: ${res.status} ${res.statusText}`);
    }

    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const uri = FileSystem.cacheDirectory + `ai_voice_${Date.now()}.mp3`;

    await FileSystem.writeAsStringAsync(uri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  } catch (err) {
    console.error('TTS failed:', err);
  }
};

// 🧠 Generate AI Reply using ChatGPT (GPT-4)
export const generateReply = async (input, contextMemory) => {
  if (!input) {
    console.warn('No input provided to generateReply');
    return 'Please provide some input.';
  }

  // Ensure contextMemory is always an array
  const safeContextMemory = Array.isArray(contextMemory) ? contextMemory : [];
  
  try {
    const prompt = `
      You are a helpful assistant. Respond to the following prompt: 
      "${input}".
      ${safeContextMemory.length > 0 ? `Context: ${safeContextMemory.join(' ')}` : ''}
    `.trim();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {  // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 150,
        temperature: 0.7,
        n: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating reply:', error);
    return 'I encountered an error while processing your request. Please try again.';
  }
};