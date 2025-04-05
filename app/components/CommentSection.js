import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  PanResponder,
  Animated,
  Dimensions,
  
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import styles from "../styles/CommentSection.styles";
import { auth, db } from "./../../src/firebaseConfig";
import AudioPlayerComponent from './AudioPlayerComponent';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";

const CommentSection = ({ visible, onClose, postId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [recording, setRecording] = useState(null);
  const [audioUri, setAudioUri] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [commentBeingEdited, setCommentBeingEdited] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const screenHeight = Dimensions.get("window").height;
  const modalHeight = useRef(new Animated.Value(screenHeight / 3)).current;
  const maxHeight = screenHeight * 0.7;
  const longPressTimeout = useRef(null);
  const swipeThreshold = 120;
  const audioTranslateX = useRef(new Animated.Value(0)).current;
  const audioOpacity = useRef(new Animated.Value(1)).current;
  const recordingInterval = useRef(null);
  const [volumeLevels, setVolumeLevels] = useState([]);
  const lastVolumeUpdate = useRef(Date.now());

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newHeight = screenHeight - gestureState.moveY;
        if (newHeight <= maxHeight && newHeight >= screenHeight / 3) {
          modalHeight.setValue(newHeight);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.moveY < screenHeight / 2) {
          Animated.spring(modalHeight, {
            toValue: maxHeight,
            useNativeDriver: false,
          }).start();
        } else {
          Animated.spring(modalHeight, {
            toValue: screenHeight / 3,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const audioPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          audioTranslateX.setValue(gestureState.dx);
          audioOpacity.setValue(1 + gestureState.dx / 100);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -swipeThreshold) {
          Animated.timing(audioTranslateX, {
            toValue: -screenHeight,
            duration: 200,
            useNativeDriver: true,
          }).start(() => deleteRecording());

          Animated.timing(audioOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(audioTranslateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();

          Animated.spring(audioOpacity, {
            toValue: 1,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const playbackPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const position = Math.max(0, Math.min(1, gestureState.dx / 200)) * recordingDuration;
        setPlaybackPosition(position);
      },
      onPanResponderRelease: (_, gestureState) => {
        const position = Math.max(0, Math.min(1, gestureState.dx / 200)) * recordingDuration;
        if (sound) {
          sound.setPositionAsync(position);
        }
      },
    })
  ).current;

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access microphone is required!');
      }
    };

    requestPermissions();

    if (!postId) return;

    const commentsRef = collection(db, "posts", postId, "comments");
    const commentsQuery = query(commentsRef);

    const unsubscribe = onSnapshot(commentsQuery, async (snapshot) => {
      const fetchedComments = [];

      for (const docSnap of snapshot.docs) {
        const commentData = docSnap.data();
        const userRef = doc(db, "users", commentData.userId);
        const userSnap = await getDoc(userRef);

        fetchedComments.push({
          id: docSnap.id,
          ...commentData,
          username: userSnap.exists() ? userSnap.data().username : "Anonymous",
          profilePic: userSnap.exists() ? userSnap.data().profilePic : "https://via.placeholder.com/50",
          timeAgo: moment(commentData.createdAt?.toDate()).fromNow(),
        });
      }

      setComments(fetchedComments);
    });

    return () => unsubscribe();
  }, [postId]);

  const toggleReplies = (commentId) => {
    setExpandedReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
  };

  const renderReply = (reply) => (
    <View key={reply.id} style={styles.replyContainer}>
      <View style={styles.replyContent}>
        <Image source={{ uri: reply.profilePic }} style={styles.replyProfilePic} />
        <View style={styles.replyTextContainer}>
          <Text style={styles.replyUsername}>{reply.username}</Text>
          {reply.audio ? (
            <AudioPlayerComponent uri={reply.audio} />
          ) : (
            <Text style={styles.replyText}>{reply.text}</Text>
          )}
          <Text style={styles.replyTime}>{reply.timeAgo}</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => handleReply(reply)}
        style={styles.replyButton}
      >
        <Text style={styles.replyButtonText}>Reply</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCommentItem = useCallback(({ item }) => {
    const replies = comments.filter(c => c.replyTo === item.id);
    const hasReplies = replies.length > 0;
    const isExpanded = expandedReplies[item.id];

    return (
      <View style={styles.commentContainer}>
        <TouchableOpacity
          onLongPress={() => handleLongPress(item)}
          activeOpacity={0.8}
        >
          <View style={[
            styles.comment,
            replyingTo?.id === item.id && styles.commentHighlight,
            commentBeingEdited === item.id && styles.editingComment
          ]}>
            <View style={styles.commentHeader}>
              <Image source={{ uri: item.profilePic }} style={styles.commentProfilePic} />
              <View style={styles.commentTextContainer}>
                <Text style={styles.commentUsername}>{item.username}</Text>
                {item.audio ? (
                  <AudioPlayerComponent uri={item.audio} />
                ) : (
                  <Text style={styles.commentText}>{item.text}</Text>
                )}
                <Text style={styles.commentTime}>{item.timeAgo}</Text>
              </View>
            </View>
            {auth.currentUser?.uid === item.userId && (
              <TouchableOpacity onPress={() => handleLongPress(item)} style={styles.commentOptions}>
                <Ionicons name="ellipsis-horizontal" size={16} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.commentFooter}>
          <TouchableOpacity onPress={() => handleReply(item)} style={styles.replyButton}>
            <Text style={styles.replyButtonText}>Reply</Text>
          </TouchableOpacity>

          {hasReplies && (
            <TouchableOpacity
              onPress={() => toggleReplies(item.id)}
              style={styles.viewRepliesButton}
            >
              <Text style={styles.viewRepliesText}>
                {isExpanded ? 'Hide replies' : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`}
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#888"
              />
            </TouchableOpacity>
          )}
        </View>

        {isExpanded && hasReplies && (
          <View style={styles.repliesList}>
            {replies.map(renderReply)}
          </View>
        )}
      </View>
    );
  }, [comments, replyingTo, commentBeingEdited, expandedReplies]);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;
  
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
  
      setRecording(recording);
      setRecordingDuration(0);
  
      recordingInterval.current = setInterval(async () => {
        try {
          const status = await recording.getStatusAsync();
  
          if (status.isRecording) {
            const now = Date.now();
            const delta = now - lastVolumeUpdate.current;
  
            if (delta > 100) { // Adjust this value to control the update frequency
              lastVolumeUpdate.current = now;
  
              // Simulated volume level (0 to 1)
              const fakeVolume = Math.random();
  
              setVolumeLevels(prev => {
                const updated = [...prev, fakeVolume];
                return updated.slice(-30); // keep only last 30 bars
              });
            }
          }
        } catch (error) {
          console.error("Recording status error:", error);
        }
      }, 100); // Adjust this interval to control how often the volume levels update
  
      // Separate interval for updating the recording duration
      const durationInterval = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 30) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // Update every second
  
      // Store the duration interval to clear it later
      recordingInterval.current.durationInterval = durationInterval;
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };
  
  const stopRecording = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setAudioUri(uri);
        setRecording(null);
      }
      clearInterval(recordingInterval.current);
      clearInterval(recordingInterval.current.durationInterval);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };
  

  const playRecording = async () => {
    if (audioUri) {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false, // ensures it plays from the speaker
        });

        const { sound } = await Audio.Sound.createAsync({ uri: audioUri });
        setSound(sound);

        sound.setOnPlaybackStatusUpdate((status) => {
          setPlaybackPosition(status.positionMillis);
          setIsPlaying(status.isPlaying);
        });

        await sound.playAsync();
      } catch (error) {
        console.error("Error playing recording:", error);
      }
    }
  };

  const deleteRecording = () => {
    setAudioUri(null);
    setRecordingDuration(0);
    if (sound) {
      sound.unloadAsync();
      setSound(null);
    }
    audioTranslateX.setValue(0);
    audioOpacity.setValue(1);
  };

  const sendComment = async () => {
    if ((!commentText.trim() && !audioUri) || !postId) return;

    try {
      const user = auth.currentUser;
      if (!user) return;

      if (commentBeingEdited) {
        // Editing existing comment
        const commentRef = doc(db, "posts", postId, "comments", commentBeingEdited);
        await updateDoc(commentRef, {
          text: commentText,
          updatedAt: serverTimestamp(),
        });
      } else {
        // Adding a new comment
        const postRef = doc(db, "posts", postId);
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return;

        const postOwnerId = postSnap.data().userId;

        const newComment = {
          userId: user.uid,
          text: commentText,
          createdAt: serverTimestamp(),
          replyTo: replyingTo ? replyingTo.id : null,
          audio: audioUri || null,
        };

        await addDoc(collection(db, "posts", postId, "comments"), newComment);

        if (user.uid !== postOwnerId) {
          await addDoc(collection(db, "notifications"), {
            receiverId: postOwnerId,
            senderId: user.uid,
            commentText: commentText,
            type: "comment",
            postId: postId,
            createdAt: serverTimestamp(),
          });
        }
      }

      // Reset state
      setCommentText("");
      setReplyingTo(null);
      setAudioUri(null);
      setRecordingDuration(0);
      setCommentBeingEdited(null);
    } catch (error) {
      console.error("Error sending comment:", error);
    }
  };

  const handleReply = (comment) => {
    setReplyingTo(comment);
    setCommentBeingEdited(null);
    setCommentText(`@${comment.username} `);
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  const handleLongPress = (comment) => {
    setSelectedComment(comment);
    setActionSheetVisible(true);
  };

  const handleEdit = () => {
    setCommentText(selectedComment.text);
    setCommentBeingEdited(selectedComment.id);
    setReplyingTo(null);
    setActionSheetVisible(false);
  };

  const handleDelete = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const commentRef = doc(db, "posts", postId, "comments", selectedComment.id);
      const commentSnap = await getDoc(commentRef);

      if (commentSnap.exists() && commentSnap.data().userId === user.uid) {
        await deleteDoc(commentRef);
      } else {
        console.error("You can only delete your own comments.");
      }

      setActionSheetVisible(false);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const VoiceVisualizer = ({ levels }) => (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 40, marginTop: 8 }}>
      {levels.map((level, index) => (
        <View
          key={index}
          style={{
            width: 4,
            height: Math.max(2, level * 40), // scale height
            marginHorizontal: 1,
            borderRadius: 2,
            backgroundColor: "#1DB954",
          }}
        />
      ))}
    </View>
  );

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.commentModal, { height: modalHeight }]}>
            <View style={styles.dragHandle} {...panResponder.panHandlers}>
              <View style={styles.handleBar} />
            </View>

            <FlatList
              data={comments.filter(comment => !comment.replyTo)}
              keyExtractor={(item) => item.id}
              renderItem={renderCommentItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />

            <View style={styles.commentInputContainer}>
              {commentBeingEdited && (
                <Text style={styles.editingLabel}>Editing your comment...</Text>
              )}
              {replyingTo && (
                <View style={styles.replyIndicator}>
                  <Text style={styles.replyIndicatorText}>Replying to @{replyingTo.username}</Text>
                  <TouchableOpacity onPress={cancelReply}>
                    <Ionicons name="close" size={16} color="#888" />
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder={
                  replyingTo
                    ? `Replying to @${replyingTo.username}`
                    : commentBeingEdited
                      ? "Edit your comment..."
                      : "Send message..."
                }
                placeholderTextColor="#ccc"
                multiline
              />
              <TouchableOpacity onPress={sendComment} style={styles.sendButton}>
                <Ionicons
                  name={commentBeingEdited ? "checkmark-circle-outline" : "arrow-forward-circle-outline"}
                  size={30}
                  color="#1DB954"
                />
              </TouchableOpacity>
            </View>

            {audioUri && (
              <Animated.View
                {...audioPanResponder.panHandlers}
                style={[
                  styles.audioContainer,
                  {
                    opacity: audioOpacity,
                    transform: [{ translateX: audioTranslateX }],
                  },
                ]}
              >
                <TouchableOpacity onPress={playRecording}>
                  <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={40} color="#1DB954" />
                </TouchableOpacity>
                <View style={styles.playbackBar} {...playbackPanResponder.panHandlers}>
                  <View style={[styles.playbackBarFill, { width: `${(playbackPosition / recordingDuration) * 100}%` }]} />
                </View>
                <Text style={styles.audioText}>{Math.floor(playbackPosition / 1000)}s / {recordingDuration}s</Text>
                <TouchableOpacity onPress={sendComment} style={styles.sendVoiceNoteButton}>
                  <Ionicons name="send" size={30} color="#1DB954" />
                </TouchableOpacity>
              </Animated.View>
            )}

            {!audioUri && !commentBeingEdited && (
              <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
                <Ionicons name="mic-circle-outline" size={60} color="#1DB954" />
              </TouchableOpacity>
            )}

            {recording && (
              <View style={styles.recordingIndicator}>
                <Text style={styles.recordingText}>Recording... {recordingDuration}s</Text>
                <VoiceVisualizer levels={volumeLevels} />
                <TouchableOpacity onPress={stopRecording} style={styles.stopButton}>
                  <Ionicons name="stop-circle" size={60} color="red" />
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={28} color="#333" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={actionSheetVisible} transparent animationType="fade">
        <View style={styles.actionOverlay}>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionRow}>
              {selectedComment?.userId === auth.currentUser?.uid && (
                <TouchableOpacity style={styles.actionItem} onPress={handleEdit}>
                  <View style={styles.iconCircle}>
                    <Ionicons name="create-outline" size={24} color="#000" />
                  </View>
                  <Text style={styles.actionLabel}>Edit</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.actionItem} onPress={() => console.log("Forwarded")}>
                <View style={styles.iconCircle}>
                  <Ionicons name="share-outline" size={24} color="#000" />
                </View>
                <Text style={styles.actionLabel}>Forward</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem} onPress={() => {
                Clipboard.setString(selectedComment?.text || '');
                setActionSheetVisible(false);
              }}>
                <View style={styles.iconCircle}>
                  <Ionicons name="copy-outline" size={24} color="#000" />
                </View>
                <Text style={styles.actionLabel}>Copy</Text>
              </TouchableOpacity>

              {selectedComment?.userId === auth.currentUser?.uid && (
                <TouchableOpacity style={styles.actionItem} onPress={handleDelete}>
                  <View style={[styles.iconCircle, { backgroundColor: "#ffe5e5" }]}>
                    <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                  </View>
                  <Text style={[styles.actionLabel, { color: "#FF3B30" }]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => setActionSheetVisible(false)}
              style={styles.cancelAction}
            >
              <Text style={styles.cancelActionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default CommentSection;
