export function useLocalStorage() {

  const getItem = async (name: string) => {
    return window.localStorage.getItem(name);
  };
  
  const setItem = async (name: string, value?: string) => {
    if (!value) {
      return window.localStorage.removeItem(name);
    }
    window.localStorage.setItem(name, value);
  };

  const removeItem = async (name: string) => {
    return window.localStorage.removeItem(name);
  };

  const removeAll = async (_hard = false) => {
    return window.localStorage.clear();
  };

  return {
    getItem,
    removeAll,
    removeItem,
    setItem,
  };

}