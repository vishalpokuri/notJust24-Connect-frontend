import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import { BASE_API_URL } from "../../../../constants/ngrokRoute";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import CustomButton from "../../../../components/ui/customButton";
import { router } from "expo-router";
import { getItem } from "../../../../utils/asyncStorage";

const AddProfilePhoto = () => {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    workplace: "",
    description: "",
  });

  useEffect(() => {
    (async () => {
      const status = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status.status === "granted");
    })();
  }, []);

  // Function to open the image picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1], // square aspect ratio
      quality: 0.5,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        name: asset.uri.split("/").pop(), // Extracting file name
        type: asset.type || "image/jpeg", // Assuming JPEG if type is not provided
      });
    }
  };

  const submit = async () => {
    setIsSubmitting(true);
    if (selectedImage) {
      const accessToken = await getItem("accessToken");

      try {
        const response = await fetch(
          `${BASE_API_URL}/api/aws/presignedurl?filename=${selectedImage.name}&mimetype=${selectedImage.type}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.presignedUrl) {
          const uploadResponse = await fetch(data.presignedUrl, {
            method: "PUT",
            headers: {
              "Content-Type": selectedImage.type,
            },
            body: await fetch(selectedImage.uri).then((res) => res.blob()),
          });

          if (uploadResponse.status === 200) {
            const email = await getItem("email");
            const keyUploadResponse = await fetch(
              `${BASE_API_URL}/api/aws/filekey`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  key: data.key,
                  email,
                }),
              }
            );

            if (keyUploadResponse.ok) {
              console.log("Upload Successful");
              router.push("./onboardingComplete");
            } else {
              console.error("Error saving file key to backend.");
            }
          } else {
            console.error("File upload failed.");
          }
        }
      } catch (error) {
        console.error("Error during file upload process: ", error);
      }
    } else {
      console.error("No image selected.");
    }
    setIsSubmitting(false);
  };

  if (hasGalleryPermission === false) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white">
          Permission to access gallery is required.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ height: "100%" }}
      >
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
                    source={{ uri: selectedImage.uri }}
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
    height: 50,
    width: "100%",
    padding: 10,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 16,
    borderRadius: 8,
    textAlignVertical: "top",
  },
  textarea2: {
    height: 150,
    width: "100%",
    padding: 10,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 16,
    borderRadius: 8,
    textAlignVertical: "top",
  },
});
