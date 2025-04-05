// Post.styles.js (enhanced)
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

const COLORS = {
  dark: "#121212",
  primary: "#1DB954",
  input: "#1e1e1e",
  text: "#fff",
  fadedText: "#aaa",
  error: "#ff4d4d",
  button: "#1DB954",
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    paddingHorizontal: 20,
    justifyContent: "center",
  },

  contentCenter: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  cameraButton: {
    backgroundColor: "#3391FF",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  cameraText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },

  previewWrapper: {
    width: "100%",
    borderRadius: 16,
    padding: 15,
    backgroundColor: "#1b1b1b",
  },

  mediaPreview: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 15,
  },

  captionInput: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: COLORS.text,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 10,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },

  retakeButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#444",
  },

  retakeText: {
    color: "#fff",
    fontWeight: "600",
  },

  postButton: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },

  postButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },

  emojiPicker: {
    height: 300,
    marginTop: 10,
  },

  locationButton: {
    backgroundColor: "#333",
    marginTop: 12,
    padding: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  locationButtonText: {
    color: "#1DB954",
    fontWeight: "600",
  },

  locationText: {
    color: COLORS.fadedText,
    marginTop: 5,
  },

  errorText: {
    color: COLORS.error,
    marginTop: 10,
    fontSize: 14,
  },
  // extra 
  locationText: {
    color: "#ccc",
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    fontStyle: "italic",
  },
});