import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
  Linking,
} from "react-native";
import { Ionicons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { auth, db } from "../src/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import styles from "./styles/FriendProfile.styles";

const FriendProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId } = route.params;

  const [friendData, setFriendData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [friendRequested, setFriendRequested] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(500));
  const videoRef = useRef(null);

  const currentUser = auth.currentUser;

  const fetchFriendProfile = async () => {
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log("Fetched friend data:", data); // Log the fetched data
        setFriendData(data);
      } else {
        console.warn("No data found for user:", userId);
      }
    } catch (error) {
      console.error("Error fetching friend profile:", error);
    }
  };

  const fetchFriendPosts = async () => {
    try {
      const postsQuery = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );

      const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
        const postsArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          media: doc.data().media || [],
        }));
        setPosts(postsArray);
        setPostCount(postsArray.length);
        setPostsLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const checkFriendStatus = async () => {
    if (!currentUser) return;

    try {
      const friendRef = doc(db, "friendships", `${currentUser.uid}_${userId}`);
      const friendSnap = await getDoc(friendRef);
      if (friendSnap.exists()) {
        setIsFriend(true);
      } else {
        setIsFriend(false);
      }

      const friendRequestRef = doc(db, "friendRequests", `${currentUser.uid}_${userId}`);
      const friendRequestSnap = await getDoc(friendRequestRef);
      if (friendRequestSnap.exists()) {
        setFriendRequested(true);
      } else {
        setFriendRequested(false);
      }
    } catch (error) {
      console.error("Error checking friend status:", error);
    }
  };

  const handleAddFriend = async () => {
    if (!currentUser) return;

    try {
      // Create a unique document ID for the friend request
      const friendRequestId = `${currentUser.uid}_${userId}`;
      const friendRequestRef = doc(db, "friendRequests", friendRequestId);

      // Set the friend request document with the necessary fields
      await setDoc(friendRequestRef, {
        senderId: currentUser.uid,
        receiverId: userId,
        status: "pending",
        createdAt: new Date(), // Add a timestamp for when the request was created
      });

      setFriendRequested(true);
      Toast.show({
        type: "success",
        text1: "Friend Request Sent",
      });
    } catch (error) {
      console.error("Error sending friend request:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Send Friend Request",
        text2: error.message,
      });
    }
  };

  const handleRemoveFriend = async () => {
    if (!currentUser) return;

    try {
      const friendRef = doc(db, "friendships", `${currentUser.uid}_${userId}`);
      await deleteDoc(friendRef);
      setIsFriend(false);

      Toast.show({
        type: "error",
        text1: "Friend Removed",
      });
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  const handleUnrequestFriend = async () => {
    if (!currentUser) return;

    try {
      const friendRequestRef = doc(db, "friendRequests", `${currentUser.uid}_${userId}`);
      await deleteDoc(friendRequestRef);
      setFriendRequested(false);

      Toast.show({
        type: "info",
        text1: "Friend Request Cancelled",
      });
    } catch (error) {
      console.error("Error cancelling friend request:", error);
    }
  };

  const handleMessage = () => {
    // Implement the logic to navigate to the messaging screen
    navigation.navigate("MessageScreen", { userId });
  };

  const handleBlockAccount = async () => {
    // Implement the logic to block the account
    setModalVisible(false);
    Toast.show({
      type: "info",
      text1: "Account Blocked",
    });
  };

  const handleReportAccount = async () => {
    // Implement the logic to report the account
    setModalVisible(false);
    Toast.show({
      type: "info",
      text1: "Account Reported",
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchFriendProfile();
      fetchFriendPosts();
      checkFriendStatus();

      if (videoRef.current) {
        videoRef.current.playAsync();
      }

      return () => {
        if (videoRef.current) {
          videoRef.current.stopAsync();
        }
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[friendData?.profileColor || "#1DB954", "#121212"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.profileHeader}
      >
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuIcon} onPress={() => setModalVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity>
          {friendData?.profilePic && (friendData.profilePic.endsWith(".mp4") || friendData.profilePic.endsWith(".mov")) ? (
            <Video
              ref={videoRef}
              source={{ uri: friendData.profilePic }}
              style={styles.profileImage}
              isLooping
              shouldPlay
              resizeMode="cover"
              useNativeControls={true}
            />
          ) : (
            <Image source={{ uri: friendData?.profilePic || "https://via.placeholder.com/100" }} style={styles.profileImage} />
          )}
        </TouchableOpacity>

        <Text style={styles.username}>{friendData?.username || "User"}</Text>
        <Text style={styles.university}>{friendData?.university || "Unknown University"}</Text>
        <Text style={styles.course}>Course: {friendData?.course || "Not Specified"}</Text>
        <Text style={styles.bio}>{friendData?.bio || "No bio available."}</Text>
      </LinearGradient>

      {/* 🔥 Action Buttons */}
      <View style={styles.actionButtons}>
        {isFriend ? (
          <TouchableOpacity style={styles.removeFriendButton} onPress={handleRemoveFriend}>
            <Ionicons name="person-remove" size={20} color="#fff" />
            <Text style={styles.buttonText}>Remove Friend</Text>
          </TouchableOpacity>
        ) : friendRequested ? (
          <TouchableOpacity style={styles.requestedButton} onPress={handleUnrequestFriend}>
            <Ionicons name="hourglass-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Requested</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addFriendButton} onPress={handleAddFriend}>
            <Ionicons name="person-add" size={20} color="#fff" />
            <Text style={styles.buttonText}>Add Friend</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
          <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="document-outline" size={24} color="#1DB954" />
          <Text style={styles.statNumber}>{postCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={24} color="#1DB954" />
          <Text style={styles.statNumber}>{friendData?.friends || 0}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={24} color="#1DB954" />
          <Text style={styles.statNumber}>{friendData?.points || 0}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.postsContainer}>
        {postsLoading ? (
          <ActivityIndicator size="large" color="#1DB954" />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <Image source={{ uri: item.media[0] }} style={styles.postThumbnail} />
            )}
          />
        )}
      </View>

      {/* 🔥 Modal for Block and Report */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalOption} onPress={handleBlockAccount}>
              <Text style={styles.modalOptionText}>Block Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleReportAccount}>
              <Text style={styles.modalOptionText}>Report Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalOption, styles.modalOptionLast]} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
};

export default FriendProfile;
