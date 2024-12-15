import React, { useEffect, useState } from "react";
import { ScrollView, View, StatusBar, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ToggleButton from "../../components/homePageComps/toggleButton";
import Qr from "../../components/homePageComps/Qr";
import Nfc from "../../components/homePageComps/Nfc";
import HomePageHeader from "../../components/homePageComps/header";

//TODO: just call the QR for the first time from a backend, and from next time, just save it in local storage

const HomePage = () => {
  const [isQRmode, setIsQRmode] = useState(true);
  const handleToggle = () => {
    setIsQRmode((previous) => !previous);
  };

  useEffect(() => {
    //fetch call for image
  });
  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6">
          <HomePageHeader />
          <View className="h-28"></View>
          {isQRmode ? <Qr /> : <Nfc />}

          <ToggleButton onToggle={handleToggle} />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#0a0a0a" style="light" />
    </SafeAreaView>
  );
};

export default HomePage;
