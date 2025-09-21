import { setLocalStorage } from "@src/helpers/setLocalStorage";

import { mocksLocalStorage } from "@tests/jest.constants";

describe("setLocalStorage.ts", () => {
  describe("General Tests.", () => {
    test("The setItem of localStorage must be called.", () => {
      setLocalStorage("key", 2);

      expect(mocksLocalStorage.setItem).toHaveBeenCalledTimes(1);
      expect(mocksLocalStorage.setItem).toHaveBeenCalledWith("key", "2");
    });
  });
});
