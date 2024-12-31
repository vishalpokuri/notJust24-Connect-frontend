import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Modal, // Added Modal component
} from "react-native";
import { getItem } from "../../utils/asyncStorage";
import { deleteIndieNotificationInbox } from "native-notify";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
const NotifModal = ({
  selfieUri,
  isVisible,
  onClose,
  profileUri,
  notificationId,
  notificationModalReq,
  setData,
}) => {
  
  const [imageLoaded, setImageLoaded] = useState(false);
  const [userId, setUserId] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const handleDeleteNotification = async (notificationId) => {
    try {
      let notifications = await deleteIndieNotificationInbox(
        userId.toString(),
        notificationId,
        25674,
        "6Kka30YI9fQ1rmbvtyUDkX"
      );
    
      setData(notifications);
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Fetch the userId from AsyncStorage or another async source
        const fetchedUserId = await getItem("userId");
        setUserId(fetchedUserId);
      } catch (error) {
        console.error("Error fetching userId:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (selfieUri) {
      setImageLoaded(false);
      Image.getSize(
        selfieUri,
        (width, height) => {
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
            <Text style={styles.title}>New Connection Request</Text>

            {selfieUri && (
              <View
                style={[
                  styles.selfieContainer,
                  selfieUri.includes("portrait")
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
                <Text style={styles.name}>{notificationModalReq.name}</Text>
                <Text style={styles.company}>
                  {notificationModalReq.workplace}
                </Text>
              </View>
            </View>
            <View className="flex-row w-[75%] justify-around">
              <TouchableOpacity
                style={styles.closeButton}
                className="bg-green-500"
                //TODO: Pass connectionId here while routing
                onPress={() => {
                  
                  router.push(
                    `/home/addNotesfromNotif?connectionId=${notificationModalReq.connectionId}&uri=${selfieUri}`
                  );
                  onClose();
                }}
              >
                <Text style={styles.closeButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                className="bg-red-500"
                onPress={() => {
                  handleDeleteNotification(notificationId);
                  onClose();
                }}

                // TODO: the state function is to be set to ensure the setData sets the new array of notifs
              >
                <Text style={styles.closeButtonText}>-</Text>
              </TouchableOpacity>
            </View>
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

export default NotifModal;
