import {
  Text,
  StyleSheet,
  Image,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { BASE_API_URL } from "../../constants/ngrokRoute";
import { useEffect, useState } from "react";
import CustomButton from "../../components/ui/customButton";
import ListBottomSheet from "../../components/sheetComps/listSheet";
import { getItem } from "../../utils/asyncStorage";
import LoadingSuccessModal from "../../components/modal/loadingSuccessModal";
const AddNotes = ({ height, width, uri, setImage }) => {
  const [potrait, setPotrait] = useState(null);
  const [notes, setNotes] = useState(null);
  const [visible, setVisible] = useState(false);
  //This is for success Modal
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [imageMetaData, setimageMetaData] = useState({ uri: "", type: "" });
  useEffect(() => {
    if (height > width) {
      setPotrait(true);
    } else {
      setPotrait(false);
    }

    if (uri) {
      setimageMetaData({
        uri,
        type: "image",
      });
    }
  }, [height, width, uri]);
  const retakePicture = () => {
    setImage(null);
  };
  const addToLists = () => {
    Keyboard.dismiss();
    setVisible(true);
  };
  const closeModal = () => {
    setVisible(false);
  };

  //Presigned URL to upload the photo
  const submit = async (listId) => {
    setSuccessModalVisible(true);
    setIsLoading(true);
    setVisible(false);
    if (uri) {
      const accessToken = await getItem("accessToken");
      const userId2 = await getItem("userId2");
      const userId = await getItem("userId");

      //1. Upload selfie
      try {
        const response = await fetch(
          `${BASE_API_URL}/api/aws/presignedurlSelfie?&mimetype=${imageMetaData.type}&userId2=${userId2}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();

        if (data.presignedUrl) {
          const uploadResponse = await fetch(data.presignedUrl, {
            method: "PUT",
            headers: {
              "Content-Type": imageMetaData.type,
            },
            body: await fetch(imageMetaData.uri).then((res) => res.blob()),
          });

          if (uploadResponse.status === 200) {
            //2. Create a connection and put the selfie key
            const userId = await getItem("userId");
            const keyUploadResponse = await fetch(
              `${BASE_API_URL}/api/QR/uploadSelfieConnection`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  userId1: userId,
                  userId2: userId2,
                  selfieKey: data.key,
                }),
              }
            );
            const data2 = await keyUploadResponse.json();
            //3. Put that in Connection
            if (keyUploadResponse.ok) {
              //3. Create a notes Object with the connectionId and UserId
              createNotes(data2.connectionId, userId, notes);
              //4. Put that in Connection
              uploadInList(listId, data2.connectionId, setVisible);
            } else {
              console.error("Error saving file key to backend.");
            }
          } else {
            console.error("File upload failed.");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const uploadInList = async (listId, connectionId, setVisible) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/list/uploadInList`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listId,
          connectionId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoading(false);
        setIsSuccess(true);
      } else {
        console.log(data);
        setVisible(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createNotes = async (connectionId, userId, notes) => {
    try {
      const response = await fetch(`${BASE_API_URL}/api/notes/createNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          connectionId,
          notes,
        }),
      });

      if (response.ok) {
        console.log("Created Notes successfully");
      } else {
        console.error("Unable to create notes");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text className="text-3xl font-bold text-white m-4 mb-0">
          Add Notes
        </Text>
        {uri ? (
          <View
            style={[
              styles.imageContainer,
              {
                width: potrait ? "58%" : "90%",
                borderRadius: potrait ? 18 : 12,
              },
            ]}
          >
            <Image
              source={{ uri: uri }}
              style={[
                styles.image,
                {
                  width: potrait ? "100%" : "100%",
                  height: potrait ? 300 : 265,
                },
              ]}
              onError={(error) =>
                console.log("Image loading error:", error.nativeEvent.error)
              }
            />
          </View>
        ) : (
          <Text style={[styles.headerText, { fontSize: 16 }]}>
            Loading image...
          </Text>
        )}
        <View className="flex-row">
          <CustomButton
            title="Retake Selfie"
            handlePress={retakePicture}
            containerStyles="w-[40%] mx-auto h-[40px] bg-[#ddd]"
            textStyles="font-bold text-base"
          />
          <CustomButton
            title="Continue"
            handlePress={addToLists}
            containerStyles="w-[40%] mx-auto h-[40px] bg-[#ddd]"
            textStyles="font-bold text-base"
          />
        </View>
        {/* Section for notes */}
        <TextInput
          style={styles.textarea2}
          multiline
          numberOfLines={3}
          placeholder="A short notes about your connection?"
          className="border-[0.5px] border-solid border-[#888] rounded-md mx-auto"
          placeholderTextColor="#888"
          value={notes}
          onChangeText={(e) => {
            setNotes(e);
          }}
        />
        <ListBottomSheet
          visible={visible}
          onClose={closeModal}
          submit={submit}
        />
        <LoadingSuccessModal
          isVisible={successModalVisible}
          onClose={() => {
            setSuccessModalVisible(false);
            setIsLoading(false);
            setIsSuccess(false);
          }}
          isLoading={isLoading}
          isSuccess={isSuccess}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddNotes;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },

  contentContainer: {
    width: "100%",
    padding: 16,
    minHeight: "85%",
  },
  imageContainer: {
    marginTop: 20,

    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden", // This is crucial for showing the borderRadius
  },
  image: {
    resizeMode: "contain",
    backgroundColor: "transparent",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "left",
  },
  textarea2: {
    height: 100,
    width: "95%",
    padding: 10,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 16,
    borderRadius: 8,
    textAlignVertical: "top",
  },
});
