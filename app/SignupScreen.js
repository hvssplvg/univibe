import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, query, where, getDocs } from "firebase/firestore";
import Toast from "react-native-toast-message";
import styles from "./styles/signup.styles";
import { Dropdown } from 'react-native-element-dropdown';

// Funny Welcome Messages
const welcomeMessages = [
  "In the clurb, we all fam! 🎉 Welcome to Univibe!",
  "You're in! 🎊 Time to make some new friends & connections (or at least stalk some profiles 👀).",
  "Account created! Now, let's see if you can remember your password. 😅",
];

// Funny Weak Password Messages
const weakPasswordMessages = [
  "Really? This is your idea of a secure password? 😭",
  "You can do better. Add CAPS, numbers, and symbols! 🔒",
  "Aint no way, ive seen better passwords on sticky notes😭😭"
];

// Check Password Strength (STRICT RULES)
const checkPasswordStrength = (password) => {
  if (password.length < 8) return "weak";
  if (!/[A-Z]/.test(password)) return "weak"; // Must have an uppercase letter
  if (!/\d/.test(password)) return "weak"; // Must have a number
  if (!/[!@#$%^&*(),.?":£{}|<>]/.test(password)) return "weak"; // Must have a special character
  return "strong";
};

const SignupScreen = () => {
  const navigation = useNavigation();
  const [stage, setStage] = useState(1);
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [course, setCourse] = useState("");
  const [firstName, setFirstName] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [year, setYear] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  const [universityMap, setUniversityMap] = useState(new Map());

  const bounceAnim = useRef(new Animated.Value(1)).current;
  const [isFocusYear, setIsFocusYear] = useState(false);
  const [isFocusEdu, setIsFocusEdu] = useState(false);

  // Bounce animation for errors
  const triggerBounce = () => {
    Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 1.1, duration: 100, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  // Fetch Universities Data
  const fetchUniversities = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/Hipo/university-domains-list/master/world_universities_and_domains.json');
      const data = await response.json();
      const map = new Map();
      data.forEach(uni => {
        uni.domains.forEach(domain => {
          map.set(domain, uni.name);
        });
      });
      setUniversityMap(map);
    } catch (error) {
      console.error("Error fetching universities data:", error);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  // Extract University Name
  useEffect(() => {
    if (email.includes("@")) {
      const domain = email.split("@")[1];
      const foundUniversity = [...universityMap.keys()].find((uniDomain) =>
        domain.endsWith(uniDomain)
      );
      setUniversity(foundUniversity ? universityMap.get(foundUniversity) : "Unknown University");
    } else {
      setUniversity("Unknown University");
    }
  }, [email, universityMap]);

  // Check Username Availability
  const checkUsernameAvailability = async (inputUsername) => {
    if (!inputUsername) {
      setIsUsernameAvailable(false);
      return;
    }

    setIsCheckingUsername(true);
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", inputUsername));

    try {
      const querySnapshot = await getDocs(q);
      setIsUsernameAvailable(querySnapshot.empty);
    } catch (error) {
      Toast.show({ type: "error", text1: "Error 🚫", text2: "Failed to check username." });
    } finally {
      setIsCheckingUsername(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      checkUsernameAvailability(username);
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [username]);

  // Handle Next Button
  const handleNext = () => {
    if (stage === 1) {
      if (!email || !username || !course || !year) {
        Toast.show({ type: "error", text1: "Error 🚫", text2: "Please fill in all fields." });
        triggerBounce();
        return;
      }
      if (!email.includes("@") || !email.includes(".")) {
        Toast.show({ type: "error", text1: "Error 🚫", text2: "Enter a valid university email." });
        triggerBounce();
        return;
      }
      if (!isUsernameAvailable) {
        Toast.show({ type: "error", text1: "Error 🚫", text2: "Username is already taken. Choose another." });
        triggerBounce();
        return;
      }
    } else if (stage === 2) {
      if (!firstName || !educationLevel || !password || !confirmPassword) {
        Toast.show({ type: "error", text1: "Error 🚫", text2: "Please fill in all fields." });
        triggerBounce();
        return;
      }
      const passwordStrength = checkPasswordStrength(password);
      if (passwordStrength === "weak") {
        const randomMessage = weakPasswordMessages[Math.floor(Math.random() * weakPasswordMessages.length)];
        Toast.show({ type: "error", text1: "Weak Password 🚫", text2: randomMessage });
        triggerBounce();
        return;
      }
      if (password !== confirmPassword) {
        Toast.show({ type: "error", text1: "Error 🚫", text2: "Passwords do not match!" });
        triggerBounce();
        return;
      }
    }
    setStage(stage + 1);
  };

  // Handle Sign-Up
  const handleSignUp = async () => {
    setLoading(true);
    navigation.replace("VerifyEmail");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        university,
        course,
        backupEmail: "",
        firstName,
        educationLevel,
        year,
        profilePic: "",
        posts: 0,
        friends: 0,
        points: 0,
        createdAt: new Date(),
        
      });

      // Random Welcome Message
      const randomWelcomeMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      Toast.show({ type: "success", text1: "Account created!", text2: randomWelcomeMessage });

      navigation.navigate("VerifyEmail");
    } catch (error) {
      Toast.show({ type: "error", text1: "Signup Failed 🚫", text2: error.message });
    }

    setLoading(false);
  };

  const yearOptions = [
    { label: '1st Year', value: '1st Year' },
    { label: '2nd Year', value: '2nd Year' },
    { label: '3rd Year', value: '3rd Year' },
    { label: '4th Year', value: '4th Year' },
    { label: 'Final Year', value: 'Final Year' },
    { label: 'Placement', value: 'Placement' },
  ];
  
  const educationOptions = [
    { label: 'Undergraduate', value: 'Undergraduate' },
    { label: 'Postgraduate', value: 'Postgraduate' },
    { label: 'PhD', value: 'PhD' },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
    >
      <Animated.View 
        style={[styles.innerContainer, { transform: [{ scale: bounceAnim }] }]}
      >
        <Text style={styles.title}>Sign Up</Text>

        {/* Step Indicator */}
        <View style={styles.stepIndicatorContainer}>
          {[1, 2, 3].map((step) => (
            <View 
              key={step} 
              style={[
                styles.stepIndicator, 
                step === stage ? styles.activeStep : null
              ]}
            >
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {stage === 1 && (
          <>
            {/* Username Input */}
            <View style={styles.usernameContainer}>
              <TextInput
                style={styles.usernameInput}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              {isCheckingUsername ? (
                <ActivityIndicator size="small" color="#1DB954" />
              ) : (
                <Ionicons 
                  name={isUsernameAvailable ? "checkmark-circle" : "close-circle"} 
                  size={20} 
                  color={isUsernameAvailable ? "green" : "red"} 
                />
              )}
            </View>

            {/* Email Input */}
            <TextInput 
              style={styles.input} 
              placeholder="University Email" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />

            {/* Auto-Detected University */}
            {university !== "Unknown University" && (
              <View style={styles.universityContainer}>
                <Ionicons name="school" size={20} color="#FFD700" />
                <Text style={styles.universityText}>{university}</Text>
              </View>
            )}

            {/* Course Input */}
            <TextInput 
              style={styles.input} 
              placeholder="Course" 
              value={course} 
              onChangeText={setCourse} 
            />

            {/* Year Dropdown */}
            <Dropdown
              style={[styles.dropdown, isFocusYear && { borderColor: '#1DB954' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={yearOptions}
              labelField="label"
              valueField="value"
              placeholder={!isFocusYear ? 'Select Year' : '...'}
              value={year}
              onFocus={() => setIsFocusYear(true)}
              onBlur={() => setIsFocusYear(false)}
              onChange={(item) => {
                setYear(item.value);
                setIsFocusYear(false);
              }}
            />
          </>
        )}

        {stage === 2 && (
          <>
            {/* First Name Input */}
            <TextInput 
              style={styles.input} 
              placeholder="First Name" 
              value={firstName} 
              onChangeText={setFirstName} 
            />

            {/* Education Level Dropdown */}
            <Dropdown
              style={[styles.dropdown, isFocusEdu && { borderColor: '#1DB954' }]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={educationOptions}
              labelField="label"
              valueField="value"
              placeholder={!isFocusEdu ? 'Select Education Level' : '...'}
              value={educationLevel}
              onFocus={() => setIsFocusEdu(true)}
              onBlur={() => setIsFocusEdu(false)}
              onChange={(item) => {
                setEducationLevel(item.value);
                setIsFocusEdu(false);
              }}
            />

            {/* Password Input */}
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword} 
            />

            {/* Confirm Password */}
            <TextInput 
              style={styles.input} 
              placeholder="Confirm Password" 
              value={confirmPassword} 
              onChangeText={setConfirmPassword} 
              secureTextEntry={!showConfirmPassword} 
            />
          </>
        )}

        {stage === 3 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Please confirm your details:</Text>
            <Text style={styles.summaryItem}>Username: {username}</Text>
            <Text style={styles.summaryItem}>Email: {email}</Text>
            <Text style={styles.summaryItem}>University: {university}</Text>
            <Text style={styles.summaryItem}>Course: {course}</Text>
            <Text style={styles.summaryItem}>Year: {year}</Text>
            <Text style={styles.summaryItem}>First Name: {firstName}</Text>
            <Text style={styles.summaryItem}>Education Level: {educationLevel}</Text>
          </View>
        )}
       

        <TouchableOpacity 
          style={styles.button} 
          onPress={stage === 3 ? handleSignUp : handleNext} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {stage === 3 ? "Confirm" : "Next"}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>
      <Toast />
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;