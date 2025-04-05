import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styles from '../../styles/MyAiChat.styles';  // Assuming you have styles for this component

// Use this AI Header for dynamic UI depending on the personalities of the AI
const AiHeader = ({ name, personalities }) => {
  console.log(personalities); // Check if the personalities array is correct
  
  const defaultMessage = 'UniVibe AI'; // Default message when no personalities
  const greetingText = personalities && personalities.length > 0 
    ? `${name} is online!` 
    : `${name || 'AI'} is ready to assist!`;

  const taglineText = personalities && personalities.length > 0 
    ? personalities.map(p => `${p}`).join(', ') 
    : defaultMessage;

  return (
    <View style={styles.header}>
      {/* Greeting Text */}
      <Text style={styles.greeting}>{greetingText}</Text>
      
      {/* Tagline with Personality */}
      <Text style={styles.tagline}>
        {taglineText}
      </Text>
    </View>
  );
};

export default AiHeader;