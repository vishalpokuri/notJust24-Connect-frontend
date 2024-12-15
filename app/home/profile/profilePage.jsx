import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { ScrollView } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "../../../constants/images";
import SocialView from "../../../components/profilePageComps/socials";
import { TouchableOpacity } from "react-native";
import CustomButton from "../../../components/ui/customButton";
import { router } from "expo-router";
const ProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState("");
  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full" style={styles.container}>
      <Image
        source={images.me} // Replace with your image URL
        style={styles.profilePhoto}
      />

      {/* Scrollable Details Section */}
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        <View>
          <Text className="font-bold text-4xl text-white mt-3 mb-2">
            Vishal Pokuri
          </Text>
          <Text className="font-bold text-lg mb-3 text-[#bbb]">
            @vishal_pokuri99
          </Text>
          <Text className="text-base text-[#bbb] my-2">
            Web3 developer, NFT enthusiast, and blockchain explorer. Passionate
            about building decentralized solutions for a better future.
          </Text>
          {/* Add more information here */}
          <CustomButton
            title="Show Your Connections"
            handlePress={() => router.push("/home/profile/yourConnections")}
          />
          <Text className="text-2xl mt-6 text-white">Your Socials</Text>
          <View className="mt-2 ">
            <SocialView icon="github" />
            <SocialView icon="linkedin" />
            <SocialView icon="telegram" />
            <SocialView icon="x" />
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
