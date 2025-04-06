import React, { useState, useEffect } from "react";
import { View } from "react-native";
import Header from "../components/Home/Header";
import PostList from "../components/Home/PostList";
import CustomizationModal from "../components/Home/CustomizationModal";
import { auth, db } from "../../src/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "../styles/HomeFeed.styles";

const Home = ({ navigation }) => {
  const [headerColor, setHeaderColor] = useState("#198754");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Trending");
  const [userCourse, setUserCourse] = useState(null);

  /** 📌 Fetch user preferences */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setHeaderColor(data.headerColor || "#198754");
            setUserCourse(data.course || "My Course");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  /** 📌 Update header color only */
  const handleHeaderColorChange = async (color) => {
    setHeaderColor(color);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { headerColor: color });
      }
    } catch (error) {
      console.error("Error updating header color:", error);
    }
  };

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={[styles.container, { backgroundColor: "#121212" }]}>
      <Header
        themeColor={headerColor}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setModalVisible={setModalVisible}
        applyFilter={applyFilter}
        userCourse={userCourse}
        navigation={navigation}
      />

      <PostList
        themeColor={headerColor}
        selectedFilter={selectedFilter}
        navigation={navigation}
      />

      <CustomizationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        headerColor={headerColor}
        handleHeaderColorChange={handleHeaderColorChange}
      />
    </View>
  );
};

export default Home;