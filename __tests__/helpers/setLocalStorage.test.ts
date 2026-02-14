import { setLocalStorage } from "@/helpers/setLocalStorage";

describe("setLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should store data in localStorage as JSON", () => {
    const testData = { name: "test", value: 123 };

    setLocalStorage("test-key", testData);

    const stored = localStorage.getItem("test-key");
    expect(stored).toBe(JSON.stringify(testData));
  });

  it("should store arrays in localStorage", () => {
    const testArray = [1, 2, 3, 4, 5];

    setLocalStorage("test-array", testArray);

    const stored = localStorage.getItem("test-array");
    expect(stored).toBe(JSON.stringify(testArray));
  });

  it("should overwrite existing data", () => {
    setLocalStorage("test-key", "first");
    setLocalStorage("test-key", "second");

    const stored = localStorage.getItem("test-key");
    expect(stored).toBe(JSON.stringify("second"));
  });
});
