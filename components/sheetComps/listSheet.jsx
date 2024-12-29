import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
  TextInput,
  Modal,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Svg, Path } from "react-native-svg";
import { getItem } from "../../utils/asyncStorage";
import { BASE_API_URL } from "../../constants/ngrokRoute";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ListBottomSheet = ({ visible, onClose, submit }) => {
  const [lists, setLists] = useState([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fetchLists();
    }
  }, [visible]);

  const showCreateList = () => {
    Animated.timing(slideAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fetchLists = async () => {
    try {
      const userId = await getItem("userId");
      const response = await fetch(
        `${BASE_API_URL}/api/list/fetchListsbyUserId?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setLists(data.listData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading to false after fetching is complete
    }
  };

  const hideCreateList = async () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    Keyboard.dismiss();
    setNewListTitle("");
    await fetchLists();
  };

  const handleCreateList = async () => {
    if (newListTitle.trim()) {
      try {
        const userId = await getItem("userId");
        const response = await fetch(
          `${BASE_API_URL}/api/list/createListandUpdateInUser`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userId,
              title: newListTitle,
            }),
          }
        );

        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error(error);
      }
      hideCreateList();
    }
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity style={styles.listItem} onPress={() => submit(item._id)}>
      <Text style={styles.listItemText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.handle} />

          <Animated.View
            style={[
              styles.slidingContainer,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            {/* Lists View */}
            <View style={styles.page}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Add to your Lists</Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={showCreateList}
                >
                  <Svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M12 5v14m7-7H5"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>

              {isLoading ? ( // Show ActivityIndicator while loading
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              ) : lists.length > 0 ? (
                <View style={{ flexGrow: 1 }}>
                  <FlatList
                    data={lists}
                    renderItem={renderListItem}
                    keyExtractor={(item) => item._id.toString()}
                    style={[styles.listContainer]}
                    contentContainerStyle={styles.listContent}
                    nestedScrollEnabled={true}
                  />
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    You don't have any lists currently. Create one!
                  </Text>
                </View>
              )}
            </View>

            {/* Create List View */}
            <View style={styles.page}>
              <View style={styles.header}>
                <Text style={styles.headerText}>Create New List</Text>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={hideCreateList}
                >
                  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M19 12H5m7-7-7 7 7 7"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </TouchableOpacity>
              </View>
              <View style={styles.createListForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter list title"
                  placeholderTextColor="#aaa"
                  value={newListTitle}
                  onChangeText={setNewListTitle}
                  autoFocus={true}
                />
                <TouchableOpacity
                  style={[
                    styles.createListButton,
                    !newListTitle.trim() && styles.createListButtonDisabled,
                  ]}
                  onPress={handleCreateList}
                  disabled={!newListTitle.trim()}
                >
                  <Text
                    style={
                      !newListTitle.trim()
                        ? styles.createListButtonTextDisabled
                        : styles.createListButtonText
                    }
                  >
                    Create List
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: "#1c1c1c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: "50%",
    paddingHorizontal: 0,
    elevation: 5,
  },
  handle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 3,
    marginBottom: 10,
  },
  slidingContainer: {
    flexDirection: "row",
    width: "200%",
  },
  page: {
    width: "50%",
    height: "100%",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  createButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  listContainer: {
    flexGrow: 0.7,
    height: "100%",
  },
  listContent: {
    paddingBottom: 16,
    flexGrow: 1,
  },
  listItem: {
    padding: 16,
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 10,
  },
  listItemText: {
    color: "#fff",
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
  },
  createListForm: {
    marginTop: 16,
  },
  input: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  createListButton: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  createListButtonDisabled: {
    backgroundColor: "#555",
  },
  createListButtonTextDisabled: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  createListButtonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListBottomSheet;
