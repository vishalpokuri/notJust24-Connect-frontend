import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";

const ToggleButton = ({ onToggle }) => {
  const [selectedOption, setSelectedOption] = useState("QR");
  const [animatedValue] = useState(new Animated.Value(0));

  const handleToggle = (option) => {
    setSelectedOption(option);
    Animated.timing(animatedValue, {
      toValue: option === "QR" ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Interpolated position for the slider
  const sliderPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["8%", "57%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.slider,
          {
            left: sliderPosition,
          },
        ]}
      />
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          if (selectedOption == "NFC") {
            handleToggle("QR");
            onToggle();
          }
        }}
      >
        <Text
          style={[styles.text, selectedOption === "QR" && styles.selectedText]}
        >
          QR
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          if (selectedOption == "QR") {
            handleToggle("NFC");
            onToggle();
          }
        }}
      >
        <Text
          style={[styles.text, selectedOption === "NFC" && styles.selectedText]}
        >
          NFC
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: "auto",
    width: 200,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 30,
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
    marginHorizontal: "auto",
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  text: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedText: {
    color: "#000",
  },
  slider: {
    position: "absolute",
    width: "40%",
    height: "80%",
    backgroundColor: "#b0f963",
    borderRadius: 15,
    zIndex: 0,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    transition: "left 0.3s ease",
  },
});

export default ToggleButton;
