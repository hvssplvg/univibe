import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  commentModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    height: height * 0.7,
  },
  dragHandle: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 10,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  commentList: {
    flex: 1,
  },
  comment: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  commentHighlight: {
    borderColor: "#1DB954",
    borderWidth: 2,
  },
  commentProfilePic: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  commentTextContainer: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 2,
  },
  commentText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  commentTime: {
    fontSize: 12,
    color: "#999",
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    color: "#333",
    fontSize: 16,
    paddingVertical: 5,
  },
  sendButton: {
    paddingLeft: 10,
  },
  replyButton: {
    marginTop: 5,
  },
  replyButtonText: {
    color: "#1DB954",
    fontSize: 14,
  },
  cancelReplyButton: {
    position: "absolute",
    right: 50,
    top: 15,
  },
  cancelReplyText: {
    color: "#ff4500",
    fontSize: 14,
  },
  voiceNoteBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6ffe6",
    padding: 10,
    borderRadius: 15,
    marginTop: 5,
  },
  playPauseIcon: {
    marginRight: 10,
  },
  playbackBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
  },
  recordButtonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  recordButton: {
    backgroundColor: "#1DB954",
    padding: 10,
    borderRadius: 25,
  },
  stopButton: {
    backgroundColor: "#ff3b30",
    padding: 10,
    borderRadius: 25,
  },
});

export default styles;
