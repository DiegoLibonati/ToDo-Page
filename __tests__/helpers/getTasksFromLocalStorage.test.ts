import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";

import { mockLocalStorage } from "@tests/__mocks__/localStorage.mock";
import { mockTasks } from "@tests/__mocks__/tasks.mock";

describe("getTasksFromLocalStorage", () => {
  beforeEach(() => {
    mockLocalStorage.clear();
  });

  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should return tasks from localStorage", () => {
    mockLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    const result = getTasksFromLocalStorage();

    expect(result).toEqual(mockTasks);
  });

  it("should return empty array when no tasks in localStorage", () => {
    const result = getTasksFromLocalStorage();

    expect(result).toEqual([]);
  });

  it("should return empty array when localStorage has null", () => {
    mockLocalStorage.setItem("tasks", "null");

    const result = getTasksFromLocalStorage();

    expect(result).toEqual([]);
  });
});
