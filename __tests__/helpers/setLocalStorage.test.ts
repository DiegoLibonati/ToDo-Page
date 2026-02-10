import { setLocalStorage } from "@/helpers/setLocalStorage";

describe("setLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should save value to localStorage", () => {
    const data = { name: "test", value: 123 };

    setLocalStorage("testKey", data);

    const stored = localStorage.getItem("testKey");
    expect(stored).toBe(JSON.stringify(data));
  });

  it("should save string values", () => {
    setLocalStorage("testKey", "test string");

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toBe("test string");
  });

  it("should save number values", () => {
    setLocalStorage("testKey", 42);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toBe(42);
  });

  it("should save boolean values", () => {
    setLocalStorage("testKey", true);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toBe(true);
  });

  it("should save null values", () => {
    setLocalStorage("testKey", null);

    const stored = localStorage.getItem("testKey");
    expect(stored).toBe("null");
  });

  it("should save array values", () => {
    const data = [1, 2, 3, 4, 5];

    setLocalStorage("testKey", data);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toEqual(data);
  });

  it("should save object values", () => {
    const data = { name: "John", age: 30 };

    setLocalStorage("testKey", data);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toEqual(data);
  });

  it("should save nested objects", () => {
    const data = {
      user: { name: "John", age: 30 },
      settings: { theme: "dark", notifications: true },
    };

    setLocalStorage("testKey", data);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toEqual(data);
  });

  it("should overwrite existing values", () => {
    setLocalStorage("testKey", "old value");
    setLocalStorage("testKey", "new value");

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toBe("new value");
  });

  it("should handle empty string key", () => {
    setLocalStorage("", { test: "value" });

    const stored = localStorage.getItem("");
    expect(JSON.parse(stored!)).toEqual({ test: "value" });
  });

  it("should handle special characters in key", () => {
    const key = "test-key_123!@#";
    const data = { value: "test" };

    setLocalStorage(key, data);

    const stored = localStorage.getItem(key);
    expect(JSON.parse(stored!)).toEqual(data);
  });

  it("should save empty object", () => {
    setLocalStorage("testKey", {});

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toEqual({});
  });

  it("should save empty array", () => {
    setLocalStorage("testKey", []);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toEqual([]);
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

    setLocalStorage("testKey", data);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toEqual(data);
  });

  it("should save zero as number", () => {
    setLocalStorage("testKey", 0);

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toBe(0);
  });

  it("should save empty string", () => {
    setLocalStorage("testKey", "");

    const stored = localStorage.getItem("testKey");
    expect(JSON.parse(stored!)).toBe("");
  });

  it("should save undefined as null", () => {
    setLocalStorage("testKey", undefined);

    const stored = localStorage.getItem("testKey");
    expect(stored).toBeNull();
  });
});
