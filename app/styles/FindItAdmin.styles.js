import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1DB954",
    marginBottom: 20,
  },
  listContainer: {
    width: "100%",
  },
  submissionItem: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  submissionImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
  },
  objectText: {
    fontSize: 16,
    color: "#AAA",
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: "#1DB954",
  },
  rejectButton: {
    backgroundColor: "#D33",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  noSubmissions: {
    fontSize: 18,
    color: "#AAA",
    marginTop: 20,
  },
});