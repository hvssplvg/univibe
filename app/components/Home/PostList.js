import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { auth, db } from "../../../src/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../../styles/HomeFeed.styles";
import CommentSection from "../CommentSection";

const PostList = ({ themeColor, selectedFilter, userUniversity, userSociety, userCourse }) => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [cachedLoaded, setCachedLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [showFeed, setShowFeed] = useState(true);
  const [lastTaps, setLastTaps] = useState({});
  const [friends, setFriends] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentsCount, setCommentsCount] = useState({});

  const fetchCommentCounts = async (postIds) => {
    const counts = {};
    await Promise.all(
      postIds.map(async (postId) => {
        const commentsSnapshot = await getDocs(collection(db, "posts", postId, "comments"));
        counts[postId] = commentsSnapshot.size;
      })
    );
    setCommentsCount(counts);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      console.log("⏱ Fetch started");
      setLoading(true);
      setError(null);

      // Load cached posts on app start
      const cached = await AsyncStorage.getItem("cachedPosts");
      if (cached) {
        setPosts(JSON.parse(cached));
        setCachedLoaded(true); // Mark that cached posts are being shown
      }

      // Calculate cutoff time for posts (24 hours ago)
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const cutoffTimestamp = Timestamp.fromDate(twentyFourHoursAgo);

      let postsQuery;
      switch (selectedFilter) {
        case "Trending":
          postsQuery = query(
            collection(db, "posts"),
            where("createdAt", ">=", cutoffTimestamp),
            orderBy("createdAt", "desc")
          );
          break;
        case "Campus":
          postsQuery = userUniversity
            ? query(
                collection(db, "posts"),
                where("university", "==", userUniversity),
                where("createdAt", ">=", cutoffTimestamp),
                orderBy("createdAt", "desc")
              )
            : null;
          break;
        case "Society":
          postsQuery = userSociety
            ? query(
                collection(db, "posts"),
                where("society", "==", userSociety),
                where("createdAt", ">=", cutoffTimestamp),
                orderBy("createdAt", "desc")
              )
            : null;
          break;
        case "Friends":
          if (friends.length > 0) {
            postsQuery = query(
              collection(db, "posts"),
              where("userId", "in", friends),
              where("createdAt", ">=", cutoffTimestamp),
              orderBy("createdAt", "desc")
            );
          } else {
            postsQuery = null;
          }
          break;
        default:
          postsQuery = userCourse
            ? query(
                collection(db, "posts"),
                where("course", "==", selectedFilter.replace("📚 ", "")),
                where("createdAt", ">=", cutoffTimestamp),
                orderBy("createdAt", "desc")
              )
            : null;
      }

      if (!postsQuery) {
        setShowFeed(false);
        setLoading(false);
        return;
      }

      const unsubscribe = onSnapshot(
        postsQuery,
        async (snapshot) => {
          console.log("⏱ Posts received:", snapshot.docs.length);
          const t0 = performance.now();

          const fetchedPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            media: doc.data().media || [],
            likes: doc.data().likes || 0,
            likedBy: doc.data().likedBy || [],
            userId: doc.data().userId || null,
            userProfilePic: doc.data().userProfilePic || "https://your-default-avatar.com/default.jpg",
            username: doc.data().username || "Anonymous",
          }));

          setShowFeed(fetchedPosts.length > 0);
          
          // Only update posts if the new data is different from what we have
          if (JSON.stringify(fetchedPosts) !== JSON.stringify(posts)) {
            setPosts(fetchedPosts);
            await AsyncStorage.setItem("cachedPosts", JSON.stringify(fetchedPosts));
          }
          
          // Fetch comment counts for all posts
          await fetchCommentCounts(fetchedPosts.map((p) => p.id));
          
          setCachedLoaded(false); // Fresh data loaded, no longer showing cached
          setLoading(false);
          setRefreshing(false);

          const t1 = performance.now();
          console.log("⏱ Post processing took", (t1 - t0).toFixed(2), "ms");
        },
        (error) => {
          console.error("Error fetching posts:", error);
          setError("Failed to load posts. Please try again.");
          setLoading(false);
          setRefreshing(false);
        }
      );

      return () => unsubscribe();
    };

    fetchPosts();
  }, [selectedFilter, userUniversity, userSociety, userCourse, friends]);

  const handleRefresh = () => {
    setRefreshing(true);
  };

  const handleLike = async (postId, postOwnerId, shouldLike) => {
    const postRef = doc(db, "posts", postId);
    const post = posts.find((p) => p.id === postId);

    setLikedPosts((prevLikedPosts) => ({
      ...prevLikedPosts,
      [postId]: true,
    }));
    setTimeout(() => {
      setLikedPosts((prevLikedPosts) => ({
        ...prevLikedPosts,
        [postId]: false,
      }));
    }, 1000);

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: shouldLike ? p.likes + 1 : p.likes - 1,
              likedBy: shouldLike
                ? [...p.likedBy, auth.currentUser.uid]
                : p.likedBy.filter((uid) => uid !== auth.currentUser.uid),
            }
          : p
      )
    );

    try {
      await updateDoc(postRef, {
        likes: shouldLike ? post.likes + 1 : post.likes - 1,
        likedBy: shouldLike ? arrayUnion(auth.currentUser.uid) : arrayRemove(auth.currentUser.uid),
      });

      if (shouldLike) {
        const currentUserRef = doc(db, "users", auth.currentUser.uid);
        const currentUserSnap = await getDoc(currentUserRef);
        const currentUserData = currentUserSnap.exists() ? currentUserSnap.data() : null;

        if (currentUserData) {
          await setDoc(doc(collection(db, "notifications")), {
            receiverId: postOwnerId,
            senderId: auth.currentUser.uid,
            senderName: currentUserData.username,
            senderProfilePic: currentUserData.profilePic || "https://via.placeholder.com/50",
            postId,
            type: "like",
            createdAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("Error updating like status:", error);
    }
  };

  const handleDoubleTap = (postId, postOwnerId) => {
    const now = new Date().getTime();
    const lastTapForPost = lastTaps[postId];

    if (lastTapForPost && (now - lastTapForPost) < 400) {
      // Double tap detected; toggle the like state
      const post = posts.find((p) => p.id === postId);
      const isLiked = post.likedBy.includes(auth.currentUser.uid);
      handleLike(postId, postOwnerId, !isLiked);

      // Clear the last tap for that post
      setLastTaps((prev) => ({ ...prev, [postId]: null }));
    } else {
      // Record this tap for the specific post
      setLastTaps((prev) => ({ ...prev, [postId]: now }));

      // Debounce: Clear the last tap after 400ms if no second tap is detected
      setTimeout(() => {
        setLastTaps((prev) => {
          if (prev[postId] === now) {
            return { ...prev, [postId]: null };
          }
          return prev;
        });
      }, 400);
    }
  };

  const openComments = (postId) => {
    setSelectedPostId(postId);
  };

  const closeComments = () => {
    setSelectedPostId(null);
  };

  const renderPost = useCallback(({ item }) => {
    return (
      <View style={styles.postContainer}>
        {cachedLoaded && (
          <View style={styles.cachedIndicator}>
            <Text style={styles.cachedIndicatorText}>Cached Version</Text>
          </View>
        )}
        
        <View style={styles.postHeader}>
          <Pressable
            style={styles.profileContainer}
            onPress={() => {
              if (item.userId) {
                navigation.navigate("FriendProfile", { userId: item.userId });
              } else {
                console.warn("Missing userId for this post.");
              }
            }}
            android_ripple={{ color: "transparent" }}
          >
            <Image source={{ uri: item.userProfilePic }} style={styles.profileImage} />
            <Text style={styles.username}>{item.username}</Text>
          </Pressable>
          <Text style={styles.timeRemaining}>{calculateTimeRemaining(item.createdAt)}</Text>
        </View>

        <Pressable onPress={() => handleDoubleTap(item.id, item.userId)} android_ripple={{ color: "transparent" }}>
          <Image
            source={{ uri: item.media[0] }}
            onLoadStart={() => console.log("📷 Cloudinary load start")}
            onLoadEnd={() => console.log("✅ Cloudinary load end")}
            style={styles.postImage}
          />
        </Pressable>

        <Text style={styles.caption}>{item.caption}</Text>

        {typeof item.location === "string" && (
          <Text style={styles.locationText}>📍 {item.location}</Text>
        )}

        <View style={styles.actionButtons}>
          <Pressable
            onPress={() => handleLike(item.id, item.userId, !item.likedBy.includes(auth.currentUser.uid))}
            style={styles.iconButton}
            android_ripple={{ color: "transparent" }}
          >
            <Ionicons
              name={item.likedBy.includes(auth.currentUser.uid) ? "heart" : "heart-outline"}
              size={24}
              color={item.likedBy.includes(auth.currentUser.uid) ? "red" : "white"}
            />
            <Text style={styles.likeCountText}>{item.likes || 0}</Text>
          </Pressable>

          <Pressable
            onPress={() => openComments(item.id)}
            style={styles.iconButton}
            android_ripple={{ color: "transparent" }}
          >
            <Ionicons name="chatbubble-outline" size={24} color="white" />
            <Text style={styles.commentCountText}>{commentsCount[item.id] || 0}</Text>
          </Pressable>
        </View>

        {selectedPostId === item.id && (
          <CommentSection
            postId={item.id}
            visible={true}
            onClose={closeComments}
            onCommentSent={() => {
              setCommentsCount((prev) => ({
                ...prev,
                [item.id]: (prev[item.id] || 0) + 1,
              }));
            }}
          />
        )}

        {likedPosts[item.id] && (
          <View style={styles.likeAnimationOverlay}>
            <LottieView
              source={require("../../../assets/like-animation.json")}
              autoPlay
              loop={false}
              style={styles.likeAnimation}
            />
          </View>
        )}
      </View>
    );
  }, [posts, likedPosts, selectedPostId, commentsCount, navigation, cachedLoaded]);

  return (
    <>
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : !showFeed ? (
        <View style={styles.noPostsContainer}>
          <Text style={styles.noPostsText}>
            {selectedFilter === "Campus"
              ? "No users from your university have posted yet."
              : selectedFilter === "Society"
              ? "No posts from this society."
              : "No posts available."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderPost}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment="center"
          decelerationRate="fast"
          bounces={false}
          scrollEnabled={true}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: Dimensions.get("window").width,
            offset: Dimensions.get("window").width * index,
            index,
          })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              enabled={posts.length > 0}
            />
          }
        />
      )}
    </>
  );
};

const calculateTimeRemaining = (createdAt) => {
  if (!createdAt || !createdAt.toDate) return "Just now";
  const now = new Date();
  const postTime = createdAt.toDate();
  const hoursLeft = Math.max(0, 24 - Math.floor((now - postTime) / (1000 * 60 * 60)));
  return hoursLeft > 0 ? `${hoursLeft}h left` : "Expired";
};

export default PostList;