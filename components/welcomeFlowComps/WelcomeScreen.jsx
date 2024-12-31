import React from "react";
import { View, Text, Dimensions, StyleSheet, Image } from "react-native";
import LottieView from "lottie-react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const { width, height } = Dimensions.get("window");

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const WelcomeScreen = () => {
  const [fontsLoaded] = useFonts({
    MainLogo: require("../../assets/fonts/white_dream/whiteDream.otf"),
    space: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const animationRef = React.useRef(null);

  React.useEffect(() => {
    // Handle animation and font loading
    const prepare = async () => {
      try {
        if (animationRef.current) {
          animationRef.current.play();
        }

        if (fontsLoaded) {
          // Hide splash screen once fonts are loaded
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.warn("Error loading resources:", error);
      }
    };

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Or return a loading component
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/appLogo/logo.png")}
          className="w-[120px] h-[96px]"
        />
      </View>

      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require("../../assets/lottieAnimations/welcomeFlow/nodeGlobe.json")}
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
        <Text style={styles.mainText}>Your second brain for Networking</Text>
        <Text style={styles.subText}>
          Manage and grow your connections effortlessly
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: height * 0.85,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  headerContainer: {
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },
  logoText: {
    fontFamily: "mainLogo",
    fontSize: 24,
    color: "#fff",
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
    alignItems: "center",
  },
  mainText: {
    fontSize: 22,
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

export default WelcomeScreen;
