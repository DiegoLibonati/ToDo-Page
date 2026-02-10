import { getLocalStorage } from "@/helpers/getLocalStorage";

describe("getLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should return parsed value from localStorage", () => {
    const data = { name: "test", value: 123 };
    localStorage.setItem("testKey", JSON.stringify(data));

    const result = getLocalStorage("testKey");

    expect(result).toEqual(data);
  });

  it("should return null when key does not exist", () => {
    const result = getLocalStorage("nonExistentKey");

    expect(result).toBeNull();
  });

  it("should return null when value is null", () => {
    localStorage.setItem("testKey", "null");

    const result = getLocalStorage("testKey");

    expect(result).toBeNull();
  });

  it("should parse string values", () => {
    localStorage.setItem("testKey", JSON.stringify("test string"));

    const result = getLocalStorage("testKey");

    expect(result).toBe("test string");
  });

  it("should parse number values", () => {
    localStorage.setItem("testKey", JSON.stringify(42));

    const result = getLocalStorage("testKey");

    expect(result).toBe(42);
  });

  it("should parse boolean values", () => {
    localStorage.setItem("testKey", JSON.stringify(true));

    const result = getLocalStorage("testKey");

    expect(result).toBe(true);
  });

  it("should parse array values", () => {
    const data = [1, 2, 3, 4, 5];
    localStorage.setItem("testKey", JSON.stringify(data));

    const result = getLocalStorage("testKey");

    expect(result).toEqual(data);
  });

  it("should parse nested objects", () => {
    const data = {
      user: { name: "John", age: 30 },
      settings: { theme: "dark", notifications: true },
    };
    localStorage.setItem("testKey", JSON.stringify(data));

    const result = getLocalStorage("testKey");

    expect(result).toEqual(data);
  });

  it("should handle empty string key", () => {
    localStorage.setItem("", JSON.stringify({ test: "value" }));

    const result = getLocalStorage("");

    expect(result).toEqual({ test: "value" });
  });

  it("should handle special characters in key", () => {
    const key = "test-key_123!@#";
    const data = { value: "test" };
    localStorage.setItem(key, JSON.stringify(data));

    const result = getLocalStorage(key);

    expect(result).toEqual(data);
  });

  it("should return null for empty string value", () => {
    localStorage.setItem("testKey", "");

    const result = getLocalStorage("testKey");

    expect(result).toBeNull();
  });

  it("should handle complex data structures", () => {
    const data = {
      id: "abc-123",
      items: [
        { name: "Item 1", complete: false },
        { name: "Item 2", complete: true },
      ],
      metadata: {
        createdAt: "2024-01-01",
        updatedAt: "2024-01-02",
      },
    };
    localStorage.setItem("testKey", JSON.stringify(data));

    const result = getLocalStorage("testKey");

    expect(result).toEqual(data);
  });
});
