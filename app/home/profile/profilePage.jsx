import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Svg, Path, G } from "react-native-svg";
import { ScrollView } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SocialView from "../../../components/profilePageComps/socials";
import { TouchableOpacity } from "react-native";
import CustomButton from "../../../components/ui/customButton";
import { router, useFocusEffect } from "expo-router";
import { getItem } from "../../../utils/asyncStorage";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const fetchUserDataAndDetails = async () => {
    try {
      // First get userId
      const id = await getItem("userId");
      if (!id) {
        console.error("No userId found");
        return;
      }
      setUserId(id);
      // Then fetch user details
      const data = await getItem("userData");
      setUserData({
        ...data,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //Fetch everytime on focus
  useFocusEffect(
    useCallback(() => {
      fetchUserDataAndDetails();
    }, [])
  );
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
          <View className="flex-row justify-between">
            {/* TODO: check this userData, because of the asyncstorage saving */}
            <CustomButton
              title="Show Your Connections"
              handlePress={() => {
                router.push({
                  pathname: "/home/profile/yourConnections",
                  params: {
                    userData: JSON.stringify(userData),
                    userId: userId,
                  },
                });
              }}
              containerStyles="w-[80%]"
            />
            <TouchableOpacity
              title=""
              className={`bg-[#444] px-4 my-4 h-[50px] justify-center items-center rounded-lg flex-row w-[15%] `}
              onPress={() => {
                router.push(`/home/profile/editScreen?userId=${userId}`);
              }}
            >
              <Svg
                fill="#fff"
                width="24px"
                height="24px"
                viewBox="0 0 528.899 528.899"
              >
                <G>
                  <Path
                    d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981
		c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611
		C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069
		L27.473,390.597L0.3,512.69z"
                  />
                </G>
              </Svg>
            </TouchableOpacity>
          </View>
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
