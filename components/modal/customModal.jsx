import { default as BlurView } from "expo-blur";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";

const CustomModal = ({
  isVisible,
  onClose,
  isLoading,
  title,
  description,
  animSource,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successAnimation = useRef(null);

  const animLinks = {
    fail: require("../../assets/lottieAnimations/fail.json"),
  };
  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <View style={styles.modalContent}>
            {isLoading ? (
              <>
                <Text className="text-xl mb-4 text-white font-bold">
                  Connecting...
                </Text>
                <ActivityIndicator size="large" color="#ffffff" />
              </>
            ) : (
              <>
                <Text className="text-xl mb-4 text-white font-bold text-center">
                  {title}
                </Text>
                <View style={styles.animationContainer}>
                  <LottieView
                    ref={successAnimation}
                    source={animLinks[animSource]}
                    style={styles.lottieAnimation}
                    loop
                    autoPlay
                  />
                </View>
                <Text className="text-base mb-4 text-white font-bold">
                  {description}
                </Text>
              </>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  lottieAnimation: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
  },
  profilePicture: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CustomModal;
