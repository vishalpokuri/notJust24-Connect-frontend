// HomePage.js
import React, { useCallback, useState } from "react";
import { Svg, Path, Circle } from "react-native-svg";
import {
  ScrollView,
  View,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { BASE_API_URL } from "../../constants/ngrokRoute";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ToggleButton from "../../components/homePageComps/toggleButton";
import Qr from "../../components/homePageComps/Qr";
import Nfc from "../../components/homePageComps/Nfc";
import HomePageHeader from "../../components/homePageComps/header";
import { getItem, setItem } from "../../utils/asyncStorage";
import { useFocusEffect } from "@react-navigation/native";

const HomePage = () => {
  const [isQRmode, setIsQRmode] = useState(true);
  const [pfpURI, setpfpURI] = useState(null);
  const router = useRouter(); // Use the hook here
  const cloudfrontUrl = "https://d1crt8jpz4phpk.cloudfront.net/";
  //Consider fetching the whole data and putting in the async storage here.
  useFocusEffect(
    useCallback(() => {
      const getDetails = async () => {
        try {
          const id = await getItem("userId");
          const response = await axios.get(
            `${BASE_API_URL}/api/userData/fetchData?userId=${id}`
          );
          //setting up the uri of the pfp constantly for unnecessary replacements
          const userData = response.data.userData;
          const updatedPhotoKey = `${cloudfrontUrl}${userData.profilePhotoKey.replace(
            "connectionsapp/",
            ""
          )}`;
          userData.profilePhotoKey = updatedPhotoKey;
          await setItem("userData", userData);

          setpfpURI(userData.profilePhotoKey);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      getDetails();
    })
  );

  const handleToggle = () => {
    setIsQRmode((previous) => !previous);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentWrapper}>
          <HomePageHeader pfpURI={pfpURI} />
          <View style={styles.spacer} />
          {isQRmode ? <Qr /> : <Nfc />}
          <ToggleButton onToggle={handleToggle} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("./scanCamera")} // Updated path format
          >
            <Svg width={35} height={35} viewBox="0 0 24 24" fill="none">
              <Circle
                cx={12}
                cy={12}
                r={4}
                stroke="#ffffff"
                strokeWidth={1.5}
              />
              <Path
                d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                stroke="#ffffff"
                strokeWidth={1.5}
                strokeLinecap="round"
              />
            </Svg>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#000000" barStyle="light-content" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    minHeight: "100%",
  },
  contentWrapper: {
    width: "100%",
    padding: 24,
  },
  spacer: {
    height: 112,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    marginHorizontal: "auto",
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

export default HomePage;
