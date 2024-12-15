import { View, Text, Image } from "react-native";
import React from "react";
import icons from "../../constants/icons";
const SocialView = ({ icon }) => {
  return (
    <View className="flex-row items-center px-4 my-2 w-1/2 justify-between ">
      <Image source={icons[icon]} className="w-7 h-7" resizeMode="contain" />
      <Text className="text-[#bbb]">@vishal_pokuri99</Text>
    </View>
  );
};

export default SocialView;
