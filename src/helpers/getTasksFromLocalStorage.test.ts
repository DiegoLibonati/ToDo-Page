import { getTasksFromLocalStorage } from "./getTasksFromLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "../constants/constants";

import { mocksLocalStorage } from "../tests/jest.constants";

describe("getTasksFromLocalStorage.ts", () => {
  describe("General Tests.", () => {
    test("The getItem of localStorage must be called with key of cards.", () => {
      getTasksFromLocalStorage();

      expect(mocksLocalStorage.getItem).toHaveBeenCalledTimes(1);
      expect(mocksLocalStorage.getItem).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY
      );
    });
  });
});
