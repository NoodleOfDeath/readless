import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob, encode as btoa } from 'js-base64';

export const setCookie = async (name: string, value: string) => {
  return await AsyncStorage.setItem(name, btoa(value));
};
  
export const clearCookie = async (name: string) => {
  return await AsyncStorage.removeItem(name);
};
  
export const getCookie = async (name: string) => {
  const value = await AsyncStorage.getItem(name);
  if (!value) {
    return undefined;
  }
  return atob(value);
};