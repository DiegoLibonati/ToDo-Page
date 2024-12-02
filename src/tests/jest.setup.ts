import "@testing-library/jest-dom";

import fs from "fs";
import path from "path";

const INITIAL_HTML: string = fs.readFileSync(
  path.resolve(__dirname, "../../index.html"),
  "utf8"
);

export const OFFICIAL_BODY = INITIAL_HTML.match(
  /<body[^>]*>([\s\S]*?)<\/body>/i
)![1];

export const LOCAL_STORAGE_MOCKS = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

Object.defineProperty(global, "localStorage", {
  value: {
    getItem: LOCAL_STORAGE_MOCKS.getItem,
    setItem: LOCAL_STORAGE_MOCKS.setItem,
  },
});
