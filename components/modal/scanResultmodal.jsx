import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { useState } from "react";
import CustomButton from "../../components/ui/customButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";

const ScanResultModal = () => {
  return (
    <View className=" absolute bg-slate-500 w-[90%] h-[40%] items-center justify-center rounded-lg">
      <View className="justify-center items-center  mx-auto z-10">
        <Text className="text-white">You're connecting with Me</Text>
        <View className="mt-4 flex-row">
          <View className="rounded-full bg-slate-300 w-16 h-16 ">
            {/* Filling the TODOimage with the connection backend request */}
          </View>
          <View className="flex-col">
            <Text>Person name</Text>
            <Text>Company</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ScanResultModal;
