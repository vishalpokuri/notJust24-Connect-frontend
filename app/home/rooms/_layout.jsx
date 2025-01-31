import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="roomLandingPage" options={{ headerShown: false }} />
        <Stack.Screen name="joinRoom" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#000000" style="light" />
    </>
  );
};

export default AuthLayout;
