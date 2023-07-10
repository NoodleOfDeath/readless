export const getItem = async (name: string) => {
  const value = window.localStorage.getItem(name);
  return value ? value : undefined;
};
  
export const setItem = async (name: string, value?: string) => {
  if (!value) {
    return window.localStorage.removeItem(name);
  }
  window.localStorage.setItem(name, value);
};

export const removeItem = async (name: string) => {
  return window.localStorage.removeItem(name);
};

export const removeAll = async (_hard = false) => {
  return window.localStorage.clear();
};