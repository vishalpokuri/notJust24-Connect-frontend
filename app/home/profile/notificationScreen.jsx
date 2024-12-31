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
import NotificationItem from "../../../components/ui/notification";

export default function NotificationScreen() {
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState(null);
  const cdn = "https://d1crt8jpz4phpk.cloudfront.net";

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
        setData(notifications);
      }
      fetchNotifications();
    }
  }, [userId]);

  //loading State
  if (!data) {
    return (
      <SafeAreaView
        className="bg-[#0a0a0a] h-full flex items-center justify-center"
        style={styles.container}
      >
        <ActivityIndicator color="white" size={24} />
      </SafeAreaView>
    );
  }

  // Render each notification item
  const renderItem = ({ item }) => {
    const pushedData = JSON.parse(item.pushData);
    
    const newSelfieUri = `${cdn}/${pushedData.selfieKey}`;

    const notificationModalReq = {
      ...pushedData,
    };

    const newProfileUri = `${cdn}/${pushedData.profilePhotoKey}`;
    return (
      <NotificationItem
        setData={setData}
        notificationModalReq={notificationModalReq}
        notificationId={item.notification_id}
        selfieUri={newSelfieUri}
        profileUri={newProfileUri}
        title={item.title}
        message={item.message}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text className="font-bold m-4 mt-8 ml-6 text-3xl text-white">
        History
      </Text>
      {/* FlatList to render notifications */}
      {data.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.notification_id.toString()}
          contentContainerStyle={styles.scrollContainer}
        />
      ) : (
        <Text className="text-base text-[#ddd] font-base w-[80%] text-center mx-auto mt-[20%]">
          All Clean, You dont have any new notifications!
        </Text>
      )}
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
