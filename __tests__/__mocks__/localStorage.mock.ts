const storage = new Map<string, string>();

const mockGetItem = jest.fn(
  (key: string): string | null => storage.get(key) ?? null
);
const mockSetItem = jest.fn((key: string, value: string): void => {
  storage.set(key, value);
});
const mockRemoveItem = jest.fn((key: string): void => {
  storage.delete(key);
});
const mockClear = jest.fn((): void => {
  storage.clear();
});
const mockKey = jest.fn((index: number): string | null => {
  const keys = Array.from(storage.keys());
  return keys[index] ?? null;
});

export const mocksLocalStorage = {
  getItem: mockGetItem,
  setItem: mockSetItem,
  removeItem: mockRemoveItem,
  clear: mockClear,
  key: mockKey,
  get length(): number {
    return storage.size;
  },
};
