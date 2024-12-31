import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useEffect } from "react";
import { checkToken } from "../utils/jwt";

export default function RootLayout() {
  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkToken();
      if (!isValid && !window.location.pathname.includes("/auth")) {
        router.replace("/auth/login");
      }
    };
    checkAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>
      <StatusBar backgroundColor="#000000" style="light" />
    </GestureHandlerRootView>
  );
}
