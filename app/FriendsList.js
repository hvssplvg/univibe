// app/FriendsList.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import styles from "./styles/UserProfile.styles";
import { useNavigation } from "@react-navigation/native";

const FriendsList = ({ visible, onClose }) => {
  const [friendsData, setFriendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      fetchFriends();
    }
  }, [visible]);

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      const friendIds = userSnap.exists() ? userSnap.data().friendIds || [] : [];

      const friends = [];
      for (const friendId of friendIds) {
        const friendRef = doc(db, "users", friendId);
        const friendSnap = await getDoc(friendRef);
        if (friendSnap.exists()) {
          friends.push({ uid: friendId, ...friendSnap.data() });
        }
      }

      setFriendsData(friends);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
    setLoading(false);
  };

  const handleViewProfile = (friendId) => {
    onClose();
    navigation.navigate("FriendProfile", { userId: friendId });
  };

  const renderFriend = ({ item }) => (
    <TouchableOpacity
      style={styles.friendCard}
      onPress={() => handleViewProfile(item.uid)}
    >
      <Image
        source={{ uri: item.profilePic || "https://your-default-avatar.com/default.jpg" }}
        style={styles.friendAvatar}
      />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.username || "Unnamed"}</Text>
        <Text style={styles.friendUniversity}>
          {item.university || "Unknown University"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.friendsModalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your Friends</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#1DB954" />
          ) : friendsData.length === 0 ? (
            <Text style={styles.noFriendsText}>You haven't added any friends yet.</Text>
          ) : (
            <FlatList
              data={friendsData}
              keyExtractor={(item) => item.uid}
              renderItem={renderFriend}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FriendsList;