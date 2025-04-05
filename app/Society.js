import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  ActivityIndicator, 
  TextInput, 
  Platform,
  Animated,
  RefreshControl,
  ImageBackground,
  ScrollView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { db, auth } from "../src/firebaseConfig";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import styles from "./styles/Society.styles";
import { LinearGradient } from "expo-linear-gradient";

const Society = () => {
  const [societies, setSocieties] = useState([]);
  const [joinedSocieties, setJoinedSocieties] = useState([]);
  const [filter, setFilter] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [societyName, setSocietyName] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchSocieties = async () => {
    try {
      const societiesQuery = query(collection(db, "societies"));
      const querySnapshot = await getDocs(societiesQuery);
      const societiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocieties(societiesList);

      if (user?.uid) {
        const userSocieties = societiesList.filter(society => 
          society.members?.includes(user.uid)
        );
        setJoinedSocieties(userSocieties);
      }
    } catch (error) {
      console.error("Error fetching societies: ", error);
      setError("Failed to load societies. Please try again.");
    }
  };

  const fetchUserData = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUser({ uid: currentUser.uid, ...userDocSnap.data() });
        } else {
          setUser({ uid: currentUser.uid });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again.");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchSocieties(), fetchUserData()]);
      setError(null);
    } catch (error) {
      console.error("Refresh error:", error);
      setError("Refresh failed. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await fetchUserData();
        await fetchSocieties();
        setError(null);
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to initialize. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const createSociety = async () => {
    if (!societyName.trim()) {
      alert("Please enter a society name.");
      return;
    }

    if (!user?.uid) {
      alert("You must be logged in to create a society.");
      return;
    }
  
    try {
      await addDoc(collection(db, "societies"), {
        name: societyName,
        createdBy: user.uid,
        university: user.university || "Unknown",
        members: [user.uid],
        createdAt: new Date(),
        image: `https://picsum.photos/seed/${societyName}/300/200`,
      });
      setSocietyName("");
      setIsModalVisible(false);
      await fetchSocieties();
    } catch (error) {
      console.error("Error creating society: ", error);
      alert("Error creating society. Please try again.");
    }
  };

  const joinSociety = async (societyId) => {
    if (!user?.uid) {
      alert("You must be logged in to join a society.");
      return;
    }

    try {
      const societyRef = doc(db, "societies", societyId);
      await updateDoc(societyRef, {
        members: arrayUnion(user.uid),
      });
      await fetchSocieties();
    } catch (error) {
      console.error("Error joining society: ", error);
      alert("Error joining society. Please try again.");
    }
  };

  const filteredSocieties = societies.filter(society => 
    society.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSociety = ({ item }) => (
    <Animated.View 
      style={[styles.societyCard, { opacity: fadeAnim }]}
    >
      <ImageBackground
        source={{ uri: item.image || 'https://picsum.photos/300/200' }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <Text style={styles.societyName}>{item.name}</Text>
            <View style={styles.memberCount}>
              <Ionicons name="people" size={16} color="#fff" />
              <Text style={styles.societyDetails}>{item.members?.length || 0}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.joinButton}
            onPress={() => joinSociety(item.id)}
            disabled={joinedSocieties.some(s => s.id === item.id)}
          >
            <Text style={styles.joinButtonText}>
              {joinedSocieties.some(s => s.id === item.id) ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </Animated.View>
  );

  const renderJoinedSociety = ({ item }) => (
    <TouchableOpacity style={styles.joinedSocietyCard}>
      <View style={styles.joinedSocietyIcon}>
        <Ionicons name="people-circle" size={24} color="#1DB954" />
      </View>
      <View style={styles.joinedSocietyInfo}>
        <Text style={styles.joinedSocietyName}>{item.name}</Text>
        <Text style={styles.joinedSocietyMembers}>
          {item.members?.length || 0} members
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#888" />
    </TouchableOpacity>
  );

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Societies</Text>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => {/* Implement search functionality */}}
        >
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search societies..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.filterContainer}
>
  {['All', 'Friends', 'University', 'Trending', 'Sports', 'Academic'].map((item) => (
    <TouchableOpacity
      key={item}
      style={[
        styles.filterChip,
        filter === item && styles.activeFilterChip
      ]}
      onPress={() => setFilter(item)}
    >
      <Text style={[
        styles.filterChipText,
        filter === item && styles.activeFilterChipText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>

      {/* Joined Societies Section */}
      <Text style={styles.sectionTitle}>Your Societies</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
        <FlatList
          data={joinedSocieties}
          renderItem={renderJoinedSociety}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.joinedSocietyList}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>You haven't joined any societies yet</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#1DB954"
            />
          }
        />
      )}

      {/* Societies to Join Section */}
      <Text style={styles.sectionTitle}>Discover Societies</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1DB954" />
      ) : (
        <FlatList
          data={filteredSocieties}
          renderItem={renderSociety}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.societyList}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No societies found</Text>
            </View>
          }
        />
      )}

      {/* Create Society FAB */}
      {user?.uid && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsModalVisible(true)}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {/* Create Society Modal */}
      <Modal 
        visible={isModalVisible} 
        animationType="fade" 
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Create New Society</Text>
              <Text style={styles.modalSubtitle}>Bring people together around shared interests</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Society name"
                placeholderTextColor="#888"
                value={societyName}
                onChangeText={setSocietyName}
                autoFocus
              />
              
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalSecondaryButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalPrimaryButton,
                    !societyName.trim() && styles.disabledButton
                  ]}
                  onPress={createSociety}
                  disabled={!societyName.trim()}
                >
                  <Text style={styles.modalPrimaryButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Society;