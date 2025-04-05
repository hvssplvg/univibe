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
  const [backgroundColor, setBackgroundColor] = useState("#121212");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Trending");
  const [userCourse, setUserCourse] = useState(null); // ✅ Store user course

  /** 📌 Fetch User Preferences & Course from Firestore */
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
            setBackgroundColor(data.backgroundColor || "#121212");
            setUserCourse(data.course || "My Course"); // ✅ Fetch and store user course
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  /** 📌 Update Header Color */
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

  /** 📌 Update Background Color */
  const handleBackgroundColorChange = async (color) => {
    setBackgroundColor(color);
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { backgroundColor: color });
      }
    } catch (error) {
      console.error("Error updating background color:", error);
    }
  };

  /** 📌 Apply Filter to Posts */
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Header
        themeColor={headerColor}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        setModalVisible={setModalVisible}
        applyFilter={applyFilter} // ✅ Pass function to filter posts
        userCourse={userCourse} // ✅ Pass user course to Header
      />

      <PostList
        themeColor={headerColor}
        selectedFilter={selectedFilter}
        navigation={navigation} // ✅ Pass navigation prop
      />

      <CustomizationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        headerColor={headerColor}
        handleHeaderColorChange={handleHeaderColorChange}
        backgroundColor={backgroundColor}
        handleBackgroundColorChange={handleBackgroundColorChange}
      />
    </View>
  );
};

export default Home;