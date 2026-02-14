import "@testing-library/jest-dom";

import { mocksLocalStorage } from "@tests/__mocks__/localStorage.mock";

Object.defineProperty(global, "localStorage", {
  value: {
    getItem: mocksLocalStorage.getItem,
    setItem: mocksLocalStorage.setItem,
    removeItem: mocksLocalStorage.removeItem,
    clear: mocksLocalStorage.clear,
    key: mocksLocalStorage.key,
    length: mocksLocalStorage.length,
  },
  writable: true,
});

if (typeof DragEvent === "undefined") {
  class MockDragEvent extends Event implements DragEvent {
    dataTransfer: DataTransfer;
    readonly altKey: boolean = false;
    readonly button: number = 0;
    readonly buttons: number = 0;
    readonly clientX: number = 0;
    readonly clientY: number = 0;
    readonly ctrlKey: boolean = false;
    readonly metaKey: boolean = false;
    readonly movementX: number = 0;
    readonly movementY: number = 0;
    readonly offsetX: number = 0;
    readonly offsetY: number = 0;
    readonly pageX: number = 0;
    readonly pageY: number = 0;
    readonly relatedTarget: EventTarget | null = null;
    readonly screenX: number = 0;
    readonly screenY: number = 0;
    readonly shiftKey: boolean = false;
    readonly x: number = 0;
    readonly y: number = 0;
    readonly layerX: number = 0;
    readonly layerY: number = 0;
    readonly detail: number = 0;
    readonly view: Window | null = null;
    readonly which: number = 0;

    constructor(type: string, eventInitDict?: DragEventInit) {
      super(type, eventInitDict);
      this.dataTransfer = eventInitDict?.dataTransfer ?? new DataTransfer();
    }

    getModifierState(_keyArg: string): boolean {
      return false;
    }

    initMouseEvent(): void {
      throw new Error("initMouseEvent is deprecated");
    }

    initUIEvent(): void {
      throw new Error("initUIEvent is deprecated");
    }
  }

  (
    global as typeof globalThis & { DragEvent: typeof MockDragEvent }
  ).DragEvent = MockDragEvent;
}

if (typeof DataTransfer === "undefined") {
  class MockDataTransfer implements DataTransfer {
    private data = new Map<string, string>();
    dropEffect: "none" | "copy" | "link" | "move" = "none";
    effectAllowed:
      | "none"
      | "copy"
      | "copyLink"
      | "copyMove"
      | "link"
      | "linkMove"
      | "move"
      | "all"
      | "uninitialized" = "uninitialized";
    readonly files: FileList = [] as unknown as FileList;
    readonly items: DataTransferItemList =
      [] as unknown as DataTransferItemList;
    readonly types: readonly string[] = [];

    setData(format: string, data: string): void {
      this.data.set(format, data);
    }

    getData(format: string): string {
      return this.data.get(format) ?? "";
    }

    clearData(format?: string): void {
      if (format) {
        this.data.delete(format);
      } else {
        this.data.clear();
      }
    }

    setDragImage(_image: Element, _x: number, _y: number): void {
      // No-op for testing
    }
  }

  (
    global as typeof globalThis & { DataTransfer: typeof MockDataTransfer }
  ).DataTransfer = MockDataTransfer;
}

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid-1234"),
}));
