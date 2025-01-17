import "@testing-library/jest-dom";

import { mocksLocalStorage } from "./jest.constants";

Object.defineProperty(global, "localStorage", {
  value: {
    getItem: mocksLocalStorage.getItem,
    setItem: mocksLocalStorage.setItem,
  },
});
