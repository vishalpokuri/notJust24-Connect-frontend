import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { BASE_API_URL } from "../../../constants/ngrokRoute";

import { getItem } from "../../../utils/asyncStorage";

const EditScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    uri: "",
    name: "",
    type: "image",
  });
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    workplace: "",
    description: "",
    socialMediaData: {
      github: "",
      linkedin: "",
      telegram: "",
      x: "",
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getItem("userData");
        const fullPhotoUrl = data.profilePhotoKey;

        setSelectedImage({
          uri: fullPhotoUrl,
          name: fullPhotoUrl.split("/").pop(), // Extracting file name
          type: "image", // Assuming JPEG if type is not provided
        });

        setFormData({
          name: data.name,
          username: data.username,
          workplace: data.workplace,
          description: data.description,
          socialMediaData: {
            github: data.socialMediaData?.github || "",
            linkedin: data.socialMediaData?.linkedin || "",
            telegram: data.socialMediaData?.telegram || "",
            x: data.socialMediaData?.x || "",
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load user data");
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Sorry, we need camera roll permissions to change your photo!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        selectionLimit: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setPhotoLoading(true);
        const asset = result.assets[0];
        setSelectedImage({
          uri: asset.uri,
          name: asset.uri.split("/").pop(), // Extracting file name
          type: asset.type || "image", // Assuming JPEG if type is not provided
        });

        setPhotoLoading(false);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image");
      setPhotoLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);

    try {
      const accessToken = await getItem("accessToken");
      const response = await fetch(
        `${BASE_API_URL}/api/aws/presignedurlProfile?mimetype=${selectedImage.type}`,
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
            `${BASE_API_URL}/api/aws/edit`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                key: data.key,
                ...formData,
                email,
              }),
            }
          );
          if (keyUploadResponse.ok) {
            console.log("Upload Successful");
            //TODO: Show the modal of Success
            alert("success");
            router.back();
          } else {
            console.error("Error saving file key to backend.");
          }
        } else {
          console.error("File upload failed.");
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ label, value, onChangeText, multiline = false }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#666"
        multiline={multiline}
        className="text-white"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          className="ml-auto"
          onPress={handleUpdateProfile}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="black" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Photo Section */}
        <View style={styles.photoContainer}>
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.profilePhoto}
          />
          <TouchableOpacity
            style={styles.photoButton}
            onPress={pickImage}
            disabled={photoLoading}
          >
            {photoLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.photoButtonText}>Change Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        <InputField
          label="Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
        />

        <InputField
          label="Username"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
        />

        <InputField
          label="Workplace"
          value={formData.workplace}
          onChangeText={(text) => setFormData({ ...formData, workplace: text })}
        />

        <InputField
          label="Description"
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          multiline
        />

        <Text style={styles.sectionTitle}>Social Media Links</Text>

        <InputField
          label="GitHub"
          value={formData.socialMediaData.github}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              socialMediaData: { ...formData.socialMediaData, github: text },
            })
          }
        />

        <InputField
          label="LinkedIn"
          value={formData.socialMediaData.linkedin}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              socialMediaData: { ...formData.socialMediaData, linkedin: text },
            })
          }
        />

        <InputField
          label="Telegram"
          value={formData.socialMediaData.telegram}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              socialMediaData: { ...formData.socialMediaData, telegram: text },
            })
          }
        />

        <InputField
          label="X (Twitter)"
          value={formData.socialMediaData.x}
          onChangeText={(text) =>
            setFormData({
              ...formData,
              socialMediaData: { ...formData.socialMediaData, x: text },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  scrollContainer: {
    padding: 20,
  },
  saveButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 40,
    alignItems: "center",
  },
  saveButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    width: "50%",
  },
  photoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  photoButton: {
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  photoButtonText: {
    color: "white",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginTop: 20,
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#aaa",
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 12,
    color: "white",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default EditScreen;
