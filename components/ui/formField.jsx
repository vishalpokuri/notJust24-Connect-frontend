import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const FormField = ({
  title,
  value,
  otherStyles,
  handleChangeText,
  placeholder,
  keyboardType,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text className={`text-base text-gray-100 ${otherStyles}`}>{title}</Text>

      <View className="w-full h-14 px-4 my-1 bg-[#2a2a2a] rounded-xl flex-row items-center">
        <TextInput
          className="flex-1 text-white font-semibold text-base "
          keyboardType={keyboardType}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7a7a7a"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <View>
              {showPassword ? (
                <Text className="text-white">Hide</Text>
              ) : (
                <Text className="text-white">Show</Text>
              )}
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
