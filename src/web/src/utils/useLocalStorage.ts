export function useLocalStorage() {

  const getItem = async (name: string) => {
    return window.localStorage.getItem(name);
  };

  const removeItem = async (name: string) => {
    return window.localStorage.removeItem(name);
  };

  const removeAll = async (_hard = false) => {
    return window.localStorage.clear();
  };
  
  const setItem = async (name: string, value?: string) => {
    if (!value) {
      return removeItem(name);
    }
    window.localStorage.setItem(name, value);
  };

  return {
    getItem,
    removeAll,
    removeItem,
    setItem,
  };

}