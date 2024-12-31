import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Signin from "./signin";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#000000" style="light" />
    </>
  );
};

export default AuthLayout;
