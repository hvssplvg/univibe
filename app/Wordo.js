import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { collection, doc, updateDoc, increment } from "firebase/firestore";
import { auth, db } from "../src/firebaseConfig"; // Ensure Firestore config is imported
import styles from "./styles/Wordo.styles";

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;
const SECRET_WORD = "BRAVE"; // Change this later or fetch dynamically

const Wordo = () => {
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  /** ✅ Handle Submit Guess */
  const submitGuess = () => {
    if (input.length !== WORD_LENGTH) {
      Alert.alert("Error", `Word must be ${WORD_LENGTH} letters.`);
      return;
    }

    const formattedGuess = input.toUpperCase();
    setAttempts([...attempts, formattedGuess]);

    if (formattedGuess === SECRET_WORD) {
      setGameOver(true);
      handleWin();
    } else if (attempts.length + 1 >= MAX_ATTEMPTS) {
      setGameOver(true);
      Alert.alert("Game Over", `The word was: ${SECRET_WORD}`);
    }

    setInput(""); // Clear input
  };

  /** ✅ Handle Winning & Update Firestore */
  const handleWin = async () => {
    Alert.alert("Congratulations!", "You guessed the word correctly!");

    // Update user points in Firestore
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(collection(db, "users"), user.uid);
      await updateDoc(userRef, {
        points: increment(10), // Add 10 points for a correct guess
      });
    }
  };

  /** ✅ Render Each Attempt */
  const renderAttempt = ({ item }) => (
    <View style={styles.attemptRow}>
      {item.split("").map((letter, index) => {
        let bgColor = "#444"; // Default (incorrect)
        if (SECRET_WORD.includes(letter)) bgColor = "#FFD700"; // Yellow (wrong position)
        if (SECRET_WORD[index] === letter) bgColor = "#32CD32"; // Green (correct position)

        return (
          <View key={index} style={[styles.letterBox, { backgroundColor: bgColor }]}>
            <Text style={styles.letter}>{letter}</Text>
          </View>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wordo: Guess the Word!</Text>

      <FlatList
        data={attempts}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAttempt}
        contentContainerStyle={styles.listContainer}
      />

      {!gameOver && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            maxLength={WORD_LENGTH}
            placeholder="Enter word"
            placeholderTextColor="#bbb"
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.button} onPress={submitGuess}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Wordo;