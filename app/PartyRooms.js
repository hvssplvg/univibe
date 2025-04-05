import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Modal, TextInput, Switch, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Camera } from "expo-camera";  // Import Camera from Expo Camera
import { auth, db } from "../src/firebaseConfig";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import styles from "./styles/PartyRooms.styles"; // Your existing styles

const PartyRooms = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [friends, setFriends] = useState([]);
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [isPartyActive, setIsPartyActive] = useState(false);  // Track if party is active
  const [loading, setLoading] = useState(true);
  
  // Camera state
  const [hasPermission, setHasPermission] = useState(null); // Camera permissions state
  const [camera, setCamera] = useState(null);  // Camera reference
  
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser({
              username: userDoc.data().username,
              profilePicture: userDoc.data().profilePicture || "https://via.placeholder.com/150",
              uid: currentUser.uid,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const fetchFriends = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoadingFriends(true);
    try {
      const friendshipsQuery = query(
        collection(db, "Friendships"),
        where("status", "==", "accepted"),
        where("users", "array-contains", currentUser.uid)
      );

      const friendshipsSnapshot = await getDocs(friendshipsQuery);
      const friendsList = [];

      for (const friendshipDoc of friendshipsSnapshot.docs) {
        const friendshipData = friendshipDoc.data();
        const friendId = friendshipData.users.find(id => id !== currentUser.uid);
        
        if (friendId) {
          const friendDoc = await getDoc(doc(db, "users", friendId));
          if (friendDoc.exists()) {
            friendsList.push({
              id: friendId,
              username: friendDoc.data().username,
              profilePicture: friendDoc.data().profilePicture || "https://via.placeholder.com/150",
            });
          }
        }
      }

      setFriends(friendsList);
    } catch (error) {
      console.error("Error fetching friends:", error);
      alert("Failed to load friends list");
    } finally {
      setLoadingFriends(false);
    }
  };

  const handleJoinRoom = (roomId, isPrivate) => {
    if (isPrivate) {
      alert("This room is private, your request has been sent!");
    } else {
      navigation.navigate("RoomView", { roomId });
    }
  };

  const handleInviteFriend = (friendId) => {
    setInvitedFriends(prev => {
      if (prev.includes(friendId)) {
        return prev.filter(id => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const handleCreateRoom = () => {
    if (roomName.trim() === "") {
      alert("Please enter a room name.");
      return;
    }

    const newRoom = {
      id: Math.random().toString(),
      name: roomName,
      participants: 1,
      isActive: true,
      isPrivate,
      invitedFriends: isPrivate ? invitedFriends : [],
      createdBy: user.uid,
    };

    setRooms((prev) => [...prev, newRoom]);
    setRoomName("");
    setIsPrivate(false);
    setInvitedFriends([]);
    setModalVisible(false);

    // Mark party as active and show camera
    setIsPartyActive(true);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const renderFriendItem = ({ item }) => (
    <View style={styles.friendItem}>
      <Image
        source={{ uri: item.profilePicture }}
        style={styles.friendImage}
      />
      <Text style={styles.friendName}>{item.username}</Text>
      <TouchableOpacity
        style={[
          styles.inviteButton,
          invitedFriends.includes(item.id) && styles.invitedButton
        ]}
        onPress={() => handleInviteFriend(item.id)}
      >
        <Text style={styles.inviteButtonText}>
          {invitedFriends.includes(item.id) ? "Invited" : "Invite"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderRoom = ({ item }) => (
    <View style={styles.roomCard}>
      <View style={styles.roomInfo}>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomParticipants}>{item.participants} Participants</Text>
      </View>

      <View style={styles.statusContainer}>
        <Ionicons
          name={item.isPrivate ? "lock-closed-outline" : "earth"}
          size={20}
          color="#fff"
        />
        <Text style={styles.statusLabel}>
          {item.isPrivate ? "Private" : "Public"}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.joinButton,
          item.isActive ? styles.activeButton : styles.inactiveButton,
        ]}
        onPress={() => handleJoinRoom(item.id, item.isPrivate)}
        disabled={!item.isActive}
      >
        <Text style={styles.joinButtonText}>
          {item.isPrivate ? "Request to Join" : "Join Room"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Camera Section */}
      {isPartyActive ? (
        <View style={styles.cameraView}>
          {hasPermission ? (
            <Camera style={styles.camera} ref={setCamera} type={Camera.Constants.Type.front}>
              <Text style={styles.cameraText}>Welcome, {user.username}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("RoomView")}
              >
                <Ionicons name="videocam-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>Start Room</Text>
              </TouchableOpacity>
            </Camera>
          ) : (
            <Text style={styles.cameraText}>Camera permission is required to start the party</Text>
          )}
        </View>
      ) : (
        // Show regular room start section
        <View style={styles.cameraView}>
          <Text style={styles.cameraText}>
            {user ? `Welcome, ${user.username}` : "Your Camera"}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setModalVisible(true);
              fetchFriends();
            }}
          >
            <Ionicons name="videocam-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Start Room</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Room List */}
      <View style={styles.partyRooms}>
        <Text style={styles.sectionTitle}>Available Party Rooms</Text>
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={renderRoom}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No rooms available yet.</Text>
          }
        />
      </View>

      {/* Create Room Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a Party Room</Text>

            <TextInput
              placeholder="Enter room name"
              placeholderTextColor="#aaa"
              value={roomName}
              onChangeText={setRoomName}
              style={styles.input}
            />

            <View style={styles.switchRow}>
              <Text style={styles.modalText}>Private Room</Text>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                thumbColor="#1DB954"
              />
            </View>

            {isPrivate && (
              <View style={styles.friendsSection}>
                <Text style={styles.friendsTitle}>Invite Friends</Text>
                {loadingFriends ? (
                  <ActivityIndicator size="large" color="#1DB954" />
                ) : (
                  <FlatList
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={renderFriendItem}
                    ListEmptyComponent={
                      <Text style={styles.emptyFriendsText}>No friends found</Text>
                    }
                    contentContainerStyle={{ flexGrow: 1 }}
                  />
                )}
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateRoom}
              >
                <Text style={styles.createButtonText}>Create Party</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PartyRooms;