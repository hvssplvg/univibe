import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../../styles/HomeFeed.styles";

const Header = ({ themeColor, selectedFilter, setSelectedFilter, setModalVisible, applyFilter, userCourse, navigation }) => {
  const courseFilter = userCourse ? `📚 ${userCourse}` : "My Course";

  return (
    <LinearGradient
      key={themeColor}
      colors={[themeColor, themeColor]}
      style={[styles.header, { backgroundColor: themeColor }]}
    >
      {/* Palette Icon on the Extreme Left */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.paletteIcon}>
        <Ionicons name="color-palette-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* App Title */}
      <Text style={[styles.title, { color: themeColor === "#FFFFFF" ? "#000000" : "#FFFFFF" }]}>
        UniVibe
      </Text>

      {/* Messages Icon on the Right (Fixed Position) */}
      <TouchableOpacity onPress={() => navigation.navigate("Inbox")} style={styles.messagesIcon}>
        <Ionicons name="chatbubble-outline" size={24} color="white" />
      </TouchableOpacity>

      {/* Scrollable Filter Tabs (Placed Below the Header) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterTabs}>
        {["Trending", "Campus", "Friends", "Society", courseFilter].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, selectedFilter === filter && styles.activeFilter]}
            onPress={() => {
              setSelectedFilter(filter);
              applyFilter(filter);
            }}
          >
            <Text style={[styles.filterText, { color: themeColor === "#FFFFFF" ? "#000000" : "#FFFFFF" }]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default Header;