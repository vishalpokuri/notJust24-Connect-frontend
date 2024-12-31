import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, StyleSheet, Dimensions } from "react-native";
import {
  PhotoMemories,
  InstantConnections,
  ProfileHub,
  FinalCTA,
} from "./template";
import WelcomeScreen from "./WelcomeScreen";

const { width } = Dimensions.get("window");

const WelcomeFlow = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / width);
    setCurrentPage(currentIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Window 1: Welcome Screen */}
        <View style={[styles.screen, { width }]}>
          <WelcomeScreen />
        </View>

        {/* Window 2: Instant Connections */}
        <View style={[styles.screen, { width }]}>
          <InstantConnections />
        </View>

        {/* Window 3: Profile Hub */}
        <View style={[styles.screen, { width }]}>
          <ProfileHub />
        </View>

        {/* Window 4: Photo Memories */}
        <View style={[styles.screen, { width }]}>
          <PhotoMemories />
        </View>

        {/* Window 5: Final CTA */}
        <View style={[styles.screen, { width }]}>
          <FinalCTA />
        </View>
      </ScrollView>

      {/* Dot Indicator */}
      <View style={styles.dotContainer}>
        {[...Array(5)].map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentPage ? "#fff" : "rgba(255, 255, 255, 0.3)",
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default WelcomeFlow;
