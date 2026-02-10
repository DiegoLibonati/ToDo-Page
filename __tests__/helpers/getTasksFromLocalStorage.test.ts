import type { Task } from "@/types/app";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";
import { getLocalStorage } from "@/helpers/getLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@/constants/vars";

jest.mock("@/helpers/getLocalStorage");

describe("getTasksFromLocalStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return tasks from localStorage", () => {
    const tasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: false },
      { id: "2", category: "progress", text: "Task 2", complete: true },
    ];

    (getLocalStorage as jest.Mock).mockReturnValue(tasks);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual(tasks);
    expect(getLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY);
  });

  it("should return empty array when no tasks exist", () => {
    (getLocalStorage as jest.Mock).mockReturnValue(null);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual([]);
  });

  it("should return empty array when localStorage returns null", () => {
    (getLocalStorage as jest.Mock).mockReturnValue(null);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual([]);
    expect(getLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY);
  });

  it("should return empty array when localStorage returns undefined", () => {
    (getLocalStorage as jest.Mock).mockReturnValue(undefined);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual([]);
  });

  it("should return single task", () => {
    const tasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: false },
    ];

    (getLocalStorage as jest.Mock).mockReturnValue(tasks);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual(tasks);
    expect(result).toHaveLength(1);
  });

  it("should return multiple tasks", () => {
    const tasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: false },
      { id: "2", category: "progress", text: "Task 2", complete: true },
      { id: "3", category: "finish", text: "Task 3", complete: true },
    ];

    (getLocalStorage as jest.Mock).mockReturnValue(tasks);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual(tasks);
    expect(result).toHaveLength(3);
  });

  it("should return tasks with different categories", () => {
    const tasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: false },
      { id: "2", category: "progress", text: "Task 2", complete: false },
      { id: "3", category: "finish", text: "Task 3", complete: true },
    ];

    (getLocalStorage as jest.Mock).mockReturnValue(tasks);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual(tasks);
  });

  it("should return tasks with complete status", () => {
    const tasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: true },
      { id: "2", category: "tasks", text: "Task 2", complete: false },
    ];

    (getLocalStorage as jest.Mock).mockReturnValue(tasks);

    const result = getTasksFromLocalStorage();

    expect(result[0]!.complete).toBe(true);
    expect(result[1]!.complete).toBe(false);
  });

  it("should preserve task properties", () => {
    const tasks: Task[] = [
      { id: "abc-123", category: "tasks", text: "Test task", complete: false },
    ];

    (getLocalStorage as jest.Mock).mockReturnValue(tasks);

    const result = getTasksFromLocalStorage();

    expect(result[0]).toHaveProperty("id", "abc-123");
    expect(result[0]).toHaveProperty("category", "tasks");
    expect(result[0]).toHaveProperty("text", "Test task");
    expect(result[0]).toHaveProperty("complete", false);
  });

  it("should handle empty array from localStorage", () => {
    (getLocalStorage as jest.Mock).mockReturnValue([]);

    const result = getTasksFromLocalStorage();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });

  it("should call getLocalStorage with correct key", () => {
    (getLocalStorage as jest.Mock).mockReturnValue([]);

    getTasksFromLocalStorage();

    expect(getLocalStorage).toHaveBeenCalledTimes(1);
    expect(getLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY);
  });
});
