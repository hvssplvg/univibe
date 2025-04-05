import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { auth } from "../src/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import styles from "./styles/VerifyEmail.styles";

export default function VerifyEmail() {
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleResendEmail = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        await sendEmailVerification(currentUser);
        Toast.show({
          type: "success",
          text1: "Verification Email Sent",
          text2: `Check your inbox: ${currentUser.email}`,
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error Sending Email",
          text2: error.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleContinue = async () => {
    await currentUser.reload(); // refresh user data
    if (currentUser.emailVerified) {
      Toast.show({
        type: "success",
        text1: "Email Verified 🎉",
        text2: "Welcome to UniVibe!",
      });
      navigation.replace("Home"); // ✅ route to home after verified
    } else {
      Toast.show({
        type: "error",
        text1: "Still Not Verified 😓",
        text2: "Please check your inbox and verify your Unimail.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Unimail</Text>

      {currentUser && (
        <Text style={styles.subtitle}>
          We’ve sent a verification link to:{"\n"}
          <Text style={styles.email}>{currentUser.email}</Text>
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleResendEmail} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Resend Verification Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>I've Verified My Email</Text>
      </TouchableOpacity>

      <Toast />
    </View>
  );
}