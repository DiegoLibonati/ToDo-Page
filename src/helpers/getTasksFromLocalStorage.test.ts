import { getTasksFromLocalStorage } from "./getTasksFromLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "../constants/constants";

import { LOCAL_STORAGE_MOCKS } from "../tests/jest.setup";

test("The getItem of localStorage must be called with key of cards.", () => {
  getTasksFromLocalStorage();

  expect(LOCAL_STORAGE_MOCKS.getItem).toHaveBeenCalledTimes(1);
  expect(LOCAL_STORAGE_MOCKS.getItem).toHaveBeenCalledWith(
    LOCAL_STORAGE_TASKS_KEY
  );
});
