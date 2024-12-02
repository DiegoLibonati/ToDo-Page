import { Task } from "../entities/entities";

import { getLocalStorage } from "./getLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "../constants/constants";

export const getTasksFromLocalStorage = (): Task[] => {
  const cards = getLocalStorage<Task[]>(LOCAL_STORAGE_TASKS_KEY);

  return cards ? cards : [];
};
