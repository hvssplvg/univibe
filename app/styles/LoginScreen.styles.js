import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // 🌀 Full-screen animated background style
  background: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },

  

  container: {
    flex: 1,
    backgroundColor: "transparent", // allow Lottie background to show through
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "rgba(17, 17, 17, 0.8)", // semi-transparent for float effect
    borderRadius: 20,
    padding: 25,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  topText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: "Courier",
    fontSize: 12,
  },

  welcome: {
    color: "#00FF00",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "monospace",
  },

  inputWrapper: {
    backgroundColor: "#222",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    color: "#fff",
    height: 50,
  },

  eyeIcon: {
    paddingHorizontal: 6,
  },

  forgotText: {
    color: "#00FF00",
    textAlign: "center",
    marginBottom: 20,
    textDecorationLine: "underline",
  },

  loginButton: {
    backgroundColor: "#1DB954",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  bottomText: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
  },

  signupText: {
    color: "#00FF00",
    fontWeight: "bold",
  },
});