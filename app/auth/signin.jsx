import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import OrDivider from "../../components/ui/orDivider";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/ui/customButton";
import FormField from "../../components/ui/formField";
import { useState } from "react";
import OtherLogger from "../../components/ui/otherLogger";
import { Link, router } from "expo-router";
import { BASE_API_URL } from "../../constants/ngrokRoute";
import { setItem } from "../../utils/asyncStorage";

export default function Signin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    try {
      //future use
      await setItem("email", form.email);

      setIsSubmitting(true);
      const response = await fetch(`${BASE_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setTimeout(() => {
          router.push("./signup/otp");
          setIsSubmitting(false);
        }, 500);
      }
    } catch (err) {
      console.error("Error logging in: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full p-6 min-h-[85vh]">
          <Text className="text-3xl my-6 text-left font-semibold text-white">
            Log in to Connect
          </Text>
          <FormField
            title="Email"
            value={form.email}
            placeholder="hello123@gmail.com"
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-4"
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-4"
          />

          <TouchableOpacity>
            <Text className="text-[#a0f963] text-base mt-4">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <CustomButton
            title="Login"
            handlePress={submit}
            isLoading={isSubmitting}
          />

          <View className="justify-center  pt-5 flex-row gap-2 items-center">
            <Text className="text-base text-gray-100">
              Don't have an account?
            </Text>

            <Link
              href="/auth/signup/sign-up"
              className="text-[#a0f963] text-base"
            >
              Sign Up
            </Link>
          </View>
          {/* Or section, login with google and Login with Solana */}
          <OrDivider />
          <OtherLogger title="Google" />
          <OtherLogger title="Solana" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
