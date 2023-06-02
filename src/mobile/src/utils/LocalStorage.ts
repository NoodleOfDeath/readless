import AsyncStorage from '@react-native-async-storage/async-storage';

export const setItem = async (name: string, value: string) => {
  return await AsyncStorage.setItem(name, value);
};
  
export const removeItem = async (name: string) => {
  return await AsyncStorage.removeItem(name);
};
  
export const getItem = async (name: string) => {
  const value = await AsyncStorage.getItem(name);
  if (value == null) {
    return undefined;
  }
  return value;
};