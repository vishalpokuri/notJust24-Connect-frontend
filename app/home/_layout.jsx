import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "000",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="homePage"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "000",
          }}
        />
        <Stack.Screen
          name="scanCamera"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "000",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="takeSelfie"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "000",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="addNotes"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "000",
            statusBarStyle: "dark",
          }}
        />
        <Stack.Screen
          name="rooms"
          options={{
            headerShown: false,
            statusBarBackgroundColor: "000",
            statusBarStyle: "dark",
          }}
        />
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
