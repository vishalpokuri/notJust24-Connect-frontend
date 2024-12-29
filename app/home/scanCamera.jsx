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
import { BASE_API_URL } from "../../constants/ngrokRoute";
import ScanResultModal from "../../components/modal/scanResultModal";
import { router } from "expo-router";
import { setItem } from "../../utils/asyncStorage";

const ScanCamera = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanningEnabled, setScanningEnabled] = useState(true);
  //For modal
  const [isModalVisible, setisModalVisible] = useState(false);
  const [name, setName] = useState(false);
  const [profileUri, setProfileUri] = useState(false);
  const cdn = "https://d1crt8jpz4phpk.cloudfront.net";
  const toggleModal = () => {
    setisModalVisible(!isModalVisible);
  };

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

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/QR/userFetch?userId=${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store", // Disable fetch cache
        }
      );

      await setItem("userId2", userId);

      const data = await response.json();
      const profilePhotoKey = data.profilePhotoKey.replace(
        "connectionsapp/",
        ""
      );

      if (response.ok) {
        //Step-2: Popup a modal with animation of connection
        setisModalVisible((prev) => !prev);
        setProfileUri(`${cdn}/${profilePhotoKey}`);
        setName(data.name);
        setTimeout(() => {
          router.push("./takeSelfie");
          setScanningEnabled(true);
        }, 2500);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onBarcodeScanned = async (data) => {
    if (!scanningEnabled) return;

    try {
      Vibration.vibrate();
      setScanningEnabled(false);
      //After scanning

      //Step-1: Fetch the information of the person
      await fetchUserData(data.data);

      console.log(data.data);
    } catch (error) {
      alert("Error: Failed to scan QR, try again");
      console.error(error);
      setScanningEnabled(true);
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
          <ScanResultModal
            name={name}
            isVisible={isModalVisible}
            onClose={toggleModal}
            profileUri={profileUri}
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
