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
          onPress={() => router.push("./rooms/roomLandingPage")}
        >
          <Svg
            fill="#ffffff"
            width={20}
            height={20}
            version="1.1"
            id="Capa_1"
            viewBox="0 0 53.25 53.25"
          >
            <Path
              d="M43.375,0h-33.5C9.774,0,9.676,0.011,9.58,0.03c-0.001,0-0.003,0-0.004,0c-0.108,0.022-0.21,0.057-0.307,0.1
	C9.244,0.141,9.222,0.156,9.198,0.169c-0.071,0.036-0.14,0.076-0.204,0.123C8.982,0.3,8.969,0.304,8.959,0.313
	C8.939,0.327,8.925,0.347,8.906,0.363c-0.053,0.045-0.103,0.093-0.15,0.146C8.73,0.539,8.706,0.568,8.682,0.6
	C8.64,0.655,8.603,0.714,8.569,0.776C8.551,0.808,8.532,0.839,8.517,0.872C8.485,0.942,8.46,1.015,8.439,1.09
	c-0.008,0.028-0.02,0.055-0.026,0.084C8.389,1.28,8.375,1.388,8.375,1.5v43.378c0,0.156,0.031,0.303,0.075,0.444
	c0.008,0.025,0.014,0.05,0.023,0.074c0.05,0.134,0.117,0.258,0.201,0.371c0.015,0.02,0.031,0.038,0.047,0.057
	c0.093,0.113,0.198,0.217,0.32,0.299c0.001,0.001,0.002,0.001,0.004,0.002c0.125,0.083,0.265,0.142,0.412,0.185
	c0.014,0.004,0.024,0.014,0.038,0.017l26.199,6.872c0.126,0.033,0.253,0.049,0.38,0.049c0.328,0,0.651-0.108,0.917-0.313
	c0.368-0.284,0.583-0.723,0.583-1.188V8.372c0-0.682-0.46-1.278-1.12-1.451L21.505,3h20.37v41.878c0,0.829,0.671,1.5,1.5,1.5
	c0.829,0,1.5-0.671,1.5-1.5V1.5C44.875,0.671,44.204,0,43.375,0z M23.933,28.838c0.228-0.797,1.06-1.256,1.855-1.03l7,2
	c0.796,0.228,1.258,1.058,1.03,1.854c-0.188,0.659-0.789,1.088-1.441,1.088c-0.137,0-0.275-0.019-0.413-0.058l-7-2
	C24.167,30.465,23.705,29.634,23.933,28.838z"
            />
          </Svg>
        </TouchableOpacity>
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
            router.push("./profile/profilePage");
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
