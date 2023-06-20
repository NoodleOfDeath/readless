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

export const removeAll = async (hard = false) => {
  const keys = (await AsyncStorage.getAllKeys()).filter((k) => !/viewedFeatures/.test(k));
  if (!hard) {
    await AsyncStorage.setItem('viewedFeatures', JSON.stringify({ 'onboarding-walkthrough': true }));
  }
  await AsyncStorage.multiRemove(keys);
};