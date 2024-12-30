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

  const submit = async () => {
    setIsSubmitting(true);
    //Handling urls for inputs
    //Check if any of the inputs are not in the url method
    const normalizedGitHubUrl = normalizeSocialUrl(
      "github",
      socialsValue.github
    );
    const normalizedXUrl = normalizeSocialUrl("x", socialsValue.x);
    const normalizedTelegramUrl = normalizeSocialUrl(
      "telegram",
      socialsValue.telegram
    );
    const normalizedLinkedInUrl = normalizeSocialUrl(
      "linkedin",
      socialsValue.linkedin
    );
    setSocialsValue({
      github: normalizedGitHubUrl,
      linkedin: normalizedLinkedInUrl,
      x: normalizedXUrl,
      telegram: normalizedTelegramUrl,
    });
    const email = await getItem("email");

    try {
      const response = await fetch(`${BASE_API_URL}/api/userData/addSocials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...socialsValue, email }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push("./add-profile-photo");
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
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
            placeholder="x.com/......."
            icon="telegram"
            handleChangeText={(e) => {
              setSocialsValue({
                ...socialsValue,
                telegram: e,
              });
            }}
          />
          <IconFormField
            title="Linkedin"
            value={socialsValue.linkedin}
            placeholder="x.com/......."
            icon="linkedin"
            handleChangeText={(e) => {
              setSocialsValue({
                ...socialsValue,
                linkedin: e,
              });
            }}
          />
          <IconFormField
            title="Github"
            value={socialsValue.github}
            placeholder="x.com/......."
            icon="github"
            handleChangeText={(e) => {
              setSocialsValue({
                ...socialsValue,
                github: e,
              });
            }}
          />
          <IconFormField
            title="x"
            value={socialsValue.x}
            placeholder="x.com/......."
            icon="x"
            handleChangeText={(e) => {
              setSocialsValue({
                ...socialsValue,
                x: e,
              });
            }}
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

function normalizeSocialUrl(platform, username) {
  if (!username) {
    return "";
  }
  const platforms = {
    github: "https://github.com/",
    x: "https://x.com/", // Use https://x.com for X (formerly Twitter)
    telegram: "https://t.me/",
    linkedin: "https://linkedin.com/in/",
  };

  if (username.includes("https")) {
    return username;
  }

  if (platforms[platform]) {
    return username.includes(platform)
      ? `https://${username}`
      : `${platforms[platform]}${username}`;
  } else {
    return username;
  }
}
