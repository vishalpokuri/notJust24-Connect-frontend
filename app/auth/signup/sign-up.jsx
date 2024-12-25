import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import OrDivider from "../../../components/ui/orDivider";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../../components/ui/customButton";
import FormField from "../../../components/ui/formField";
import React, { useState } from "react";
import OtherLogger from "../../../components/ui/otherLogger";
import { Link, router } from "expo-router";
import { BASE_API_URL } from "../../../constants/ngrokRoute";
import { setItem } from "../../../utils/asyncStorage";

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    setIsSubmitting(true);
    //get the onboarding
    try {
      //future usage
      await setItem("email", form.email);

      const response = await fetch(`${BASE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setTimeout(() => {
          router.push("./otp");
        }, 500);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Network request failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6 min-h-[85vh]">
          <Text className="text-3xl my-6 text-left font-semibold text-white">
            Get your free Account
          </Text>
          <OtherLogger title="Google" />
          <OtherLogger title="Solana" />
          <OrDivider />
          <FormField
            title="Work Email"
            value={form.email}
            placeholder="hello123@gmail.com"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4"
            keyboardType="email-address"
          />
          <FormField
            title="Set Password"
            value={form.password}
            placeholder=""
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-2"
            keyboardType="email-address"
          />

          <CustomButton
            title="Continue with Email"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View className="justify-center  pt-5 flex-row gap-2 items-center">
            <Text className="text-base text-gray-100">
              Already have an account?
            </Text>

            <Link href="/auth/signin" className="text-[#a0f963] text-base">
              Login
            </Link>
          </View>
          {/* Or section, login with google and Login with Solana */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
