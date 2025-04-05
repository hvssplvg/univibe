import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioPlayerComponent = ({ uri }) => {
  const [sound, setSound] = React.useState(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const playSound = async () => {
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri });
    setSound(newSound);
    await newSound.playAsync();
    setIsPlaying(true);
  };

  const stopSound = async () => {
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={isPlaying ? stopSound : playSound}>
        <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={40} color="#1DB954" />
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayerComponent;
