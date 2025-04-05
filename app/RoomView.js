import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera"; // Importing Camera for the video feed
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const RoomView = ({ route, navigation }) => {
  const { roomId } = route.params || {}; // Add fallback to prevent crashes

  if (!roomId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorMessage}>Room ID not available. Please try again.</Text>
      </View>
    );
  }

  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [roomData, setRoomData] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const getRoomData = async () => {
      try {
        const roomDoc = await getDoc(doc(db, "rooms", roomId));
        if (roomDoc.exists()) {
          setRoomData(roomDoc.data());
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };

    getRoomData();

    const getCameraPermission = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermission();
  }, [roomId]);

  const handleStartVideo = () => {
    if (cameraRef.current) {
      setIsCameraReady(true);
    }
  };

  if (hasPermission === null) {
    return <ActivityIndicator size="large" color="#1DB954" />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Room Header */}
      <View style={styles.roomHeader}>
        <Text style={styles.roomName}>{roomData?.name || "Loading..."}</Text>
        <Text style={styles.roomStatus}>
          {roomData?.isPrivate ? "Private Room" : "Public Room"}
        </Text>
      </View>

      {/* Camera View */}
      <View style={styles.cameraSection}>
        {isCameraReady ? (
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.front}
            ref={cameraRef}
          >
            <View style={styles.cameraOverlay}>
              <Text style={styles.cameraText}>You are now live!</Text>
            </View>
          </Camera>
        ) : (
          <TouchableOpacity
            style={styles.startVideoButton}
            onPress={handleStartVideo}
          >
            <Ionicons name="videocam-outline" size={40} color="#fff" />
            <Text style={styles.startVideoText}>Start Video</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Participants or other content */}
      <View style={styles.participantsSection}>
        <Text style={styles.sectionTitle}>Participants</Text>
        <Text style={styles.participantText}>User 1, User 2, User 3...</Text>
        <Text style={styles.participantText}>Add participants here</Text>
      </View>

      {/* Join Button */}
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => console.log("Join Room Pressed")}
      >
        <Text style={styles.joinButtonText}>Join Room</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
  },
  roomHeader: {
    padding: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginBottom: 20,
  },
  roomName: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
  roomStatus: {
    fontSize: 16,
    color: "#aaa",
  },
  cameraSection: {
    height: 250,
    marginBottom: 20,
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  cameraText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  startVideoButton: {
    backgroundColor: "#1DB954",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  startVideoText: {
    color: "#fff",
    fontSize: 18,
  },
  participantsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 10,
  },
  participantText: {
    fontSize: 16,
    color: "#ccc",
  },
  joinButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default RoomView;