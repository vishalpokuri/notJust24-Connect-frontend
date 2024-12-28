import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import QRCode from "react-native-qrcode-svg";
import { getItem } from "../../utils/asyncStorage"; // Assuming getItem fetches data from AsyncStorage

const Qr = () => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Fetch the userId from AsyncStorage or another async source
        const fetchedUserId = await getItem("userId");

        setUserId(fetchedUserId);
      } catch (error) {
        console.error("Error fetching userId:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchUserId();
  }, []);

  return (
    <View style={styles.glassContainer}>
      <Text className="text-lg font-extrabold text-white absolute top-10 w-[280px] px-1 text-center">
        Display this QR code for your connections to join you 🤝
      </Text>

      {isLoading ? (
        <View style={styles.imageContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <View className="w-[280px] h-[280px] bg-white justify-center items-center">
            <QRCode value={userId} size={240} />
          </View>
        </View>
      )}
    </View>
  );
};

export default Qr;
const styles = StyleSheet.create({
  glassContainer: {
    width: "92%",
    height: 460,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
    marginHorizontal: "auto",
    borderColor: "rgba(255, 255, 255, 0.15)", // Soft border for a glass look
  },
  imageContainer: {
    width: 280, // Fixed width
    height: 280, // Fixed height
    borderRadius: 20, // Rounded corners
    overflow: "hidden", // Ensures image stays within rounded corners
    backgroundColor: "#333", // Optional: background color for loading/empty state
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 35,
  },
  image: {
    width: "100%", // Fit the image to container width
    height: "100%", // Fit the image to container height
  },
});
