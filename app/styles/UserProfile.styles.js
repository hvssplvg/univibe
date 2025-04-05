// UserProfile.styles.js
import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },

  profileHeader: {
    height: SCREEN_HEIGHT * 0.4,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },

  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },

  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  university: {
    fontSize: 14,
    color: "#f1f1f1",
    marginTop: 2,
  },

  course: {
    fontSize: 13,
    color: "#ccc",
    marginBottom: 4,
  },

  bio: {
    fontSize: 13,
    color: "#aaa",
    textAlign: "center",
    marginTop: 6,
    paddingHorizontal: 20,
  },

  settingsIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 8,
    borderRadius: 30,
  },

  socialLinks: {
    flexDirection: "row",
    marginTop: 12,
  },

  socialIcon: {
    marginHorizontal: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 10,
    borderRadius: 10,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 16,
    paddingHorizontal: 16,
  },

  statCard: {
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    width: SCREEN_WIDTH / 3.4,
  },

  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },

  statLabel: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },

  postsContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },

  postThumbnail: {
    width: SCREEN_WIDTH / 3.3,
    height: SCREEN_WIDTH / 3.3,
    margin: 4,
    borderRadius: 10,
  },

  noPostsText: {
    color: "#bbb",
    fontSize: 14,
    textAlign: "center",
    marginTop: 40,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },

  closeModalButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 99,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 8,
    borderRadius: 20,
  },

  fullScreenPost: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "contain",
  },
});