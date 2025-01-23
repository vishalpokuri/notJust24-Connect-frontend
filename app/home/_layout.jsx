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
        <Stack.Screen name="takeSelfie" options={{ headerShown: false }} />
        <Stack.Screen name="addNotes" options={{ headerShown: false }} />
        <Stack.Screen name="rooms" options={{ headerShown: false }} />
        <Stack.Screen
          name="addNotesfromNotif"
          options={{ headerShown: false }}
        />
      </Stack>
      <StatusBar backgroundColor="#000000" style="light" />
    </>
  );
};

export default AuthLayout;
