import type { Task } from "@/types/app";

import { getLocalStorage } from "@/helpers/getLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@/constants/vars";

export const getTasksFromLocalStorage = (): Task[] => {
  const cards = getLocalStorage(LOCAL_STORAGE_TASKS_KEY) as Task[] | null;

  return cards ?? [];
};
