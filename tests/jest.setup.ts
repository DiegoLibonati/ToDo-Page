import "@testing-library/jest-dom";

import { mocksLocalStorage } from "@tests/jest.constants";

Object.defineProperty(global, "localStorage", {
  value: {
    getItem: mocksLocalStorage.getItem,
    setItem: mocksLocalStorage.setItem,
  },
});
