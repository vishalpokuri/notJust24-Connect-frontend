// WelcomeScreenTemplate.js
import React from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreenTemplate = ({ animationSource, mainText, subText }) => {
  const animationRef = React.useRef(null);

  React.useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={animationSource}
          style={styles.animation}
          autoPlay
          loop
          resizeMode="contain"
          renderMode="AUTOMATIC"
          onError={(error) => {
            console.log("Lottie Error:", error);
          }}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.mainText}>{mainText}</Text>
        <Text style={styles.subText}>{subText} </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.9,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  animationContainer: {
    flex: 1,
    width: width * 0.8,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    width: width * 0.9,
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 100,
    width: width * 0.8,
    alignItems: "center",
  },
  mainText: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
  },
  subText: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginTop: 4,
  },
});

// Now, implement each screen using the template:

// ProfileHub.js
export const ProfileHub = () => (
  <WelcomeScreenTemplate
    animationSource={require("../../assets/lottieAnimations/welcomeFlow/SocialMedia.json")}
    mainText="Organize all your social profiles in one place"
    subText="Share your entire digital identity seamlessly"
  />
);

// PhotoMemories.js
export const PhotoMemories = () => (
  <WelcomeScreenTemplate
    animationSource={require("../../assets/lottieAnimations/welcomeFlow/Selfie.json")}
    mainText="Snap a photo with your new connection "
    subText="Remember their face and context effortlessly!"
  />
);

// InstantConnections.js
export const InstantConnections = () => (
  <WelcomeScreenTemplate
    animationSource={require("../../assets/lottieAnimations/welcomeFlow/Qrscan.json")}
    mainText="Easily share your details by tapping your phone or sharing a QR code"
    subText=" No manual entries needed!"
  />
);

// FinalCTA.js
export const FinalCTA = () => (
  <WelcomeScreenTemplate
    animationSource={require("../../assets/lottieAnimations/welcomeFlow/Waves.json")}
    mainText="Your seamless networking journey begins now."
  />
);

export default {
  ProfileHub,
  PhotoMemories,
  InstantConnections,
  FinalCTA,
};
