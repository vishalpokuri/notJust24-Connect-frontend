import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  getIndieNotificationInbox,
  deleteIndieNotificationInbox,
} from "native-notify";

import { getItem } from "../../../utils/asyncStorage";
import { isTokenKind } from "typescript";

export default function NotificationScreen() {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);

  // Fetch userId on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const id = await getItem("userId");
      setUserId(id);
    };
    fetchUserId();
  }, []);

  // Fetch notifications when userId changes
  useEffect(() => {
    if (userId) {
      async function fetchNotifications() {
        const notifications = await getIndieNotificationInbox(
          userId,
          25674,
          "6Kka30YI9fQ1rmbvtyUDkX",
          20,
          0
        );
        console.log("notifications: ", notifications);
        setData(notifications);
      }
      fetchNotifications();
    }
  }, [userId]);

  // Render each notification item
  const renderItem = ({ item }) => (
    <View className="flex items-center space-x-4 rounded-lg border p-4 shadow-sm transition-all hover:shadow-md bg-[#1e1e1e] w-[90%] mx-auto">
      <View className="flex-shrink-0">
        <Image
          src="https://picsum.photos/200"
          alt={title}
          className="h-12 w-12 rounded-full object-cover"
        />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-sm font-medium text-gray-900 truncate">
          {item.title}
        </Text>
        <Text className="text-sm text-gray-500 truncate">{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* FlatList to render notifications */}
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.notification_id.toString()}
        contentContainerStyle={styles.scrollContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollContainer: {
    paddingBottom: 20, // Optional, for adding space at the bottom
  },
  notificationItem: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    color: "#737373",
    fontSize: 14,
  },
});
