import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styles from "../../styles/HomeFeed.styles";

const colors = ["#1DB954", "#FF6B6B", "#5F27CD", "#FF9F43", "#00B894", "#198754", "#121212"];

const CustomizationModal = ({
  modalVisible,
  setModalVisible,
  headerColor,
  handleHeaderColorChange,
}) => {
  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Customize Header</Text>

          <Text style={styles.sectionLabel}>Header Color</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: color,
                    borderWidth: headerColor === color ? 3 : 1,
                    borderColor: headerColor === color ? "#fff" : "#ccc",
                  },
                ]}
                onPress={() => handleHeaderColorChange(color)}
              />
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomizationModal;