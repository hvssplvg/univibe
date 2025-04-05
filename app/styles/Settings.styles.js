import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  username: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    color: "#ccc",
    fontSize: 16,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 10,
  },
  sectionText: {
    color: "#ccc",
    fontSize: 16,
    fontWeight: "600",
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  optionText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 16,
  },
  scrollContent: {
    paddingBottom: 60,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  // backup email
  input: {
    backgroundColor: "#1c1c1e",
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#444",
  },
  
  saveButton: {
    backgroundColor: "#1DB954",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: "flex-start",
  },
  
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;