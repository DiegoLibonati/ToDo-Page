const storage = new Map<string, string>();

export const mocksLocalStorage = {
  getItem: jest.fn((key: string): string | null => storage.get(key) ?? null),
  setItem: jest.fn((key: string, value: string): void => {
    storage.set(key, value);
  }),
  removeItem: jest.fn((key: string): void => {
    storage.delete(key);
  }),
  clear: jest.fn((): void => {
    storage.clear();
  }),
  key: jest.fn((index: number): string | null => {
    const keys = Array.from(storage.keys());
    return keys[index] ?? null;
  }),
  get length(): number {
    return storage.size;
  },
};
