import { Task } from "@src/entities/app";

import { getLocalStorage } from "@src/helpers/getLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@src/constants/vars";

export const getTasksFromLocalStorage = (): Task[] => {
  const cards = getLocalStorage<Task[]>(LOCAL_STORAGE_TASKS_KEY);

  return cards ? cards : [];
};
