import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { BASE_API_URL } from "../../../../constants/ngrokRoute";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../../../components/ui/customButton";
import { router } from "expo-router";
import { getItem } from "../../../../utils/asyncStorage";
const AddProfilePhoto = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    workplace: "",
    description: "",
  });

  // Function to open the image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1], // square aspect ratio
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    if (selectedImage) {
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/aws/presignedurl?filename=${selectedImage.name}&mimetype=${selectedImage.type}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();

        if (data.presignedURL) {
          try {
            const response = await fetch(data.presignedURL, {
              method: "PUT",
              headers: {
                "Content-Type": encodeURI(selectedImage.type),
              },
              body: selectedImage,
            });

            if (response.status == 200) {
              const email = await getItem("email");
              try {
                const response = await fetch(
                  `${BASE_API_URL}/api/aws/filekey`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: {
                      key: data.key,
                      email,
                    },
                  }
                );
                if (response.ok) {
                  console.log("Upload Successful");
                  router.push("./onboardingComplete");
                }
              } catch (error) {
                console.error("Error uploading key");
              }
            } else {
              console.log("Upload failed");
            }
          } catch (error) {
            console.log("Unable to upload file", error);
          }
        }
      } catch (error) {
        console.log("Unable to get presignedURL: ", error);
      }
    }
    // Handle submission logic here
    // Uploading the pfp

    // For now, reset the submit button after 2 seconds for demonstration
    // setTimeout(() => setIsSubmitting(false), 2000);
  };

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6 min-h-[85vh]">
          <Text className="text-3xl mt-6 mb-2 text-left font-semibold text-white">
            About Yourself
          </Text>
          <Text className="text-base mb-6 text-left font-semibold text-[#888]">
            Final step, We Promise !!
          </Text>
          <View className="items-center">
            <TouchableOpacity onPress={pickImage} className="mb-4">
              <View className="w-32 h-32 bg-gray-700 rounded-full justify-center items-center overflow-hidden">
                {selectedImage ? (
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-white text-base">Upload Photo</Text>
                )}
              </View>
            </TouchableOpacity>
            <TextInput
              style={styles.textarea}
              placeholder="Company / Project"
              className="border-[0.5px] border-solid border-[#888] rounded-md h-9 my-2"
              placeholderTextColor="#888"
              value={form.workplace}
              onChangeText={(e) => {
                setForm({ ...form, workplace: e });
              }}
            />
            <TextInput
              style={styles.textarea2}
              multiline
              numberOfLines={6}
              placeholder="Who Am I?"
              className="border-[0.5px] border-solid border-[#888] rounded-md"
              placeholderTextColor="#888"
              value={form.description}
              onChangeText={(e) => {
                setForm({ ...form, description: e });
              }}
            />
          </View>

          <CustomButton
            title="Continue"
            handlePress={submit}
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddProfilePhoto;
const styles = StyleSheet.create({
  textarea: {
    height: 50, // You can adjust the height as needed
    width: "100%",
    padding: 10,

    backgroundColor: "#222",
    color: "#fff",
    fontSize: 16,
    borderRadius: 8,
    textAlignVertical: "top", // Keeps text at the top of the textarea
  },
  textarea2: {
    height: 150, // You can adjust the height as needed
    width: "100%",
    padding: 10,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 16,
    borderRadius: 8,
    textAlignVertical: "top", // Keeps text at the top of the textarea
  },
});

//The problem is with the presigned url, ended at checking the query parameters TODO
