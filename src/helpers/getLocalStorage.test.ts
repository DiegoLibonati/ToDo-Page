import { getLocalStorage } from "./getLocalStorage";

import { LOCAL_STORAGE_MOCKS } from "../tests/jest.setup";

test("The getItem of localStorage must be called.", () => {
  getLocalStorage("key");

  expect(LOCAL_STORAGE_MOCKS.getItem).toHaveBeenCalledTimes(1);
  expect(LOCAL_STORAGE_MOCKS.getItem).toHaveBeenCalledWith("key");
});
