export const getLocalStorage = <T>(key: string): T | null => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key)!)
    : null;
};
