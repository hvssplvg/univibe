import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useCameraDevices } from 'react-native-vision-camera';
import { Ionicons } from '@expo/vector-icons';

const LivePartyScreen = ({ route, navigation }) => {
  const { isHost } = route.params;
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Implement actual mute logic
  };

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };

  const endParty = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          video={isCameraOn}
          audio={!isMuted}
        />
      )}

      {/* Controls Overlay */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
          <Ionicons 
            name={isMuted ? "mic-off" : "mic"} 
            size={30} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleCamera}>
          <Ionicons 
            name={isCameraOn ? "camera" : "camera-off"} 
            size={30} 
            color="white" 
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endButton]} 
          onPress={endParty}
        >
          <Ionicons name="call" size={30} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  endButton: {
    backgroundColor: 'rgba(255,0,0,0.5)'
  }
});

export default LivePartyScreen;