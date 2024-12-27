import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/ui/customButton";
import registerNNPushToken from "native-notify";

import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function Index() {
  registerNNPushToken(25674, "6Kka30YI9fQ1rmbvtyUDkX");
  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6"></View>
        <CustomButton
          title="SignIn"
          handlePress={() => router.push("/home/homePage")}
        />
      </ScrollView>
      <StatusBar backgroundColor="#0a0a0a" style="light" />
    </SafeAreaView>
  );
}

//auth/signin
