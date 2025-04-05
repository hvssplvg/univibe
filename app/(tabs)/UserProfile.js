import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Linking,
  Alert,
  ImageBackground,
  getDoc,
} from "react-native";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from 'expo-av';
import { auth, db } from "../../src/firebaseConfig";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import styles from "../styles/UserProfile.styles";
import { uploadToCloudinary } from "../../src/Cloudinary"; // Updated import
import FriendsList from "../FriendsList";
import UserPost from "../components/UserPost";

const UserProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [friendsModalVisible, setFriendsModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const videoRef = useRef(null);

  /** 🔧 Helper to extract Cloudinary public_id */
  const extractPublicId = (url) => {
    if (!url) return null;
    const match = url.match(/\/v\d+\/([^\.]+)/);
    return match ? match[1] : null;
  };

  /** 🗑️ Delete Post */
  const deletePost = async () => {
    try {
      if (!selectedPost || !selectedPost.id) return;

      const user = auth.currentUser;
      if (!user) return;

      await deleteDoc(doc(db, "posts", selectedPost.id));

      if (selectedPost.media && selectedPost.media.length > 0) {
        const publicId = extractPublicId(selectedPost.media[0]);
        if (publicId) {
          await Cloudinary.deleteImage(publicId); // Using your Cloudinary config
          console.log("✅ Cloudinary asset deleted");
        }
      }

      setPostModalVisible(false);
      setSelectedPost(null);
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      Alert.alert("Error", "Failed to delete post.");
    }
  };

  const closePostModal = () => {
    setSelectedPost(null);
    setPostModalVisible(false);
  };

  const fetchUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userRef, (userSnap) => {
          if (userSnap.exists()) {
            setUserData(userSnap.data());
            setBackgroundImage(userSnap.data().backgroundImage || null);
          }
        });
        setLoading(false);
        return unsubscribe;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", user.uid),
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
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const unsubscribeProfile = fetchUserProfile();
      const unsubscribePosts = fetchUserPosts();

      if (videoRef.current) videoRef.current.playAsync();

      return () => {
        if (videoRef.current) videoRef.current.pauseAsync();
        if (typeof unsubscribeProfile === "function") unsubscribeProfile();
        if (typeof unsubscribePosts === "function") unsubscribePosts();
      };
    }, [])
  );

  const handleSetBackgroundImage = async () => {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to set a background image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setLoading(true);

        // Updated Cloudinary upload
        const uploadResponseUrl = await uploadToCloudinary(uri);

        if (uploadResponseUrl) {
          // Update in Firestore
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "users", user.uid); // ✅ Declare userRef here
            await updateDoc(userRef, {
              backgroundImage: uploadResponseUrl,
            });

            const updatedSnap = await getDoc(userRef);
            if (updatedSnap.exists()) {
              const updatedData = updatedSnap.data();
              setUserData(updatedData);
              setBackgroundImage(updatedData.backgroundImage || null);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error setting background:", error);
      Alert.alert("Error", "Failed to set background image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onLongPress={handleSetBackgroundImage}
        delayLongPress={800}
        activeOpacity={1}
      >
        <ImageBackground
          source={backgroundImage ? { uri: backgroundImage } : require('../../assets/default-background.jpg')}
          style={styles.profileHeader}
          blurRadius={backgroundImage ? 10 : 0}
          imageStyle={{ resizeMode: "cover" }}
        >
          <LinearGradient colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)"]} style={styles.profileHeader}>
            <TouchableOpacity style={styles.settingsIcon} onPress={() => navigation.navigate("Settings")}>
              <Ionicons name="settings-outline" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
              {userData?.profilePic?.endsWith(".mp4") || userData?.profilePic?.endsWith(".mov") ? (
                <Video
                  ref={videoRef}
                  source={{ uri: userData.profilePic }}
                  style={styles.profileImage}
                  isLooping
                  shouldPlay
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{ uri: userData?.profilePic || "https://your-default-avatar.com/default.jpg" }}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>

            <Text style={styles.username}>{userData?.username}</Text>
            <Text style={styles.university}>{userData?.university}</Text>
            <Text style={styles.course}>Course: {userData?.course}</Text>
            <Text style={styles.bio}>{userData?.bio}</Text>

            <View style={styles.socialLinks}>
              {userData?.instagram && (
                <TouchableOpacity onPress={() => Linking.openURL(userData.instagram)}>
                  <FontAwesome name="instagram" size={24} color="#fff" style={styles.socialIcon} />
                </TouchableOpacity>
              )}
              {userData?.tiktok && (
                <TouchableOpacity onPress={() => Linking.openURL(userData.tiktok)}>
                  <FontAwesome5 name="tiktok" size={24} color="#fff" style={styles.socialIcon} />
                </TouchableOpacity>
              )}
              {userData?.linkedin && (
                <TouchableOpacity onPress={() => Linking.openURL(userData.linkedin)}>
                  <FontAwesome name="linkedin" size={24} color="#fff" style={styles.socialIcon} />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="document-outline" size={22} color={userData?.profileColor || "#1DB954"} />
          <Text style={styles.statNumber}>{postCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>

        <TouchableOpacity style={styles.statCard} onPress={() => setFriendsModalVisible(true)}>
          <Ionicons name="people-outline" size={22} color={userData?.profileColor || "#1DB954"} />
          <Text style={styles.statNumber}>{userData?.friends || 0}</Text>
          <Text style={styles.statLabel}>Friends</Text>
        </TouchableOpacity>

        <View style={styles.statCard}>
          <Ionicons name="trophy-outline" size={22} color={userData?.profileColor || "#1DB954"} />
          <Text style={styles.statNumber}>{userData?.points || 0}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
      </View>

      <View style={styles.postsContainer}>
        {postsLoading ? (
          <ActivityIndicator size="large" color="#1DB954" />
        ) : posts.length === 0 ? (
          <Text style={styles.noPostsText}>No posts yet.</Text>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedPost(item);
                  setPostModalVisible(true);
                }}
              >
                {item.media?.length > 0 ? (
                  <Image source={{ uri: item.media[0] }} style={styles.postThumbnail} />
                ) : (
                  <View style={[styles.postThumbnail, { backgroundColor: "#ddd" }]} />
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <FriendsList visible={friendsModalVisible} onClose={() => setFriendsModalVisible(false)} />

      <Modal transparent visible={postModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closePostModal} style={styles.closeModalButton}>
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
            {selectedPost?.media?.length > 0 ? (
              <>
                {selectedPost.media[0].endsWith(".mp4") || selectedPost.media[0].endsWith(".mov") ? (
                  <Video
                    ref={videoRef}
                    source={{ uri: selectedPost.media[0] }}
                    style={styles.fullScreenPost}
                    useNativeControls
                    resizeMode="contain"
                    isLooping
                  />
                ) : (
                  <Image source={{ uri: selectedPost.media[0] }} style={styles.fullScreenPost} />
                )}
                <UserPost
                  post={selectedPost}
                  onDelete={deletePost}
                  onEdit={closePostModal}
                  onClose={closePostModal}
                />
              </>
            ) : (
              <Text style={{ color: "white" }}>No post selected or post has no media</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UserProfile;
