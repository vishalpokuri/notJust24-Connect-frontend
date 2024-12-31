import React, { useEffect, useRef, useState } from "react";
import { CameraView } from "expo-camera";
import { useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import AddNotes from "./addNotes";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const TakeSelfieScreen = () => {
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [imageData, setImageData] = useState({
    height: "",
    width: "",
    uri: "",
  });
  const [type, setType] = useState("front");
  const [isLoading, setIsLoading] = useState(false);

  const handleFlipCamera = () => {
    setType(type === "front" ? "back" : "front");
  };

  const takePicture = async () => {
    if (!cameraRef.current || isLoading) return;

    setIsLoading(true);
    try {
      const data = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: true,
      });
      setImageData({
        height: data.height,
        width: data.width,
        uri: data.uri,
      });
      setImage(data.uri);
    } catch (err) {
      console.error("Error taking picture:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (image) {
    return (
      <AddNotes
        height={imageData.height}
        width={imageData.width}
        uri={imageData.uri}
        setImage={setImage}
      />
    );
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <BlurView intensity={70} tint="dark" style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera access is required to take a selfie
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </BlurView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => router.replace("/home/homePage")}
        >
          <Text style={styles.buttonText}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView facing={type} style={styles.camera} ref={cameraRef} />

        {/* Camera controls */}
        <View
          style={styles.controls}
          className="flex items-center justify-center"
        >
          <TouchableOpacity
            style={styles.flipButton}
            onPress={handleFlipCamera}
          >
            <Text style={styles.buttonText}>↺</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.captureButton,
              isLoading && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000000" />
            ) : (
              <View style={styles.captureButtonInner} />
            )}
          </TouchableOpacity>

          <View style={styles.placeholder} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    width: screenWidth * 0.8,
    height: screenWidth * 0.8,
    borderWidth: 2,
    // borderColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 16,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  placeholder: {
    width: 48,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TakeSelfieScreen;
