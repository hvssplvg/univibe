import { StyleSheet, Dimensions, Platform } from "react-native";

const { height, width } = Dimensions.get("window");

const colors = {
  background: "#121212",
  primary: "#198754",
  secondary: "#1E1E1E",
  text: "white",
  accent: "#FF4500",
  filterActive: "white",
  filterInactive: "rgba(255, 255, 255, 0.2)",
  whiteBackground: "#FFFFFF",
  blackBackground: "#000000",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  /** HEADER STYLES **/
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: colors.primary,
    position: "relative",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.text,
  },
  filterTabs: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: colors.filterInactive,
  },
  activeFilter: {
    backgroundColor: colors.filterActive,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },

  /** PALETTE ICON (LEFT) & MESSAGES ICON (RIGHT) **/
  paletteIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
  messagesIcon: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    zIndex: 10,
  },

  /** 🟢 POST CONTAINER **/
  postContainer: {
    width,
    height,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#000",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
  },
  timeRemaining: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: "bold",
  },
  commentCountText: {
    fontSize: 14,
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
  },
  likeCountText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 2,
    textAlign: "center",
  },

  repliesContainer: {
    marginLeft: 20,
    marginTop: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#ccc",
    paddingLeft: 10,
  },
  reply: {
    marginBottom: 10,
  },
  replyButton: {
    marginLeft: "auto",
  },
  replyButtonText: {
    color: "#1DB954",
    fontSize: 14,
  },

  postImage: {
    width: width * 0.9,
    height: height * 0.5,
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center",
  },

  caption: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    textAlign: "center",
  },

  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftIconWrapper: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  rightIconWrapper: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  likeAnimationOverlay: {
    position: "absolute",
    top: "45%",
    left: "50%",
    transform: [{ translateX: -125 }, { translateY: -150 }],
    width: 250,
    height: 250,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  likeAnimation: {
    width: 250,
    height: 250,
  },
  postMediaContainer: {
    position: "relative",
  },

  /** MODAL STYLES **/
  modalContainer: {
    width: "90%",
    backgroundColor: colors.secondary,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 10, // Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 20,
  },
  
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  
  closeButton: {
    marginTop: 25,
    backgroundColor: colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  blurEffect: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  uploadButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
  },
  uploadButtonText: {
    color: "#000",
    textAlign: "center",
  },

  removeButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: colors.text,
    textAlign: "center",
  },

  backgroundColorPicker: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  backgroundColorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
  },
  blackBackground: {
    backgroundColor: colors.blackBackground,
    borderColor: "gray",
  },
  whiteBackground: {
    backgroundColor: colors.whiteBackground,
    borderColor: "gray",
  },

  effectButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
  },
  effectButtonText: {
    color: "#000",
    textAlign: "center",
  },

  closeButton: {
    backgroundColor: colors.accent,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  closeButtonText: {
    color: colors.text,
    fontWeight: "bold",
  },

  locationText: {
    color: "white",
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },

  cachedIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 5,
    borderRadius: 5,
    zIndex: 1,
  },
  cachedIndicatorText: {
    color: "white",
    fontSize: 12,
  },
});

export default styles;