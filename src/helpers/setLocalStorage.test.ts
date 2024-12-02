import { setLocalStorage } from "./setLocalStorage";

import { LOCAL_STORAGE_MOCKS } from "../tests/jest.setup";

test("The setItem of localStorage must be called.", () => {
  setLocalStorage("key", 2);

  expect(LOCAL_STORAGE_MOCKS.setItem).toHaveBeenCalledTimes(1);
  expect(LOCAL_STORAGE_MOCKS.setItem).toHaveBeenCalledWith("key", "2");
});
