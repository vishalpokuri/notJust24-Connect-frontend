import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="profilePage" options={{ headerShown: false }} />
        <Stack.Screen name="yourConnections" options={{ headerShown: false }} />
        <Stack.Screen name="notificationScreen" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#0a0a0a" style="light" />
    </>
  );
};

export default AuthLayout;
