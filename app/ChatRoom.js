import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth, db } from "../src/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import styles from "./styles/ChatRoom.styles";
import { Swipeable, GestureHandlerRootView } from "react-native-gesture-handler";

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chatRoomId, recipientId } = route.params;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [recipientData, setRecipientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);

  const currentUser = auth.currentUser;
  const flatListRef = useRef(null);

  /** ✅ Fetch Recipient Data */
  useEffect(() => {
    const fetchRecipient = async () => {
      if (!recipientId) return;

      try {
        const recipientRef = doc(db, "users", recipientId);
        const recipientSnap = await getDoc(recipientRef);

        if (recipientSnap.exists()) {
          setRecipientData(recipientSnap.data());
        } else {
          console.warn("Recipient data not found.");
        }
      } catch (error) {
        console.error("Error fetching recipient:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipient();
  }, [recipientId]);

  /** ✅ Listen for Messages */
  useEffect(() => {
    if (!chatRoomId) return;

    const messagesRef = collection(db, "chatRooms", chatRoomId, "messages");
    const messagesQuery = query(messagesRef, orderBy("createdAt", "desc")); // Messages in descending order

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const chatMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(chatMessages);

      // ✅ Scroll to latest message
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      }, 100);
    });

    return unsubscribe;
  }, [chatRoomId]);

  /** ✅ Send Message */
  const sendMessage = useCallback(async () => {
    if (!messageText.trim() || !currentUser) return;

    try {
      const messageRef = collection(db, "chatRooms", chatRoomId, "messages");

      await addDoc(messageRef, {
        senderId: currentUser.uid,
        senderProfilePic: currentUser.photoURL || "https://via.placeholder.com/50",
        text: messageText,
        createdAt: serverTimestamp(),
        ...(replyingTo && { replyTo: replyingTo }), // ✅ Stores reply reference
      });

      setMessageText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [messageText, currentUser, chatRoomId, replyingTo]);

  /** ✅ Render Messages */
  const renderMessage = useCallback(({ item }) => {
    const isMyMessage = item.senderId === currentUser?.uid;

    const rightSwipeActions = () => (
      <View style={styles.swipeActions}>
        <TouchableOpacity onPress={() => setReplyingTo(item)}>
          <Text style={styles.swipeText}>Reply</Text>
        </TouchableOpacity>
      </View>
    );

    return (
      <GestureHandlerRootView>
        <Swipeable renderRightActions={rightSwipeActions}>
          <View style={[styles.messageBubble, isMyMessage ? styles.myMessage : styles.theirMessage]}>
            <Image source={{ uri: item.senderProfilePic }} style={styles.messageProfilePic} />
            <View>
              {item.replyTo && (
                <View style={styles.replyContainer}>
                  <Text style={styles.replyText}>
                    Replying to: {item.replyTo.text.length > 30 ? item.replyTo.text.slice(0, 30) + "..." : item.replyTo.text}
                  </Text>
                </View>
              )}
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </View>
        </Swipeable>
      </GestureHandlerRootView>
    );
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 20}
      >
        {/* Chat Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: recipientData?.profilePic || "https://via.placeholder.com/50" }} style={styles.profilePic} />
          <Text style={styles.username}>{recipientData?.username || "User"}</Text>
        </View>

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          inverted
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        />

        {/* ✅ Show Replying to Message */}
        {replyingTo && (
          <View style={styles.replyingToContainer}>
            <Text style={styles.replyingToText}>Replying to: {replyingTo.text}</Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close-circle" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}

        {/* Message Input */}
        <View style={[styles.inputContainer, { paddingBottom: 20 }]}>
          <TextInput
            style={styles.input}
            value={messageText}
            onChangeText={setMessageText}
            placeholder={replyingTo ? `Replying to: ${replyingTo.text.slice(0, 30)}...` : "Type a message..."}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#1DB954" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default ChatRoom;