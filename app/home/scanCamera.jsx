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
import ScanResultModal from "../../components/modal/scanResultmodal";

const ScanCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);
  if (!permission) {
    return (
      <SafeAreaView className="bg-[#0a0a0a] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <ActivityIndicator size="large" />
        </ScrollView>
      </SafeAreaView>
    );
  }
  if (!permission.granted) {
    return (
      <SafeAreaView className="bg-[#0a0a0a] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="justify-center items-center w-[90%] h-[90%] mx-auto">
            <Text className="text-white font-semibold text-lg">
              Camera access is required to scan QR Code
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
  const onBarcodeScanned = async (data) => {
    if (!scanningEnabled) return;
    try {
      Vibration.vibrate();
      setScanningEnabled(false);
      console.log(data);
    } catch (error) {
      alert("Error: ", "Failed to scan QR, try again");
      setScanningEnabled((prev) => !prev);
    }
  };
  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="justify-center items-center m-auto">
          <Text className="text-white font-bold text-lg mb-2">Scan the QR</Text>
          <CameraView
            className="w-96 h-96 rounded-xl"
            facing="back"
            onBarcodeScanned={onBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScanCamera;

const styles = StyleSheet.create({
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
  buttonText: {
    color: "black",
    fontSize: 14,
    fontWeight: "600",
  },
});
