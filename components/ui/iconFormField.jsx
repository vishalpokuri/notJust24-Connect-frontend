import { View, Text, TextInput, Image } from "react-native";
import React, { useState } from "react";
import icons from "../../constants/icons";
const IconFormField = ({
  title,
  value,
  otherStyles,
  handleChangeText,
  placeholder,
  keyboardType,
  icon,
}) => {
  return (
    <View className="mb-2">
      <Text className={`text-base text-gray-100 ${otherStyles}`}>{title}</Text>

      <View className="w-full h-14 px-4 my-2 bg-[#2a2a2a] rounded-2xl flex-row items-center">
        <View className="w-[40px]">
          <Image
            source={icons[icon]}
            className="w-6 h-6 rounded-md"
            resizeMode="contain"
          />
        </View>
        <TextInput
          className="flex-1 text-white font-semibold text-base"
          keyboardType={keyboardType}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7a7a7a"
          onChangeText={handleChangeText}
        />
      </View>
    </View>
  );
};

export default IconFormField;
