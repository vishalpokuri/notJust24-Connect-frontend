import { View, Text } from "react-native";
import React, { useState } from "react";
import FormField from "../../../../components/ui/formField";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../../components/ui/customButton";
import { BASE_API_URL } from "../../../../constants/ngrokRoute";
import { router, useLocalSearchParams } from "expo-router";
import OTPResend from "../../../../components/ui/OTPresend";
import { getItem, setItem } from "../../../../utils/asyncStorage";
import { registerIndieID } from "native-notify";

const Otp = () => {
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const otpToken = params.otpToken;

  const handleNavigation = (level, userId) => {
    switch (level) {
      case 1:
        router.push("./create-username");
        break;
      case 2:
        router.push("./add-socials");
        break;
      case 3:
        router.push("./add-profile-photo");
        break;
      case 4:
        router.replace(`/home/homePage?userId=${userId}`);
        break;
      default:
        console.warn("Unknown onboarding level:", level);
    }
  };

  const submit = async () => {
    if (isSubmitting || !otpValue) return;

    setIsSubmitting(true);

    try {
      const email = await getItem("email");
      const response = await fetch(`${BASE_API_URL}/api/auth/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpValue, otpToken }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      await Promise.all([
        registerIndieID(data.userId, 25674, "6Kka30YI9fQ1rmbvtyUDkX"),
        setItem("userId", data.userId),
        setItem("accessToken", data.accessToken),
      ]);

      handleNavigation(data.level, data.userId);
    } catch (error) {
      alert(error.message || "An error occurred during verification");
      console.error("Error submitting OTP: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/auth/resendotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      alert("OTP resent successfully");
    } catch (error) {
      alert(error.message || "Failed to resend OTP");
      console.error("Error resending OTP:", error);
    }
  };

  return (
    <SafeAreaView className="bg-[#000000] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6 min-h-[85vh]">
          <Text className="text-3xl my-6 text-left font-semibold text-white">
            Enter OTP
          </Text>
          <FormField
            title="OTP"
            value={otpValue}
            handleChangeText={setOtpValue}
            placeholder=""
            otherStyles="mt-4"
            keyboardType="number-pad"
            editable={!isSubmitting}
          />
          <CustomButton
            title="Continue"
            handlePress={submit}
            isLoading={isSubmitting}
            disabled={isSubmitting || !otpValue}
          />
          <OTPResend onResend={resend} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Otp;
