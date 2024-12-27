import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";

const ScanResultModal = ({ selfieUri, isVisible, onClose }) => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(Dimensions.get("window").height);

  useEffect(() => {
    if (selfieUri) {
      setImageLoaded(false); // Reset when new image is provided
      Image.getSize(
        selfieUri,
        (width, height) => {
          setIsPortrait(height > width);
          setImageLoaded(true);
        },
        (error) => {
          console.error("Error loading image:", error);
          setImageLoaded(false);
        }
      );
    }
  }, [selfieUri]);

  useEffect(() => {
    // Only animate if both image is loaded and modal should be visible
    if (isVisible && imageLoaded) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: Dimensions.get("window").height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, imageLoaded]);

  // Don't render anything if modal shouldn't be visible or image isn't loaded
  if (!isVisible || !imageLoaded) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      {/* This is the key change - BlurView as a separate full-screen layer */}
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
        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.title}>New Connection Request</Text>
          {/* Selfie Section */}

          {selfieUri && (
            <View
              style={[
                styles.selfieContainer,
                isPortrait ? styles.portraitImage : styles.landscapeImage,
              ]}
            >
              <Image
                source={{ uri: selfieUri }}
                style={styles.selfieImage}
                resizeMode="cover"
              />
            </View>
          )}

          {/* Profile Details */}
          <View style={styles.profileContainer}>
            <View style={styles.profilePicture}>
              <Image
                source={{ uri: "https://via.placeholder.com/100" }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.name}>Person Name</Text>
              <Text style={styles.company}>Company Name</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
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
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 15,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  company: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ScanResultModal;
