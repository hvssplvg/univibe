import React, { useEffect, useState } from 'react';
import {
  View, TextInput, TouchableOpacity, FlatList, Text,
  Animated, Platform, ActivityIndicator, Modal, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { auth, db } from '../src/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import styles from './styles/MyAiChat.styles';
import AiHeader from './components/Ai/AiHeader';
import AiTyping from './components/Ai/AiTyping';
import AiMessageBubble from './components/Ai/AiMessageBubble';
import { generateReply, playVoice } from './components/Ai/AiLogic';

const MyAiChat = () => {
  const [loading, setLoading] = useState(true);
  const [aiConfig, setAiConfig] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Use an Animated Value to handle the smooth transition of the input field
  const inputContainerY = useState(new Animated.Value(0))[0];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);

        // Animate the input container to move up when the keyboard appears
        Animated.timing(inputContainerY, {
          toValue: -e.endCoordinates.height, // Move the input container up by the height of the keyboard
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);

        // Animate the input container back down when the keyboard disappears
        Animated.timing(inputContainerY, {
          toValue: 0, // Move the input container back to its original position
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const [userSnap, conversationSnap] = await Promise.all([
          getDoc(doc(db, 'users', uid)),
          getDoc(doc(db, 'conversations', uid))
        ]);

        if (userSnap.exists()) {
          setAiConfig(userSnap.data().ai || {});
        }

        if (!conversationSnap.exists()) {
          await setDoc(doc(db, 'conversations', uid), {
            messages: [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          setMessages([]);
        } else {
          setMessages(conversationSnap.data().messages || []);
        }

        if (messages.length === 0 && aiConfig?.name && aiConfig?.voice) {
          playVoice(`Hi, I'm ${aiConfig.name}. What can I do for you?`, aiConfig.voice);
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, []);

  const storeMessage = async (message) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      const conversationRef = doc(db, 'conversations', uid);
      await updateDoc(conversationRef, {
        messages: arrayUnion(message),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error storing message:', error);
      if (error.code === 'not-found') {
        try {
          await setDoc(doc(db, 'conversations', uid), {
            messages: [message],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        } catch (createError) {
          console.error('Error creating conversation:', createError);
        }
      }
    }
  };

  const createMessage = (content, type = 'text') => {
    const baseMessage = {
      sender: 'user',
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    switch (type) {
      case 'image':
        return {
          ...baseMessage,
          text: '[Image]',
          image: content.uri
        };
      case 'file':
        return {
          ...baseMessage,
          text: `[File: ${content.name}]`,
          file: content.uri,
          fileName: content.name,
          fileSize: content.size,
          mimeType: content.mimeType
        };
      default:
        return {
          ...baseMessage,
          text: content
        };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !aiConfig) return;

    const userMsg = createMessage(input);
    setMessages(prev => [...prev, userMsg]);
    await storeMessage(userMsg);
    setInput('');
    setIsTyping(true);

    try {
      const aiText = await generateReply(input, messages);
      const aiMsg = createMessage(aiText);
      aiMsg.sender = 'ai';
      
      setMessages(prev => [...prev, aiMsg]);
      await storeMessage(aiMsg);
      
      if (aiConfig.voice) {
        playVoice(aiText, aiConfig.voice);
      }
    } catch (error) {
      console.error('AI response error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMediaPick = async (pickerFunction, type) => {
    if (!aiConfig) return;
    
    try {
      const result = await pickerFunction();
      setModalVisible(false);

      if (result && !result.canceled) {
        const asset = result.assets?.[0] || result;
        const userMsg = createMessage(asset, type);
        
        setMessages(prev => [...prev, userMsg]);
        await storeMessage(userMsg);
        setIsTyping(true);

        const aiText = await generateReply(`[${type}]`, messages);
        const aiMsg = createMessage(aiText);
        aiMsg.sender = 'ai';
        
        setMessages(prev => [...prev, aiMsg]);
        await storeMessage(aiMsg);
        
        if (aiConfig.voice) {
          playVoice(aiText, aiConfig.voice);
        }
      }
    } catch (error) {
      console.error(`Error with ${type}:`, error);
    } finally {
      setIsTyping(false);
    }
  };

  const personality = aiConfig?.personalities?.[0] || 'Study Buddy';
  const avatar = {
    Study: '📘', Chill: '😎', Hype: '🔥', Nerd: '🧠',
    Zen: '🧘', Party: '🎉', Motivator: '💪', Comedian: '🤣'
  }[personality] || '🤖';

  if (loading || !aiConfig) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AiHeader name={aiConfig.name || 'AI Assistant'} personalities={aiConfig.personalities || []} />
      
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AiMessageBubble 
            item={item} 
            avatar={avatar} 
            voiceId={aiConfig?.voice} 
          />
        )}
        contentContainerStyle={[styles.chat, { paddingBottom: keyboardHeight + 70 }]}
        inverted={false}
        onEndReachedThreshold={0.1}
        keyboardDismissMode="interactive"
      />
      
      {isTyping && <AiTyping name={aiConfig.name || 'AI'} />}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity 
              onPress={() => handleMediaPick(
                () => ImagePicker.launchImageLibraryAsync({ 
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  quality: 0.8
                }),
                'image'
              )} 
              style={styles.modalBtn}
            >
              <Ionicons name="image-outline" size={24} style={styles.modalIcon} />
              <Text style={styles.modalText}>Choose Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => handleMediaPick(
                () => DocumentPicker.getDocumentAsync({
                  type: '*/*',
                  copyToCacheDirectory: true
                }),
                'file'
              )} 
              style={styles.modalBtn}
            >
              <Ionicons name="document-outline" size={24} style={styles.modalIcon} />
              <Text style={styles.modalText}>Upload File</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={[styles.modalBtn, styles.modalCancel]}
            >
              <Ionicons name="close-outline" size={24} style={styles.modalIcon} />
              <Text style={styles.modalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Animated.View
        style={[styles.inputContainer, { bottom: keyboardHeight }]}
      >
        <TouchableOpacity 
          onPress={() => setModalVisible(true)} 
          style={styles.plusBtn}
          disabled={isTyping}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Ask me anything..."
          placeholderTextColor="#aaa"
          editable={!isTyping}
          onSubmitEditing={handleSend}
        />
        
        <TouchableOpacity 
          onPress={handleSend} 
          style={styles.sendBtn}
          disabled={!input.trim() || isTyping}
        >
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default MyAiChat;