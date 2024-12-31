import { View, Text, Image, Touchable, Pressable } from "react-native";
import React from "react";
import icons from "../../constants/icons";
import { Linking } from "react-native";
const SocialView = ({ icon, text }) => {
  const handleRedirection = () => {
    // URL of the website

    Linking.openURL(text)
      .then((supported) => {
        if (!supported) {
          Alert.alert("Sorry, this URL is not supported on your device.");
        }
      })
      .catch((err) => console.error("Error opening URL: ", err));
  };
  return (
    <Pressable
      className="flex-row items-center px-4 my-2"
      onPress={handleRedirection}
    >
      <Image source={icons[icon]} className="w-7 h-7" resizeMode="contain" />
      <Text className="text-[#ccc] text-left ml-2">{text.split("//")[1]}</Text>
    </Pressable>
  );
};

export default SocialView;
