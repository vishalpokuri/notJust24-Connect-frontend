import { ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/ui/customButton";
import registerNNPushToken from "native-notify";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import WelcomeFlow from "../components/welcomeFlowComps/main";
export default function Index() {
  useEffect(() => {
    // Set the system UI background color as soon as the app starts
    SystemUI.setBackgroundColorAsync("#000000"); // Example color (black)
  }, []);
  registerNNPushToken(25674, "6Kka30YI9fQ1rmbvtyUDkX");
  return (
    <SafeAreaView className="bg-[#000] h-full">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ height: "100%" }}
      >
        <View className="w-full p-6"></View>
        <WelcomeFlow />
        <CustomButton
          containerStyles="w-[80%] mx-auto"
          title="Get Started"
          handlePress={() => router.push("/auth/signin")}
        />
      </ScrollView>
      <StatusBar backgroundColor="#000000" style="light" />
    </SafeAreaView>
  );
}

//auth/signin
//home/homePage
