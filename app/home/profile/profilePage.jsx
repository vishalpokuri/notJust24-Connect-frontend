import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Svg, Path } from "react-native-svg";
import SocialView from "../../../components/profilePageComps/socials";
import { TouchableOpacity } from "react-native";
import CustomButton from "../../../components/ui/customButton";
import { router } from "expo-router";
import { getItem } from "../../../utils/asyncStorage";
import { BASE_API_URL } from "../../../constants/ngrokRoute";
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const cloudfrontUrl = "https://d1crt8jpz4phpk.cloudfront.net/";

  useEffect(() => {
    // Combined async function to handle both userId fetch and user data fetch
    const fetchUserDataAndDetails = async () => {
      try {
        // First get userId
        const id = await getItem("userId");
        if (!id) {
          console.error("No userId found");
          return;
        }

        setUserId(id);

        // Then fetch user details using the id
        const response = await fetch(
          `${BASE_API_URL}/api/userData/fetchData?userId=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const updatedPhotoKey = `${cloudfrontUrl}${data.userData.profilePhotoKey.replace(
          "connectionsapp/",
          ""
        )}`;
        data.userData.profilePhotoKey = updatedPhotoKey;

        setUserData({
          ...data.userData,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserDataAndDetails();
  }, []); // Only run once on mount

  // Add loading state
  if (!userData) {
    return (
      <SafeAreaView className="bg-[#0a0a0a] h-full" style={styles.container}>
        <ActivityIndicator color="white" size={24} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full" style={styles.container}>
      <Image
        source={{ uri: userData.profilePhotoKey }} // Fixed image source
        style={styles.profilePhoto}
      />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.detailsContainer}
      >
        <View>
          <Text className="font-extrabold text-3xl text-white mt-3 mb-2">
            {userData.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="font-extrabold text-lg mb-2 mr-2 text-[#fff]">
              @{" "}
            </Text>
            <Text className="font-bold text-lg mb-2 text-[#aaa]">
              {userData.username}
            </Text>
          </View>
          <View className="flex-row items-center ">
            <View className="mb-3 mr-2">
              <Svg
                width="22px"
                height="22px"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <Path
                  d="M11 20H21V10C21 8.89543 20.1046 8 19 8H15M11 16H11.01M17 16H17.01M7 16H7.01M11 12H11.01M17 12H17.01M7 12H7.01M11 8H11.01M7 8H7.01M15 20V6C15 4.89543 14.1046 4 13 4H5C3.89543 4 3 4.89543 3 6V20H15Z"
                  stroke="#000000"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </Svg>
            </View>
            <Text className="font-bold text-lg mb-3 text-[#aaa]">
              {userData.workplace}
            </Text>
          </View>
          <Text className="text-base text-[#bbb] my-2">
            {userData.description}
          </Text>
          <CustomButton
            title="Show Your Connections"
            handlePress={() => {
              router.push({
                pathname: "/home/profile/yourConnections",
                params: { userData: JSON.stringify(userData), userId: userId },
              });
            }}
          />
          <Text className="text-2xl mt-4 text-white">Your Socials</Text>
          <View className="mt-2 ">
            {userData.socialMediaData?.github && (
              <SocialView
                icon="github"
                text={userData.socialMediaData.github}
              />
            )}
            {userData.socialMediaData?.linkedin && (
              <SocialView
                icon="linkedin"
                text={userData.socialMediaData.linkedin}
              />
            )}
            {userData.socialMediaData?.telegram && (
              <SocialView
                icon="telegram"
                text={userData.socialMediaData.telegram}
              />
            )}
            {userData.socialMediaData?.x && (
              <SocialView icon="x" text={userData.socialMediaData.x} />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfilePage;

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Background color for contrast
  },
  profilePhoto: {
    width: "100%",
    height: height * 0.5, // 40% of the screen height for photo
    position: "absolute",
    top: 0,
    left: 0,
  },
  detailsContainer: {
    marginTop: height * 0.35, // Starts overlaying lower part of photo
    paddingTop: 30, // Adds padding above the text
    backgroundColor: "rgba(0, 0, 0, 1)", // Semi-transparent black for glassmorphism effect
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: height * 0.55, // Cover remaining screen height
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  glassMorphism: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 1,
    marginHorizontal: "auto",
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});
