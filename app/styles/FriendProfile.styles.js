// FriendProfile.styles.js
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  profileHeader: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
   
  },
  backIcon: {
    position: "absolute",
    top: 40,
    left: 16,
    zIndex: 10,
  },
  menuIcon: {
    position: "absolute",
    top: 40,
    right: 16,
    zIndex: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  username: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },
  university: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 4,
  },
  course: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 2,
  },
  bio: {
    color: "#bbb",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  removeFriendButton: {
    backgroundColor: "#FF4D4D",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  requestedButton: {
    backgroundColor: "#555",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  addFriendButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  messageButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#333",
    marginHorizontal: 16,
  },
  statCard: {
    alignItems: "center",
  },
  statNumber: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  statLabel: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 2,
  },
  postsContainer: {
    flex: 1,
    paddingHorizontal: 8,
    marginTop: 16,
  },
  postThumbnail: {
    width: (width - 32) / 3 - 4,
    height: (width - 32) / 3 - 4,
    margin: 2,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  modalOptionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  modalOptionLast: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
});