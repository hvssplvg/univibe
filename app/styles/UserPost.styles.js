import { StyleSheet } from "react-native";

export default StyleSheet.create({
  postContent: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    borderRadius: 20,
    zIndex: 2,
  },
  captionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
    paddingHorizontal: 6,
  },
  locationText: {
    color: "#aaa",
    fontSize: 14,
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 12,
  },
  actionButton: {
    padding: 10,
  },
  managementRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  manageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  manageText: {
    color: "#ccc",
    fontSize: 14,
    marginLeft: 6,
  },
});