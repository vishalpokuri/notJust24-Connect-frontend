import AsyncStorage from "@react-native-async-storage/async-storage";
import jwt from "jsonwebtoken";

export const storeToken = async (token) => {
  await AsyncStorage.setItem("jwt", token);
};

export const checkToken = async () => {
  const token = await AsyncStorage.getItem("jwt");
  if (!token) return false;

  try {
    const decoded = jwt.decode(token);
    return decoded.exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const removeToken = async () => {
  await AsyncStorage.removeItem("jwt");
};
