import { StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  filterTabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  activeFilter: {
    backgroundColor: "white",
  },
  filterText: {
    fontSize: 14,
    color: "white",
  },
  postContainer: {
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "#1E1E1E",
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  postImage: {
    width: "100%",
    height: height * 0.4,
    borderRadius: 12,
    marginBottom: 10,
  },
  caption: {
    fontSize: 16,
    color: "white",
    marginBottom: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },


});

export default styles;
