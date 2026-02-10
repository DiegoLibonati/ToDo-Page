export const getLocalStorage = (key: string): unknown => {
  const item = localStorage.getItem(key);

  if (!item) return null;

  return JSON.parse(item);
};
