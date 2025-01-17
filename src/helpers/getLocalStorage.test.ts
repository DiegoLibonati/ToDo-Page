import { getLocalStorage } from "./getLocalStorage";

import { mocksLocalStorage } from "../tests/jest.constants";

describe("getLocalStorage.ts", () => {
  describe("General Tests.", () => {
    test("The getItem of localStorage must be called.", () => {
      getLocalStorage("key");

      expect(mocksLocalStorage.getItem).toHaveBeenCalledTimes(1);
      expect(mocksLocalStorage.getItem).toHaveBeenCalledWith("key");
    });
  });
});
