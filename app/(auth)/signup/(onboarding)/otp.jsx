import { View, Text } from "react-native";
import React, { useState } from "react";
import FormField from "../../../../components/ui/formField";
import { ScrollView } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../../components/ui/customButton";
import { BASE_API_URL } from "../../../../constants/ngrokRoute";
import { router } from "expo-router";
import OTPResend from "../../../../components/ui/OTPresend";
import { setItem } from "../../../../utils/asyncStorage";
const Otp = () => {
  const [otpValue, setOtpValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${BASE_API_URL}/api/auth/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpValue }),
      });
      const data = await response.json();
      if (response.ok) {
        await setItem("userId", data.userId);
        router.push("./create-username");
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error("Error submitting OTP: ", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      const response = await fetch(
        "https://376e-36-255-16-55.ngrok-free.app/api/auth/resendotp",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
      } else {
        console.log("Response: ", response.ok, "otp working");
      }
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6 min-h-[85vh]">
          <Text className="text-3xl my-6 text-left font-semibold text-white">
            Enter OTP
          </Text>
          <FormField
            title="OTP"
            value={otpValue}
            handleChangeText={(e) => {
              setOtpValue(e);
            }}
            placeholder=""
            otherStyles="mt-4"
            keyboardType="number-pad"
          />
          <CustomButton
            title="Continue"
            handlePress={submit}
            isLoading={isSubmitting}
          />
          <OTPResend onResend={resend} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Otp;
