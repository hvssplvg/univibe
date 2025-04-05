import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { auth, db } from "../../src/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

// Screens
import Home from "./Home";
import Post from "./Post";
import SocialHub from "./SocialHub";
import Notifications from "./Notifications";
import UserProfile from "./UserProfile";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState("Home");
  const scaleValues = {
    Home: new Animated.Value(1),
    Post: new Animated.Value(1),
    SocialHub: new Animated.Value(1),
    Notifications: new Animated.Value(1),
    UserProfile: new Animated.Value(1),
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, "notifications"),
          where("receiverId", "==", user.uid),
          where("isRead", "==", false)
        );

        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setUnreadCount(snapshot.size);
        });

        return () => unsubscribeSnapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    // Pulse animation when tab is pressed
    Animated.sequence([
      Animated.timing(scaleValues[tabName], {
        toValue: 1.2,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValues[tabName], {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#1DB954",
        tabBarInactiveTintColor: "#B3B3B3",
        tabBarBackground: () => (
          <BlurView 
            intensity={100} 
            tint="dark" 
            style={styles.blurBackground} 
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{
          tabPress: () => handleTabPress("Home"),
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View style={{ 
              transform: [{ scale: scaleValues.Home }],
              opacity: focused ? 1 : 0.7
            }}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={size + 2} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        listeners={{
          tabPress: () => handleTabPress("Post"),
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View style={{ 
              transform: [{ scale: scaleValues.Post }],
              opacity: focused ? 1 : 0.7
            }}>
              <View style={styles.postButton}>
                <Ionicons 
                  name={focused ? "camera" : "camera-outline"} 
                  size={size + 2} 
                  color={focused ? "#1DB954" : "#FFF"} 
                />
              </View>
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="SocialHub"
        component={SocialHub}
        listeners={{
          tabPress: () => handleTabPress("SocialHub"),
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View style={{ 
              transform: [{ scale: scaleValues.SocialHub }],
              opacity: focused ? 1 : 0.7
            }}>
              <Ionicons 
                name={focused ? "people" : "people-outline"} 
                size={size + 2} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        listeners={{
          tabPress: () => handleTabPress("Notifications"),
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View style={{ 
              transform: [{ scale: scaleValues.Notifications }],
              opacity: focused ? 1 : 0.7
            }}>
              <View style={{ position: "relative", width: size + 6, height: size + 6 }}>
                <Ionicons 
                  name={focused ? "notifications" : "notifications-outline"} 
                  size={size + 2} 
                  color={color} 
                />
                {unreadCount > 0 && (
                  <View style={[
                    styles.notificationBadge,
                    { backgroundColor: focused ? "#FFF" : "#FF3B30" }
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      { color: focused ? "#FF3B30" : "#FFF" }
                    ]}>
                      +{unreadCount > 9 ? "9" : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </Animated.View>
          ),
        }}
      />
      <Tab.Screen
        name="UserProfile"
        component={UserProfile}
        listeners={{
          tabPress: () => handleTabPress("UserProfile"),
        }}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Animated.View style={{ 
              transform: [{ scale: scaleValues.UserProfile }],
              opacity: focused ? 1 : 0.7
            }}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={size + 2} 
                color={color} 
              />
            </Animated.View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "transparent",
    borderRadius: 35,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 5 },
  },
  blurBackground: {
    flex: 1,
    borderRadius: 35,
    overflow: "hidden",
    backgroundColor: "rgba(25, 25, 25, 0.8)",
  },
  postButton: {
    backgroundColor: "#1DB954",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    shadowColor: "#1DB954",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});