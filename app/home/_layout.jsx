import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="homePage" options={{ headerShown: false }} />
        <Stack.Screen name="scanCamera" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#0a0a0a" style="light" />
    </>
  );
};

export default AuthLayout;
