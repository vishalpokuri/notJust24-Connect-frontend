import { View, Text, Image } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import icons from "../../constants/icons";
const OtherLogger = ({ title }) => {
  return (
    <TouchableOpacity className=" bg-transparent h-[50px] w-full px-16 mt-7 border-[0.5px] border-[#535353] border-solid items-center justify-center rounded-lg flex-row  ">
      <View>
        {title === "Google" ? (
          <Image
            source={icons.google}
            className="w-[25px] h-[25px] rounded-full mr-8"
            resizeMode="contain"
          />
        ) : (
          <Image
            source={icons.solana}
            className="w-[30px] h-[30px] rounded-full mr-9"
            resizeMode="contain"
          />
        )}
      </View>

      <Text className="text-base text-white font-bold">
        Continue with {title}
      </Text>
    </TouchableOpacity>
  );
};

export default OtherLogger;
