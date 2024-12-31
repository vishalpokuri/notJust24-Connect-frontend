import { View, Text } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../../components/ui/customButton";
import { router } from "expo-router";
import IconFormField from "../../../../components/ui/iconFormField";
import { BASE_API_URL } from "../../../../constants/ngrokRoute";
import { getItem } from "../../../../utils/asyncStorage";

const AddSocials = () => {
  const [socialsValue, setSocialsValue] = useState({
    telegram: "",
    github: "",
    linkedin: "",
    x: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeSocialUrl = (platform, username) => {
    if (!username) return "";

    const platforms = {
      github: "https://github.com/",
      x: "https://x.com/",
      telegram: "https://t.me/",
      linkedin: "https://linkedin.com/in/",
    };

    if (username.startsWith("http")) return username.trim(); // Return if already a URL
    return `${platforms[platform]}${username.trim()}`;
  };

  const submit = async () => {
    setIsSubmitting(true);

    try {
      const email = await getItem("email");

      // Normalize all social media URLs
      const normalizedSocials = {
        github: normalizeSocialUrl("github", socialsValue.github),
        linkedin: normalizeSocialUrl("linkedin", socialsValue.linkedin),
        x: normalizeSocialUrl("x", socialsValue.x),
        telegram: normalizeSocialUrl("telegram", socialsValue.telegram),
      };

      const response = await fetch(`${BASE_API_URL}/api/userData/addSocials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...normalizedSocials, email }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("./add-profile-photo");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ height: "100%" }}
      >
        <View className="w-full p-6 min-h-[85vh]">
          <Text className="text-3xl my-6 text-left font-semibold text-white">
            Add socials
          </Text>
          <IconFormField
            title="Telegram"
            value={socialsValue.telegram}
            placeholder=""
            icon="telegram"
            handleChangeText={(e) =>
              setSocialsValue({ ...socialsValue, telegram: e })
            }
          />
          <IconFormField
            title="LinkedIn"
            value={socialsValue.linkedin}
            placeholder=""
            icon="linkedin"
            handleChangeText={(e) =>
              setSocialsValue({ ...socialsValue, linkedin: e })
            }
          />
          <IconFormField
            title="GitHub"
            value={socialsValue.github}
            placeholder=""
            icon="github"
            handleChangeText={(e) =>
              setSocialsValue({ ...socialsValue, github: e })
            }
          />
          <IconFormField
            title="X"
            value={socialsValue.x}
            placeholder=""
            icon="x"
            handleChangeText={(e) => setSocialsValue({ ...socialsValue, x: e })}
          />
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

export default AddSocials;
