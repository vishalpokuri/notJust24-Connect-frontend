import { Text, StyleSheet, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
const AddNotes = () => {
  const { height, width, uri } = useLocalSearchParams();
  const [imageData, setImageData] = useState({
    height: "",
    width: "",
    uri: "",
  });
  const [potrait, setPotrait] = useState(null);
  useEffect(() => {
    // Decode the URI if it's encoded
    // TODO: The photo is getting deleted automatically when screen changed, might considering saving somewhere.
    const decodedUri = decodeURI(uri);
    console.log("Decoded URI:", decodedUri); // Debug log

    setImageData({
      height,
      width,
      uri: decodedUri,
    });
    if (height > width) {
      setPotrait(true);
    } else {
      setPotrait(false);
    }
  }, [height, width, uri]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ width: "100%", padding: 16, minHeight: "85%" }}>
          <Text style={styles.headerText}>Add Notes</Text>
          {imageData.uri ? (
            <Image
              source={{ uri: imageData.uri }}
              style={[
                styles.image,
                {
                  width: potrait ? "40%" : "80%",
                  height: 300, // Add a fixed height
                },
              ]}
              onError={(error) =>
                console.log("Image loading error:", error.nativeEvent.error)
              }
              onLoad={() => console.log("Image loaded successfully")}
            />
          ) : (
            <Text style={[styles.headerText, { fontSize: 16 }]}>
              Loading image...
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "left",
  },
  image: {
    resizeMode: "contain",
    alignSelf: "center",
    borderRadius: 8,
    marginTop: 20,
  },
});
