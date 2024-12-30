import { useEffect, useRef, useState } from "react";
import { CameraView } from "expo-camera";
import { useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  ScrollView,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { router } from "expo-router";
import AddNotes from "./addNotes";
const TakeSelfieScreen = () => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState({
    height: "",
    width: "",
    uri: "",
  });
  const [type, setType] = useState("front");

  if (image) {
    return (
      <AddNotes
        height={imageData.height}
        width={imageData.width}
        uri={imageData.uri}
        setImage={setImage}
      />
    );
  }

  if (!permission) {
    return (
      <SafeAreaView className="bg-[#0a0a0a] h-full">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ height: "100%" }}
        >
          <ActivityIndicator size="large" />
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView className="bg-[#0a0a0a] h-full">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ height: "100%" }}
        >
          <View className="justify-center items-center w-[90%] h-[90%] mx-auto">
            <Text className="text-white font-semibold text-lg">
              Camera access is required to take Selfie
            </Text>
            <CustomButton
              title="Grant Permission"
              handlePress={requestPermission}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImageData({ height: data.height, width: data.width, uri: data.uri });
        setImage(data.uri);
      } catch (err) {
        console.error(err);
      }
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-black items-center ">
      <CameraView
        facing={type}
        className="w-[90%] h-[90%] m-auto rounded-lg"
        ref={cameraRef}
      />
      <TouchableOpacity onPress={takePicture}>
        <View className="w-16 h-16 rounded-full bg-white mb-2"></View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TakeSelfieScreen;

const styles = StyleSheet.create({
  shutter: {
    position: "absolute",
    bottom: 20 /* Distance from the bottom */,
    left: "50%",
    transform: [{ translateX: -50 }] /* Centers the element horizontally */,
    /* Optional styling */
    width: 64,
    height: 64,
    backgroundColor: "white",
  },
});
