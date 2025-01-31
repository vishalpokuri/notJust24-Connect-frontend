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
import { Svg, Path } from "react-native-svg";
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

      if (response.ok) {
        const profilePhotoKey = data.profilePhotoKey.replace(
          "connectionsapp/",
          ""
        );
        //Step-2: Popup a modal with animation of connection
        setisModalVisible((prev) => !prev);
        setProfileUri(`${cdn}/${profilePhotoKey}`);
        setName(data.name);
        setTimeout(() => {
          router.push("./takeSelfie");
          setScanningEnabled(true);
        }, 2500);
      } else {
        setisModalVisible((prev) => !prev);
        setProfileUri(`${cdn}/profiles/dogCunning.jpg`);
        setName("Are you sure he's a Connect user Dawg?");
        setTimeout(() => {
          router.back();
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
    } catch (error) {
      alert("Error: Failed to scan QR, try again");
      console.error(error);
      setScanningEnabled(true);
    }
  };

  return (
    <SafeAreaView className="bg-[#000] h-full">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ height: "100%" }}
      >
        <QrSvg />
        <Text className=" text-white font-medium text-3xl ml-8 mt-4 w-[90%] ">
          Scan the <Text className="text-[#9CCC65]">QR Code</Text> on your
          connection's phone
        </Text>
        <Text className=" text-[#bbb] font-semibold text-lg mt-3 ml-8 ">
          Position the code in the frame
        </Text>

        <View className="justify-center items-center mx-auto my-[25%]">
          <CameraView
            className="w-80 h-80 rounded-xl border-4 border-[#9CCC65]"
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

const QrSvg = () => {
  return (
    <View className="ml-8 mt-16">
      <Svg
        width="50px"
        height="50px"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          d="M23 4C23 2.34315 21.6569 1 20 1H16C15.4477 1 15 1.44772 15 2C15 2.55228 15.4477 3 16 3H20C20.5523 3 21 3.44772 21 4V8C21 8.55228 21.4477 9 22 9C22.5523 9 23 8.55228 23 8V4Z"
          fill="#9CCC65"
        />
        <Path
          d="M23 16C23 15.4477 22.5523 15 22 15C21.4477 15 21 15.4477 21 16V20C21 20.5523 20.5523 21 20 21H16C15.4477 21 15 21.4477 15 22C15 22.5523 15.4477 23 16 23H20C21.6569 23 23 21.6569 23 20V16Z"
          fill="#9CCC65"
        />
        <Path
          d="M4 21C3.44772 21 3 20.5523 3 20V16C3 15.4477 2.55228 15 2 15C1.44772 15 1 15.4477 1 16V20C1 21.6569 2.34315 23 4 23H8C8.55228 23 9 22.5523 9 22C9 21.4477 8.55228 21 8 21H4Z"
          fill="#9CCC65"
        />
        <Path
          d="M1 8C1 8.55228 1.44772 9 2 9C2.55228 9 3 8.55228 3 8V4C3 3.44772 3.44772 3 4 3H8C8.55228 3 9 2.55228 9 2C9 1.44772 8.55228 1 8 1H4C2.34315 1 1 2.34315 1 4V8Z"
          fill="#9CCC65"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M11 6C11 5.44772 10.5523 5 10 5H6C5.44772 5 5 5.44772 5 6V10C5 10.5523 5.44772 11 6 11H10C10.5523 11 11 10.5523 11 10V6ZM9 7.5C9 7.22386 8.77614 7 8.5 7H7.5C7.22386 7 7 7.22386 7 7.5V8.5C7 8.77614 7.22386 9 7.5 9H8.5C8.77614 9 9 8.77614 9 8.5V7.5Z"
          fill="#9CCC65"
        />
        <Path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M18 13C18.5523 13 19 13.4477 19 14V18C19 18.5523 18.5523 19 18 19H14C13.4477 19 13 18.5523 13 18V14C13 13.4477 13.4477 13 14 13H18ZM15 15.5C15 15.2239 15.2239 15 15.5 15H16.5C16.7761 15 17 15.2239 17 15.5V16.5C17 16.7761 16.7761 17 16.5 17H15.5C15.2239 17 15 16.7761 15 16.5V15.5Z"
          fill="#9CCC65"
        />
        <Path
          d="M14 5C13.4477 5 13 5.44772 13 6C13 6.55229 13.4477 7 14 7H16.5C16.7761 7 17 7.22386 17 7.5V10C17 10.5523 17.4477 11 18 11C18.5523 11 19 10.5523 19 10V6C19 5.44772 18.5523 5 18 5H14Z"
          fill="#9CCC65"
        />
        <Path
          d="M14 8C13.4477 8 13 8.44771 13 9V10C13 10.5523 13.4477 11 14 11C14.5523 11 15 10.5523 15 10V9C15 8.44772 14.5523 8 14 8Z"
          fill="#9CCC65"
        />
        <Path
          d="M6 13C5.44772 13 5 13.4477 5 14V16C5 16.5523 5.44772 17 6 17C6.55229 17 7 16.5523 7 16V15.5C7 15.2239 7.22386 15 7.5 15H10C10.5523 15 11 14.5523 11 14C11 13.4477 10.5523 13 10 13H6Z"
          fill="#9CCC65"
        />
        <Path
          d="M10 17C9.44771 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19C10.5523 19 11 18.5523 11 18C11 17.4477 10.5523 17 10 17Z"
          fill="#9CCC65"
        />
      </Svg>
    </View>
  );
};
