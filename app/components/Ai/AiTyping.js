import React, { useRef, useEffect } from 'react';
import { View, Animated, Text } from 'react-native';
import styles from '../../styles/MyAiChat.styles';

const AiTyping = ({ name }) => {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    dots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, { toValue: -5, duration: 300, delay: i * 100, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.typingBubble}>
      <Text style={styles.typingLabel}>{name} is thinking</Text>
      <View style={styles.dotContainer}>
        {dots.map((dot, i) => (
          <Animated.Text key={i} style={[styles.dot, { transform: [{ translateY: dot }] }]}>•</Animated.Text>
        ))}
      </View>
    </View>
  );
};

export default AiTyping;