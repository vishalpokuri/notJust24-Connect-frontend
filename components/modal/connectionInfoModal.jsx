import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable, // Added Modal component
} from "react-native";
import { BlurView } from "expo-blur";

const ConnectionInfoModal = ({
  selfieUri,
  isVisible,
  onClose,
  profileUri,
  notes,
  connectionDetails,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const [imageMetaData, setImageMetaData] = useState({
    width: "",
    height: "",
  });
  useEffect(() => {
    if (selfieUri) {
      setImageLoaded(false);
      Image.getSize(
        selfieUri,
        (width, height) => {
          setImageMetaData({ width: width, height: height });
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
    if (isVisible && imageLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
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
      <Pressable style={styles.modalOverlay} onPress={onClose}>
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
            <Text style={styles.title}>Connection details</Text>
            {selfieUri && (
              <View
                style={[
                  styles.selfieContainer,
                  imageMetaData.width < imageMetaData.height
                    ? styles.portraitImage
                    : styles.landscapeImage,
                ]}
              >
                <Image
                  source={{ uri: selfieUri }}
                  style={styles.selfieImage}
                  resizeMode="cover"
                />
              </View>
            )}

            <View style={styles.profileContainer}>
              <View style={styles.profilePicture}>
                <Image
                  source={{ uri: profileUri }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.profileInfo}>
                <Text style={styles.name}>{connectionDetails.name}</Text>
                <Text style={styles.company}>
                  {connectionDetails.workplace
                    ? connectionDetails.workplace
                    : "none"}
                </Text>
              </View>
            </View>
            {notes ? (
              <View className="border border-1 rounded-lg w-[100%] flex items-center p-4">
                <Text className="text-[#bbb] font-bold text-sm">{notes}</Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </Animated.View>
      </Pressable>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
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
    color: "#fff",
  },
  company: {
    fontSize: 16,
    color: "#999",
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
});

export default ConnectionInfoModal;
