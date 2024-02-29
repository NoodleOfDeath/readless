import AsyncStorage from '@react-native-async-storage/async-storage';

export function useLocalStorage() {

  const setItem = async (name: string, value: string) => {
    return await AsyncStorage.setItem(name, value);
  };
  
  const removeItem = async (name: string) => {
    return await AsyncStorage.removeItem(name);
  };
  
  const getItem = async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    if (value == null) {
      return undefined;
    }
    return value;
  };

  const removeAll = async (hard = false) => {
    const keys = (await AsyncStorage.getAllKeys()).filter((k) => !hard && !/viewedFeatures/.test(k) || hard);
    if (!hard) {
      await AsyncStorage.setItem('viewedFeatures', JSON.stringify({ 'onboarding-walkthrough': true }));
    }
    await AsyncStorage.multiRemove(keys);
  };

  return {
    getItem,
    removeAll,
    removeItem,
    setItem,
  };
  
}
