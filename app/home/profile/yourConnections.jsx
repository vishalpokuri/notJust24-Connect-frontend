import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import ConnectionInfoModal from "../../../components/modal/connectionInfoModal";
import { BASE_API_URL } from "../../../constants/ngrokRoute";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const YourConnections = () => {
  const [notes, setNotes] = useState(null);
  const [connectionDetails, setConnectionDetails] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentConnection, setCurrentConnection] = useState(null);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [rotationValues] = useState({});

  const params = useLocalSearchParams();
  const userData = params.userData ? JSON.parse(params.userData) : [];
  const userId = params.userId;
  const lists = userData.lists;
  const cloudfrontUrl = "https://d1crt8jpz4phpk.cloudfront.net/";

  useEffect(() => {
    lists?.forEach((item) => {
      rotationValues[item._id] = new Animated.Value(0);
    });
  }, [lists]);

  const fetchNotes = useCallback(async (userId, connectionId) => {
    try {
      const response = await fetch(
        `${BASE_API_URL}/api/notes/fetchNotesbyUserandConnectionId?&connectionId=${connectionId}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setNotes(data.notes);
    } catch (e) {
      console.log(e);
    }
  }, []);

  const toggleModal = useCallback(() => {
    setVisible((prev) => !prev);
    if (visible) {
      // Reset states when closing modal
      setConnectionDetails(null);
      setNotes(null);
      setCurrentConnection(null);
    }
  }, [visible]);

  const handleConnectionPress = useCallback(
    async (connection) => {
      const updatedPhotoKey = `${cloudfrontUrl}${connection.userId2.profilePhotoKey.replace(
        "connectionsapp/",
        ""
      )}`;
      const updatedSelfieKey = `${cloudfrontUrl}${connection.selfieKey.replace(
        "connectionsapp/",
        ""
      )}`;

      await fetchNotes(userId, connection._id);
      setConnectionDetails(connection.userId2);
      setCurrentConnection({
        photoKey: updatedPhotoKey,
        selfieKey: updatedSelfieKey,
      });
      setVisible(true);
    },
    [userId, fetchNotes, cloudfrontUrl]
  );

  const toggleDropdown = useCallback(
    (itemId) => {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          200,
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );

      if (expandedItemId && expandedItemId !== itemId) {
        Animated.timing(rotationValues[expandedItemId], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }

      Animated.timing(rotationValues[itemId], {
        toValue: expandedItemId === itemId ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      setExpandedItemId(expandedItemId === itemId ? null : itemId);
    },
    [expandedItemId, rotationValues]
  );

  const renderConnection = useCallback(
    ({ item }) => {
      const fetcheddate = new Date(item.createdAt).toString();
      const [day, month, date, year, time] = fetcheddate.split(" ");
      const [hour, min] = time.split(":");

      const updatedPhotoKey = `${cloudfrontUrl}${item.userId2.profilePhotoKey.replace(
        "connectionsapp/",
        ""
      )}`;

      return (
        <TouchableOpacity
          className="flex-row items-center mx-auto"
          onPress={() => handleConnectionPress(item)}
        >
          <View
            style={styles.listItem}
            className="flex-row py-2 px-2 items-center w-[100%] mx-auto"
          >
            <Image
              source={{ uri: updatedPhotoKey }}
              style={styles.profilePicture}
            />
            <Text style={styles.name}> {item.userId2.name} </Text>
            <View className="ml-auto mr-4">
              <View className="flex justify-center items-center">
                <Text className="text-[#aaa] text-xs font-bold">
                  {month.toUpperCase()} {date}
                </Text>
                <Text className="text-white text-sm">
                  {hour}:{min}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [cloudfrontUrl, handleConnectionPress]
  );

  const renderItem = useCallback(
    ({ item }) => {
      const isExpanded = expandedItemId === item._id;
      const arrowRotation =
        rotationValues[item._id]?.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }) || "0deg";

      return (
        <View style={styles.listItem}>
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => toggleDropdown(item._id)}
            activeOpacity={0.7}
          >
            <Text style={styles.titleText}>{item.title}</Text>
            <Animated.Text
              style={[styles.arrow, { transform: [{ rotate: arrowRotation }] }]}
            >
              ▼
            </Animated.Text>
          </TouchableOpacity>

          {isExpanded && (
            <Animated.View
              style={[
                styles.dropdownContent,
                { opacity: rotationValues[item._id] },
              ]}
            >
              {item.connections.length > 0 ? (
                <FlatList
                  inverted
                  data={item.connections}
                  renderItem={renderConnection}
                  keyExtractor={(connection) => connection._id}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.noConnectionsText}>
                  No connections found
                </Text>
              )}
            </Animated.View>
          )}
        </View>
      );
    },
    [expandedItemId, rotationValues, toggleDropdown, renderConnection]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Your Connection Lists</Text>
      <FlatList
        data={lists}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.scrollContainer}
      />
      {currentConnection && (
        <ConnectionInfoModal
          connectionDetails={connectionDetails}
          notes={notes}
          isVisible={visible}
          profileUri={currentConnection.photoKey}
          selfieUri={currentConnection.selfieKey}
          onClose={toggleModal}
        />
      )}
    </SafeAreaView>
  );
};

export default YourConnections;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    padding: 16,
  },
  scrollContainer: {
    padding: 16,
  },
  listItem: {
    marginBottom: 8,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    overflow: "hidden",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  arrow: {
    color: "#fff",
    fontSize: 16,
  },
  dropdownContent: {
    padding: 12,
    backgroundColor: "#262626",
  },
  connectionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  connectionText: {
    color: "#fff",
    marginBottom: 4,
  },
  noConnectionsText: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    padding: 8,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
  footerDateView: {
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  dateMonth: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  dateTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    marginTop: 10,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: "700",
  },
  dateTime: {
    fontSize: 18,
    fontWeight: "500",
  },
});
