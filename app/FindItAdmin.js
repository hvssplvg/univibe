import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../src/firebaseConfig"; // ✅ Ensure correct import
import styles from "./styles/FindItAdmin.styles";

const FindItAdmin = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  /** ✅ Fetch Pending Submissions */
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const q = query(collection(db, "finditSubmissions"), where("status", "==", "pending"));
        const querySnapshot = await getDocs(q);
        const fetchedSubmissions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSubmissions(fetchedSubmissions);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  /** ✅ Update Submission Status */
  const updateSubmission = async (id, status) => {
    try {
      const submissionRef = doc(db, "finditSubmissions", id);
      await updateDoc(submissionRef, { status });

      setSubmissions((prev) => prev.filter((item) => item.id !== id)); // ✅ Remove from list
      Alert.alert(status === "approved" ? "✅ Approved!" : "❌ Rejected!");
    } catch (error) {
      Alert.alert("Error", "Failed to update submission.");
    }
  };

  /** ✅ Render Each Submission */
  const renderItem = ({ item }) => (
    <View style={styles.submissionItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.submissionImage} />
      <Text style={styles.username}>{item.username}</Text>
      <Text style={styles.objectText}>Object: {item.object}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.approveButton]}
          onPress={() => updateSubmission(item.id, "approved")}
        >
          <Text style={styles.buttonText}>✅ Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={() => updateSubmission(item.id, "rejected")}
        >
          <Text style={styles.buttonText}>❌ Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FindIt Admin Panel</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : submissions.length === 0 ? (
        <Text style={styles.noSubmissions}>No pending submissions.</Text>
      ) : (
        <FlatList
          data={submissions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

export default FindItAdmin;