import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator, Animated, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../src/firebaseConfig";
import styles from "../../styles/Inbox.styles";

const SCREEN_WIDTH = Dimensions.get("window").width; 

const InboxScreen = ({ inboxVisible, setInboxVisible }) => {
  const [chats, setChats] = useState([]);
  const [groups, setGroups] = useState([]);
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("Chats");
  const [loading, setLoading] = useState(true);
  const [showFinallyMessage, setShowFinallyMessage] = useState(false); // ✅ Controls the "Finally!" effect

  const slideAnim = useState(new Animated.Value(SCREEN_WIDTH))[0]; 

  /** 📌 Fetch User Chats from Firestore */
  useEffect(() => {
    if (!inboxVisible) return;

    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const chatsRef = collection(db, "chats");
      const groupsRef = collection(db, "groups");
      const requestsRef = collection(db, "requests");

      const chatQuery = query(chatsRef, where("members", "array-contains", user.uid));
      const groupQuery = query(groupsRef, where("members", "array-contains", user.uid));
      const requestQuery = query(requestsRef, where("receiverId", "==", user.uid));

      const chatUnsubscribe = onSnapshot(chatQuery, (snapshot) => {
        const newChats = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (chats.length === 0 && newChats.length > 0) {
          setShowFinallyMessage(true);
          setTimeout(() => setShowFinallyMessage(false), 2000); // ✅ Show "Finally!" for 2 seconds
        }
        setChats(newChats);
      });

      const groupUnsubscribe = onSnapshot(groupQuery, (snapshot) => {
        const newGroups = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (groups.length === 0 && newGroups.length > 0) {
          setShowFinallyMessage(true);
          setTimeout(() => setShowFinallyMessage(false), 2000);
        }
        setGroups(newGroups);
      });

      const requestUnsubscribe = onSnapshot(requestQuery, (snapshot) => {
        const newRequests = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        if (requests.length === 0 && newRequests.length > 0) {
          setShowFinallyMessage(true);
          setTimeout(() => setShowFinallyMessage(false), 2000);
        }
        setRequests(newRequests);
      });

      setLoading(false);

      return () => {
        chatUnsubscribe();
        groupUnsubscribe();
        requestUnsubscribe();
      };
    };

    fetchData();
  }, [inboxVisible]);

  /** 📌 Close Modal with Animation */
  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setInboxVisible(false);
    });
  };

  /** 📌 Render Empty State with Fun Messages */
  const renderEmptyState = () => (
    <View style={styles.noMessagesContainer}>
      <Ionicons name="chatbubbles-outline" size={50} color="gray" />
      <Text style={styles.noMessagesText}>
        {showFinallyMessage
          ? "🎉 FINALLY! Someone messaged you. You're not alone! 😆"
          : activeTab === "Chats"
          ? "📭 No chats yet? You sure you have friends? 🤨"
          : activeTab === "Groups"
          ? "👥 No group chats? Even school projects had you in one. 😬"
          : "🙅 No requests? Even bots get spammed more than this. 💀"}
      </Text>
    </View>
  );

  return inboxVisible ? (
    <Animated.View style={[styles.fullScreenModal, { transform: [{ translateX: slideAnim }] }]}>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Inbox</Text>
        </View>

        {/* Tabs for Chats, Groups, and Requests */}
        <View style={styles.tabs}>
          {["Chats", "Groups", "Requests"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={styles.tabText}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : chats.length === 0 && groups.length === 0 && requests.length === 0 ? (
          renderEmptyState() // ✅ Show "Finally!" or empty messages
        ) : (
          <FlatList
            data={activeTab === "Chats" ? chats : activeTab === "Groups" ? groups : requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.chatItem}>
                <Image source={{ uri: item.chatImage || "https://your-default-avatar.com/default.jpg" }} style={styles.chatImage} />
                <View style={styles.chatDetails}>
                  <Text style={styles.chatName}>{item.chatName || "Unnamed Chat"}</Text>
                  <Text style={styles.lastMessage}>{item.lastMessage || "No messages yet"}</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Animated.View>
  ) : null;
};

export default InboxScreen;