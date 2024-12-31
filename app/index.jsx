import { ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/ui/customButton";
import registerNNPushToken from "native-notify";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as SystemUI from "expo-system-ui";
import React from "react";
import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import WelcomeFlow from "../components/welcomeFlowComps/main";

// Configure SplashScreen before any component rendering
SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function Index() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        registerNNPushToken(25674, "6Kka30YI9fQ1rmbvtyUDkX");
        await SystemUI.setBackgroundColorAsync("#000000");
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn("Error preparing app:", e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <SafeAreaView className="bg-[#000] h-full" onLayout={onLayoutRootView}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ height: "100%" }}
      >
        <View className="w-full p-6" />
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
