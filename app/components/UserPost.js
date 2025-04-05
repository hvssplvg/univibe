import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import styles from "../styles/UserPost.styles"; // ✅ Ensure this style file is updated

const UserPost = ({ post, onDelete, onEdit, onClose }) => {
  if (!post) return null;

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: onDelete },
      ]
    );
  };

  return (
    <View style={styles.postContent}>
      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Ionicons name="close" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Caption */}
      {post.caption && (
        <Text style={styles.captionText}>{post.caption}</Text>
      )}

      {/* Location */}
      {post.location && (
        <Text style={styles.locationText}>📍 {post.location}</Text>
      )}

      {/* Action Icons (Like, Comment, Share) */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Manage: Edit & Delete */}
      <View style={styles.managementRow}>
        <TouchableOpacity style={styles.manageButton} onPress={onEdit}>
          <Feather name="edit-2" size={20} color="#ccc" />
          <Text style={styles.manageText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.manageButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
          <Text style={[styles.manageText, { color: "#ff4d4d" }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserPost;