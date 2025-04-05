import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // Dark background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1DB954", // Green header
  },
  backButton: {
    marginRight: 10,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  /** 🔹 Message Alignment */
  messageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  myMessageWrapper: {
    flexDirection: "row-reverse", // Sender messages on right
  },
  theirMessageWrapper: {
    flexDirection: "row", // Receiver messages on left
  },

  /** 🔹 Message Bubble */
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 20,
  },
  myMessageBubble: {
    backgroundColor: "#1DB954", // Green for sender
    borderTopRightRadius: 0,
  },
  theirMessageBubble: {
    backgroundColor: "#444", // Gray for receiver
    borderTopLeftRadius: 0,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },

  /** 🔹 Input */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#444",
    backgroundColor: "#222",
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#333",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#fff",
  },
  sendButton: {
    marginLeft: 10,
  },
});