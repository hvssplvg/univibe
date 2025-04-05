import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    marginTop: 20,
  },
  paragraph: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 24,
    marginBottom: 16,
  },
});