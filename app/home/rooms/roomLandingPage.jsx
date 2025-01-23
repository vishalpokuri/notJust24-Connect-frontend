import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Path } from "react-native-svg";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { router } from "expo-router";
const RoomLandingPage = () => {
  const roomAnimation = useRef(null);
  //do an api call, if the array gets null, show you dont have joined any! div otherwise.
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Rooms</Text>
      <View className="flex justify-center items-center mt-12">
        <Text className=" mx-8 font-bold text-lg text-center text-white">
          You dont have any Virtual Rooms joined, Join one and network!
        </Text>
        <LottieView
          ref={roomAnimation}
          source={require("../../../assets/lottieAnimations/Door.json")}
          autoPlay
          loop
          className="w-[70%] h-[50%]"
        />
        <TouchableOpacity
          style={styles.button}
          className="w-22"
          onPress={() => router.push("./joinRoom")}
        >
          <DoorSvg />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoomLandingPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    padding: 16,
    margin: 12,
  },
  button: {
    backgroundColor: "#4c4c4c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

const DoorSvg = () => {
  return (
    <Svg
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M4 12H20M12 4V20"
        stroke="#fff"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
};
