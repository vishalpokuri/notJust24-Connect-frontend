import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="otp" options={{ headerShown: false }} />
        <Stack.Screen name="add-socials" options={{ headerShown: false }} />

        <Stack.Screen name="create-username" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-profile-photo"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="onboardingComplete"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor="#0a0a0a" style="light" />
    </>
  );
};

export default AuthLayout;
