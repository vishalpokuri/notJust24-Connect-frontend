import React, { useState } from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";

import NotifModal from "../modal/notifiScreenModal";

export default function NotificationItem({
  selfieUri,
  profileUri,
  title,
  notificationId,
  message,
  setData,
}) {
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <View className="flex items-center space-x-4 rounded-3xl border flex-row p-4 shadow-sm transition-all hover:shadow-md bg-[#1e1e1e] w-[96%] mx-auto mt-1">
          <View className="flex-shrink-0">
            <Image
              source={{ uri: profileUri || "https://picsum.photos/200" }}
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover"
            />
          </View>
          <View className="flex-1">
            {/* Title */}
            <Text className="text-md font-semibold text-white truncate mb-1">
              {title}
            </Text>
            {/* Message */}
            <Text className="text-xs text-gray-400 truncate">{message}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal */}
      <NotifModal
        setData={setData}
        notificationId={notificationId}
        isVisible={isModalVisible}
        onClose={toggleModal} // Pass the toggle function to close the modal
        selfieUri={selfieUri}
        profileUri={profileUri}
      />
    </>
  );
}
