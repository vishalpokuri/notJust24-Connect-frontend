import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const YourConnections = () => {
  return (
    <SafeAreaView className="bg-[#0a0a0a] h-full" style={styles.container}>
      <Text className="text-white">YourConnections</Text>
    </SafeAreaView>
  );
};

export default YourConnections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Background color for contrast
  },
});
