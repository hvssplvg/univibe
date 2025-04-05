import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";
import { uploadToCloudinary } from "../../src/Cloudinary";
import { db } from "../../src/firebaseConfig";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import axios from "axios";
import styles from "../styles/Post.styles";

const Post = () => {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userData, setUserData] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

  const OPENCAGE_API_KEY = "64d7f923855a4e6c94f7d036a116910c"; 

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const getLocationName = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("Location permission not granted");
        return;
      }
  
      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;
  
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
      );
  
      const components = response.data?.results?.[0]?.components;
  
      // Prefer university name, fallback to city
      let place = components.university || components.city || components.town || components.village || components.state;
  
      if (place) {
        setLocation(place);
      } else {
        setLocation("Unknown location");
      }
    } catch (err) {
      console.error("Failed to fetch location:", err);
      setLocation("Location unavailable");
    }
  };
  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setMedia(result.assets[0].uri);
        setTimeout(() => getLocationName(), 500); // Fetch location just after image capture
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Toast.show({
        type: "error",
        text1: "Camera Error",
        text2: "Unable to access camera",
      });
    }
  };

  const handlePost = async () => {
    if (!user || !media) return;

    setUploading(true);

    try {
      const uploadedUrl = await uploadToCloudinary(media);
      if (!uploadedUrl) throw new Error("Upload failed");

      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        username: userData?.username || user.displayName || "Anonymous",
        userProfilePic: userData?.profilePic || user.photoURL || "https://your-default-avatar.com/default.jpg",
        caption,
        location,
        media: [uploadedUrl],
        createdAt: serverTimestamp(),
      });

      setMedia(null);
      setCaption("");
      setLocation("");

      Toast.show({
        type: "success",
        text1: "Post Uploaded",
        text2: "Your post is now live 🎉",
        position: "top",
        visibilityTime: 3000,
      });

      navigation.navigate("UserProfile");
    } catch (error) {
      console.error("Post upload error:", error);
      Toast.show({
        type: "error",
        text1: "Upload Failed",
        text2: "Please try again later.",
        position: "top",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    setMedia(null);
    setCaption("");
    setLocation("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.contentCenter}>
        {!media ? (
          <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
            <Feather name="camera" size={60} color="#fff" />
            <Text style={styles.cameraText}>Take Photo</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewWrapper}>
            <Image source={{ uri: media }} style={styles.mediaPreview} />
            <TextInput
              style={styles.captionInput}
              placeholder="Write a caption..."
              placeholderTextColor="#aaa"
              value={caption}
              onChangeText={setCaption}
              multiline
            />
            <Text style={styles.locationText}>
              {location ? `📍 ${location}` : "Fetching location..."}
            </Text>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={handleRetake} style={styles.retakeButton}>
                <Text style={styles.retakeText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePost} style={styles.postButton} disabled={uploading}>
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.postButtonText}>Post</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default Post;