import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal, // Added Modal component
} from "react-native";
import LottieView from "lottie-react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";

export default function ScanResultModal({
  isVisible,
  onClose,
  profileUri,
  name,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const rippleloadingAnim = useRef(null);
  useEffect(() => {
    if (profileUri) {
      setImageLoaded(false);
      Image.getSize(
        profileUri,
        (width, height) => {
          setImageLoaded(true);
        },
        (error) => {
          console.error("Error loading image:", error);
          setImageLoaded(false);
        }
      );
    }
  }, [profileUri]);

  useEffect(() => {
    if (isVisible && imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timeout = setTimeout(() => {
        onClose();
      }, 2500);

      return () => clearTimeout(timeout);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, imageLoaded]);

  if (!isVisible || !imageLoaded) {
    return null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView
          intensity={70}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.modalContent}>
            <Text className="text-xl mb-4 text-white font-bold ">
              You are connecting with
            </Text>
            {/* This section is for lottie animations */}
            <View style={styles.animationContainer}>
              {/* Lottie Animation */}
              <LottieView
                ref={rippleloadingAnim}
                source={require("../../assets/lottieAnimations/Animation - 1735385973187.json")}
                autoPlay
                loop
                style={styles.lottieAnimation}
              />

              {/* Profile Image */}
              <View style={styles.profilePicture}>
                <Image
                  source={{ uri: profileUri }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.profileContainer}>
              <View style={styles.profileInfo}>
                <Text className="font-semibold text-white text-base">
                  {name}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  selfieContainer: {
    width: "100%",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  portraitImage: {
    height: 300,
  },
  landscapeImage: {
    height: 200,
  },
  selfieImage: {
    width: "100%",
    height: "100%",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  profilePicture: {
    width: 120, // Adjust size as needed
    height: 120, // Adjust size as needed
    borderRadius: 60, // Ensures the image is circular
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  company: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  animationContainer: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Ensures positioning within this container
    width: 200, // Adjust size as needed
    height: 200, // Adjust size as needed
  },
  lottieAnimation: {
    position: "absolute", // Places it in the background
    width: "100%",
    height: "100%",
  },
});
