import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./styles/TermsPrivacyScreen.styles";

const TermsPrivacyScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient colors={["black", "#121212"]} style={styles.container}>
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Terms of Use</Text>

        <Text style={styles.paragraph}>
          Welcome to UniVibe. By accessing or using the UniVibe app, you agree to be bound by these
          Terms of Use. If you do not agree, please refrain from using our services.
        </Text>

        <Text style={styles.paragraph}>
          UniVibe is exclusively for current university students and verified alumni. You are
          responsible for keeping your account secure and ensuring that the information you provide
          is accurate and up to date.
        </Text>

        <Text style={styles.paragraph}>
          You may not use UniVibe for any unlawful purpose, including harassment, bullying,
          spamming, or impersonation. We reserve the right to suspend or terminate any account that
          violates these terms or disrupts the UniVibe community.
        </Text>

        <Text style={styles.paragraph}>
          All content posted in the app remains the responsibility of the user. By posting content,
          you grant UniVibe the right to use, modify, and display your content within the app.
        </Text>

        <Text style={styles.paragraph}>
          Features of the app may change over time. We may update these Terms as needed, and we
          encourage you to review them regularly.
        </Text>

        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.paragraph}>
          UniVibe is committed to protecting your privacy. We only collect essential personal
          information — such as your name, university email, course, and optional profile details —
          to match you with relevant users and enhance your experience.
        </Text>

        <Text style={styles.paragraph}>
          We use this information to improve our services, personalize your feed, send you
          notifications, and enable features like course and university matching, friend
          suggestions, and leaderboard rankings.
        </Text>

        <Text style={styles.paragraph}>
          Your data will never be sold or shared with third parties without your consent, except as
          required by law. We store your data securely using Firebase, and any media is hosted via
          trusted services like Cloudinary.
        </Text>

        <Text style={styles.paragraph}>
          You can request to delete your account at any time, which will remove your profile and
          content from our systems. Contact Support within the app to initiate a deletion request.
        </Text>

        <Text style={styles.paragraph}>
          For any privacy-related questions, concerns, or requests, please contact us through the
          Support section or by emailing support@univibe.app.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default TermsPrivacyScreen;