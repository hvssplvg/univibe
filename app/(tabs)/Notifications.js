import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Vibration,
} from "react-native";
import { auth, db } from "../../src/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import Toast from "react-native-toast-message";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchNotifications = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setRefreshing(true);

    const q = query(
      collection(db, "notifications"),
      where("receiverId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    try {
      const snapshot = await getDocs(q);
      const notifList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notifList);

      Vibration.vibrate(30);
      Toast.show({
        type: "success",
        text1: "Refreshed ✅",
        position: "bottom",
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Toast.show({
        type: "error",
        text1: "Refresh Failed",
        text2: error.message,
        position: "bottom",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) return `${interval} ${key}${interval > 1 ? "s" : ""} ago`;
    }

    return "just now";
  };

  const NotificationItem = ({ item }) => {
    const [username, setUsername] = useState(item.senderUsername || "Someone");
    const [profilePic, setProfilePic] = useState(
      item.senderProfilePic || "https://your-default-avatar.com/default.jpg"
    );

    useEffect(() => {
      const fetchSenderInfo = async () => {
        if (!item.senderUsername || !item.senderProfilePic) {
          try {
            const senderRef = doc(db, "users", item.senderId);
            const senderSnap = await getDoc(senderRef);
            if (senderSnap.exists()) {
              const data = senderSnap.data();
              setUsername(data.username || "Someone");
              setProfilePic(data.profilePic || "https://your-default-avatar.com/default.jpg");
            }
          } catch (err) {
            console.error("Failed to fetch sender info:", err);
          }
        }
      };

      fetchSenderInfo();
    }, []);

    let message = "";
    if (item.type === "like") {
      message = `❤️ ${username} liked your post.`;
    } else if (item.type === "comment") {
      message = `💬 ${username} commented on your post.`;
    } else if (item.type === "follow") {
      message = `👥 ${username} sent you a follow request.`;
    } else {
      message = `🔔 You have a new notification.`;
    }

    return (
      <View style={styles.notificationItem}>
        <Image source={{ uri: profilePic }} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{message}</Text>
          <Text style={styles.time}>{timeAgo(item.createdAt?.toDate())}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : notifications.length === 0 ? (
        <Text style={styles.noNotif}>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchNotifications}
              tintColor="#1DB954"
              colors={["#1DB954"]}
            />
          }
        />
      )}

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  messageContainer: {
    flex: 1,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
  noNotif: {
    color: "#888",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});

export default Notifications;