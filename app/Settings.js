import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles/Settings.styles";

const Settings = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backupEmail, setBackupEmail] = useState("");

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setBackupEmail(data.backupEmail || "");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await auth.signOut();
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all data. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: implement delete account logic
            Alert.alert("Deleted", "Your account would be deleted here.");
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[userData?.profileColor || "#1DB954", "#121212"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: userData?.profilePic || "https://your-default-avatar.com/default.jpg" }}
            style={styles.profileImage}
          />
          <Text style={styles.username}>{userData?.username}</Text>
          <Text style={styles.email}>{auth.currentUser?.email}</Text>
        </View>

        {/* 📧 Backup Email */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.optionsContainer}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>📧 Backup Email</Text>
          </View>

          <TextInput
            placeholder="Enter a personal email"
            placeholderTextColor="#aaa"
            value={backupEmail}
            onChangeText={setBackupEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={async () => {
              try {
                const user = auth.currentUser;
                if (user) {
                  await updateDoc(doc(db, "users", user.uid), {
                    backupEmail: backupEmail.trim(),
                  });
                  Alert.alert("Success", "Backup email saved.");
                }
              } catch (err) {
                console.error("Error saving backup email:", err);
                Alert.alert("Error", "Failed to save backup email.");
              }
            }}
          >
            <Text style={styles.saveButtonText}>Save Backup Email</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* 🔒 Account & Security */}
        <View style={styles.optionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>🔒 Account & Security</Text>
          </View>

          <TouchableOpacity style={styles.optionRow}>
            <MaterialIcons name="block" size={22} color="#fff" />
            <Text style={styles.optionText}>Blocked Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <MaterialIcons name="security" size={22} color="#fff" />
            <Text style={styles.optionText}>Two-Factor Authentication</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="key-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* 🔔 Notification Preferences */}
        <View style={styles.optionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>🔔 Notification Preferences</Text>
          </View>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Push Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* ⚙️ App & Support */}
        <View style={styles.optionsContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>⚙️ App & Support</Text>
          </View>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="language-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Language Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="information-circle-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>About</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => navigation.navigate("TermsPrivacyScreen")}
          >
            <Ionicons name="document-text-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() =>
              Alert.alert("Coming Soon", "You'll be able to rate us once UniVibe is live on the app stores!")
            }
          >
            <FontAwesome name="star-o" size={22} color="#fff" />
            <Text style={styles.optionText}>Rate Us</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <Entypo name="lifebuoy" size={22} color="#fff" />
            <Text style={styles.optionText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <FontAwesome5 name="user-cog" size={20} color="#fff" />
            <Text style={styles.optionText}>Account Preferences</Text>
          </TouchableOpacity>
        </View>

        {/* 🚨 Danger Zone */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionRow} onPress={handleDeleteAccount}>
            <MaterialIcons name="delete-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#fff" />
            <Text style={styles.optionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Settings;
