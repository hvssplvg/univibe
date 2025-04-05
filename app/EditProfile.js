import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Video } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import { uploadToCloudinary } from "../src/Cloudinary";

const PROFILE_COLORS = ["#1DB954", "#FF6B6B", "#4ECDC4", "#FFD166", "#6B5B95"];

const EditProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    username: "",
    bio: "",
    profilePic: "",
    profileColor: "#1DB954",
    linkedin: "",
    tiktok: "",
    instagram: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [media, setMedia] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData({
            username: userSnap.data().username || "",
            bio: userSnap.data().bio || "",
            profilePic: userSnap.data().profilePic || "",
            profileColor: userSnap.data().profileColor || "#1DB954",
            linkedin: userSnap.data().linkedin || "",
            tiktok: userSnap.data().tiktok || "",
            instagram: userSnap.data().instagram || "",
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Error 🚫",
            text2: "No user profile found!",
          });
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!userData.username.trim()) {
      Toast.show({
        type: "error",
        text1: "Error 🚫",
        text2: "Username cannot be empty.",
      });
      return;
    }
  
    setUpdating(true);
    try {
      const user = auth.currentUser;
      if (user) {
        let profilePicUrl = userData.profilePic;
        if (media) {
          const isVideo = media.endsWith(".mp4") || media.endsWith(".mov");
          profilePicUrl = await uploadToCloudinary(media, isVideo);
        }
  
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          username: userData.username,
          bio: userData.bio,
          profilePic: profilePicUrl,
          profileColor: userData.profileColor,
          linkedin: userData.linkedin,
          tiktok: userData.tiktok,
          instagram: userData.instagram,
        });
  
        const postsRef = collection(db, "posts");
        const userPostsQuery = query(postsRef, where("userId", "==", user.uid));
        const userPostsSnapshot = await getDocs(userPostsQuery);
  
        userPostsSnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            userProfilePic: profilePicUrl,
          });
        });
  
        Toast.show({
          type: "success",
          text1: "Profile Updated ✅",
          text2: "Your changes have been saved.",
        });
  
        // ✅ Navigate back to the correct tab layout and show UserProfile tab
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Home",
              state: {
                index: 4, // 👈 index of the UserProfile tab in your TabLayout
                routes: [
                  { name: "Home" },
                  { name: "Post" },
                  { name: "SocialHub" },
                  { name: "Notifications" },
                  { name: "UserProfile" },
                ],
              },
            },
          ],
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "Could not update profile.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[userData.profileColor, "#222"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleSave}
            disabled={updating}
            style={styles.neuButton}
          >
            {updating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButton}>Save</Text>
            )}
          </TouchableOpacity>
        </LinearGradient>

        <TouchableOpacity style={styles.profilePicContainer} onPress={pickMedia}>
          {media && (media.endsWith(".mp4") || media.endsWith(".mov")) ? (
            <Video
              source={{ uri: media }}
              style={styles.profilePic}
              isLooping
              shouldPlay
              resizeMode="cover"
            />
          ) : (
            <Image
              source={{
                uri: media || userData.profilePic || "https://your-default-avatar.com/default.jpg",
              }}
              style={styles.profilePic}
            />
          )}
          <View style={styles.editIcon}>
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Username */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={userData.username}
            onChangeText={(text) => setUserData({ ...userData, username: text })}
          />
        </View>

        {/* Bio */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Tell us about yourself"
            value={userData.bio}
            onChangeText={(text) => setUserData({ ...userData, bio: text })}
            multiline
          />
        </View>

        {/* Links */}
        {["linkedin", "tiktok", "instagram"].map((key) => (
          <View style={styles.inputContainer} key={key}>
            <Text style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
            <TextInput
              style={styles.input}
              placeholder={`https://${key}.com/yourprofile`}
              value={userData[key]}
              onChangeText={(text) => setUserData({ ...userData, [key]: text })}
            />
          </View>
        ))}

        {/* Profile Color Picker */}
        <View style={styles.colorSelectionContainer}>
          <Text style={styles.label}>Profile Color</Text>
          <View style={styles.colorOptions}>
            {PROFILE_COLORS.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: color,
                    borderColor: userData.profileColor === color ? "#fff" : "transparent",
                  },
                ]}
                onPress={() => setUserData({ ...userData, profileColor: color })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  neuButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 10,
  },
  saveButton: {
    color: "#fff",
    fontSize: 16,
  },
  profilePicContainer: {
    alignSelf: "center",
    marginTop: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1DB954",
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  colorSelectionContainer: {
    marginTop: 20,
  },
  colorOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
});

export default EditProfile;