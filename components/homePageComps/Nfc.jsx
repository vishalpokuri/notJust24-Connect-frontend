import { View, Text, StyleSheet } from "react-native";
import React, { useRef } from "react";
import LottieView from "lottie-react-native";
const Nfc = () => {
  const nfcAnimation = useRef(null);
  return (
    <View style={styles.glassContainer}>
      <Text className="text-lg font-extrabold text-white absolute top-10 w-[280px] px-1 text-center">
        Keep your phones closer to make a handshake
      </Text>
      <View style={styles.imageContainer}>
        <LottieView
          ref={nfcAnimation}
          source={require("../../assets/lottieAnimations/nfcAnimation.json")}
          autoPlay
          loop
          style={styles.image}
        />
        {/* <Image source={images.qr} style={styles.image} resizeMode="cover" /> */}
      </View>
    </View>
  );
};

export default Nfc;

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
