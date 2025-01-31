import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";

const OnboardingComplete = ({ username }) => {
  const router = useRouter();
  const confettiAnimation = useRef(null);

  const handleContinue = () => {
    router.replace("/home/homePage"); // Adjust this path to the homepage route of your app
  };

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full justify-center items-center p-6">
      {/* Confetti Lottie Animation covering the entire screen */}
      <LottieView
        ref={confettiAnimation}
        source={require("../../../../assets/confetti.json")}
        autoPlay
        loop={false}
        style={{
          position: "absolute",
          top: -150,

          width: "150%",
          height: "150%",
          zIndex: -1, // Send the confetti animation to the back
        }}
      />

      <View className="flex items-center justify-center">
        <Text className="text-3xl font-semibold text-white mb-2">
          That's it, {username}!
        </Text>
        <Text className="text-lg text-white text-center mb-6">
          Welcome to the second brain of your connections!!
        </Text>

        <TouchableOpacity
          onPress={handleContinue}
          className="bg-[#9CCC65] px-6 py-3 rounded-full"
        >
          <Text className="text-lg text-[#0a0a0a] font-bold">Lessgoo!!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingComplete;
