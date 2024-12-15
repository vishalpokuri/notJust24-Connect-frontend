import { View, Text, StyleSheet } from "react-native";
import React from "react";

const OrDivider = () => {
  return (
    <View className="relative items-center mt-6 w-full">
      <View
        style={{
          borderBottomColor: "#bababa",
          borderBottomWidth: StyleSheet.hairlineWidth,
          width: "100%",
          position: "absolute",
          top: "50%",
          zIndex: 0,
        }}
      />
      <Text
        style={{
          color: "#bababa",
          backgroundColor: "#0a0a0a", // Match the background color to make the "OR" look like it's on top of the line.
          paddingHorizontal: 10,
        }}
        className="text-base"
      >
        OR
      </Text>
    </View>
  );
};

export default OrDivider;
