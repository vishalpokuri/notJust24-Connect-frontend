import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { Svg, Path } from "react-native-svg";
import { router } from "expo-router";
const HomePageHeader = () => {
  const [image, setImage] = useState("");
  return (
    <View className="w-full flex-row items-center justify-between">
      <Text className="font-bold  text-3xl text-white">Homepage</Text>
      <View className="flex-row">
        <TouchableOpacity
          className="w-12 h-12 rounded-full justify-center overflow-hidden flex-row items-center mr-1"
          style={styles.glassContainer}
          onPress={() => router.push("./profile/notificationScreen")}
        >
          <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            id="bell"
            width={20}
            height={18}
            fill="#ffffff"
          >
            <Path d="M455.973 357.336C443.559 350.167 436 336.835 436 322.5V230c0-82.238-55.152-151.593-130.485-173.101A50.47 50.47 0 0 0 306 50c0-27.614-22.386-50-50-50s-50 22.386-50 50c0 2.342.174 4.643.485 6.899C131.151 78.407 76 147.762 76 230v92.5c0 14.335-7.559 27.667-19.973 34.836-11.76 6.791-19.742 19.394-20.019 33.884C35.577 413.738 54.268 432 76.79 432H176c0 44.183 35.817 80 80 80s80-35.817 80-80h99.21c22.523 0 41.214-18.262 40.783-40.781-.278-14.489-8.26-27.093-20.02-33.883z"></Path>
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-12 h-12  rounded-full justify-center overflow-hidden flex-row items-center"
          style={styles.glassContainer}
          onPress={() => {
            router.push("./profile/");
          }}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View className="text-white text-base bg-[#4b4b4b] w-12 h-12 rounded-full justify-center items-center">
              <Text className="text-white">@</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomePageHeader;

const styles = StyleSheet.create({
  glassContainer: {
    backgroundColor: "rgba(76, 76, 76, 1)",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
  },
});
