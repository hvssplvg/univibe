import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "../../src/firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; // To fetch user AI setup info
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const messages = [
  "Find your people. Make your mark.",
  "Mic on? Camera on? Chaos mode activated. 🔥😂",
  "Climb to the top. Beat the best.",
  "1v1 me right now.",
  "Something big is always coming."
];

const SocialHub = () => {
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAISetup, setHasAISetup] = useState(false); // To track AI setup status
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef();
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation

  useEffect(() => {
    const checkAISetup = async () => {
      try {
        const uid = auth.currentUser.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.ai) {
            // If AI setup exists, proceed to the MyAiChat screen
            setHasAISetup(true);
          }
        }
      } catch (error) {
        console.error("Error fetching AI setup:", error);
      } finally {
        setIsLoading(false);
        // Fade in after content is ready
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };

    checkAISetup();

    // Interval for banner message rotation
    const interval = setInterval(() => {
      const nextIndex = (index + 1) % messages.length;
      setIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    }, 4000);

    return () => clearInterval(interval);
  }, [index]);

  const tiles = [
    {
      label: "Society",
      icon: <Ionicons name="people-outline" size={30} color="#1DB954" />,
      screen: "Society",
    },
    {
      label: "Party Rooms",
      icon: <Ionicons name="videocam-outline" size={30} color="#1DB954" />,
      screen: "PartyRooms",
    },
    {
      label: "Leaderboards",
      icon: <FontAwesome5 name="trophy" size={26} color="#1DB954" />,
      screen: "Leaderboards",
    },
    {
      label: "Games",
      icon: <Ionicons name="game-controller-outline" size={30} color="#1DB954" />,
      screen: "Games",
    },
    {
      label: "Events",
      icon: <MaterialCommunityIcons name="calendar-month-outline" size={30} color="#1DB954" />,
      screen: "Events",
    },
    {
      label: "My AI",
      icon: <Ionicons name="chatbubble-ellipses" size={30} color="#1DB954" />,
      screen: hasAISetup ? "MyAiChat" : "MyAiSetup", // Navigate based on AI setup status
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1DB954" />
      </View>
    );
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        style={styles.messageBanner}
      >
        {messages.map((msg, i) => (
          <View key={i} style={styles.messageSlide}>
            <Text style={styles.messageText}>{msg}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.tilesWrapper}>
        {tiles.map((tile, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.tile}
            onPress={() => navigation.navigate(tile.screen)} // Navigate based on AI setup status
          >
            {tile.icon}
            <Text style={styles.tileText}>{tile.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="home-outline" size={24} color="#1DB954" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="add-circle-outline" size={40} color="#1DB954" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="people-circle-outline" size={24} color="#1DB954" />
          <Text style={styles.navText}>Social Hub</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <Ionicons name="person-circle-outline" size={24} color="#1DB954" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  messageBanner: {
    height: 80,
    marginBottom: 20,
  },
  messageSlide: {
    width,
    justifyContent: "center",
    alignItems: "center",
  },
  messageText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  tilesWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  tile: {
    backgroundColor: "#1a1a1a",
    width: (width - 48) / 2,
    height: 130,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginHorizontal: 4,
  },
  tileText: {
    marginTop: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#000",
  },
  navButton: {
    alignItems: "center",
  },
  navText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },
});

export default SocialHub;