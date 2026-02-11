import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { TaskProps } from "@/types/props";
import type { TaskComponent } from "@/types/components";

import { Task } from "@/components/Task/Task";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@/constants/vars";

jest.mock("@/helpers/getTasksFromLocalStorage");
jest.mock("@/helpers/setLocalStorage");

const renderComponent = (props: TaskProps): TaskComponent => {
  const { id, category, complete, text } = props;

  const container = Task({ id, category, complete, text });
  document.body.appendChild(container);
  return container;
};

describe("Task", () => {
  beforeEach(() => {
    (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);
    (setLocalStorage as jest.Mock).mockImplementation(jest.fn());
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("should create a li element", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      expect(container).toBeInstanceOf(HTMLLIElement);
      expect(container.tagName).toBe("LI");
    });

    it("should have correct CSS class", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      expect(container).toHaveClass("menu__note-list-item");
    });

    it("should set correct id", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      expect(container.id).toBe("tasks/1");
    });

    it("should be draggable", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      expect(container.draggable).toBe(true);
    });

    it("should render task text", () => {
      renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const text = screen.getByRole("heading", {
        name: "Test task",
        level: 2,
      });

      expect(text).toBeInTheDocument();
      expect(text).toHaveClass("menu__note-list-item-wrapper-text");
    });

    it("should render delete button", () => {
      renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const button = screen.getByRole("button", { name: /delete task 1/i });

      expect(button).toBeInTheDocument();
    });

    it("should add line class when complete is true", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: true,
        text: "Test task",
      });

      expect(container).toHaveClass("menu__note-list-item--line");
    });

    it("should not add line class when complete is false", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      expect(container).not.toHaveClass("menu__note-list-item--line");
    });
  });

  describe("Delete Task Functionality", () => {
    it("should delete task when delete button is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const button = screen.getByRole("button", { name: /delete task 1/i });

      await user.click(button);

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, []);
      expect(container).not.toBeInTheDocument();
    });

    it("should remove task from localStorage", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);

      renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Task 1",
      });

      const button = screen.getByRole("button", { name: /delete task 1/i });

      await user.click(button);

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, [
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);
    });

    it("should call cleanup after deletion", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });
      const cleanupSpy = jest.spyOn(container, "cleanup");

      const button = screen.getByRole("button", { name: /delete task 1/i });

      await user.click(button);

      expect(cleanupSpy).toHaveBeenCalled();
    });

    it("should delete task with right click", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      await user.pointer({ keys: "[MouseRight]", target: container });

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, []);
    });
  });

  describe("Complete Task Functionality", () => {
    it("should toggle complete status when clicked on mobile", async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      await user.pointer({ keys: "[MouseLeft]", target: container });

      expect(container).toHaveClass("menu__note-list-item--line");
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            complete: true,
          }),
        ])
      );
    });

    it("should toggle complete status with middle click", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      await user.pointer({ keys: "[MouseMiddle]", target: container });

      expect(container).toHaveClass("menu__note-list-item--line");
      expect(setLocalStorage).toHaveBeenCalled();
    });

    it("should remove line class when already complete", async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: true },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: true,
        text: "Test task",
      });

      expect(container).toHaveClass("menu__note-list-item--line");

      await user.pointer({ keys: "[MouseLeft]", target: container });

      expect(container).not.toHaveClass("menu__note-list-item--line");
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            complete: false,
          }),
        ])
      );
    });

    it("should update task in localStorage", async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 500,
      });

      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      await user.pointer({ keys: "[MouseLeft]", target: container });

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, [
        { id: "1", category: "tasks", text: "Test task", complete: true },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);
    });
  });

  describe("Drag and Drop Functionality", () => {
    it("should set data on drag start", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const dragEvent = new DragEvent("dragstart", {
        bubbles: true,
        dataTransfer: new DataTransfer(),
      });

      container.dispatchEvent(dragEvent);

      expect(dragEvent.dataTransfer?.getData("text")).toBe("tasks/1");
    });

    it("should update category on drag end", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const menu = document.createElement("div");
      menu.id = "progress";
      menu.className = "menu";

      const menuNote = document.createElement("div");
      menuNote.className = "menu__note";

      const tasksList = document.createElement("ul");
      tasksList.className = "menu__note-list-progress";

      menuNote.appendChild(tasksList);
      menu.appendChild(menuNote);
      document.body.appendChild(menu);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });
      tasksList.appendChild(container);

      const dragEvent = new DragEvent("dragend", { bubbles: true });

      container.dispatchEvent(dragEvent);

      expect(container.id).toBe("progress/1");
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            category: "progress",
          }),
        ])
      );
    });

    it("should preserve other tasks when updating category", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);

      const menu = document.createElement("div");
      menu.id = "progress";
      menu.className = "menu";

      const menuNote = document.createElement("div");
      menuNote.className = "menu__note";

      const tasksList = document.createElement("ul");
      tasksList.className = "menu__note-list-progress";

      menuNote.appendChild(tasksList);
      menu.appendChild(menuNote);
      document.body.appendChild(menu);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });
      tasksList.appendChild(container);

      const dragEvent = new DragEvent("dragend", { bubbles: true });

      container.dispatchEvent(dragEvent);

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, [
        { id: "1", category: "progress", text: "Test task", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);
    });
  });

  describe("Props", () => {
    it("should handle different id values", () => {
      const ids = ["1", "abc-123", "task-uuid"];

      ids.forEach((id) => {
        document.body.innerHTML = "";
        const container = renderComponent({
          id: id,
          category: "tasks",
          complete: false,
          text: "Test",
        });

        expect(container.id).toBe(`tasks/${id}`);
      });
    });

    it("should handle different category values", () => {
      const categories = ["tasks", "progress", "finish"];

      categories.forEach((category) => {
        document.body.innerHTML = "";
        const container = renderComponent({
          id: "1",
          category: category,
          complete: false,
          text: "Test",
        });

        expect(container.id).toBe(`${category}/1`);
      });
    });

    it("should handle different text values", () => {
      const texts = [
        "Simple task",
        "Task with special chars !@#",
        "Very long task text that goes on and on",
      ];

      texts.forEach((text) => {
        document.body.innerHTML = "";
        renderComponent({
          id: "1",
          category: "tasks",
          complete: false,
          text: text,
        });

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent(text);
      });
    });
  });

  describe("Cleanup", () => {
    it("should have cleanup function", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      expect(typeof container.cleanup).toBe("function");
    });

    it("should remove all event listeners on cleanup", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const removeEventListenerSpy = jest.spyOn(
        container,
        "removeEventListener"
      );

      container.cleanup?.();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "mousedown",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "dragstart",
        expect.any(Function)
      );
      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "dragend",
        expect.any(Function)
      );
    });

    it("should remove button event listener on cleanup", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const button = container.querySelector<HTMLButtonElement>(
        ".menu__note-list-item-wrapper-btn-delete-1"
      );

      const removeEventListenerSpy = jest.spyOn(button!, "removeEventListener");

      container.cleanup?.();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "click",
        expect.any(Function)
      );
    });
  });

  describe("DOM Structure", () => {
    it("should have wrapper div", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const wrapper = container.querySelector<HTMLDivElement>(
        ".menu__note-list-item-wrapper"
      );

      expect(wrapper).toBeInTheDocument();
    });

    it("should nest elements correctly", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const wrapper = container.querySelector<HTMLDivElement>(
        ".menu__note-list-item-wrapper"
      );
      const text = container.querySelector<HTMLHeadingElement>(
        ".menu__note-list-item-wrapper-text"
      );

      expect(text?.parentElement).toBe(wrapper);
    });

    it("should have delete button inside wrapper", () => {
      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      const wrapper = container.querySelector<HTMLDivElement>(
        ".menu__note-list-item-wrapper"
      );
      const button = container.querySelector<HTMLButtonElement>(
        ".menu__note-list-item-wrapper-btn-delete-1"
      );

      expect(button?.parentElement).toBe(wrapper);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty text", () => {
      renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "",
      });

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toHaveTextContent("");
    });

    it("should handle special characters in text", () => {
      const specialText = "<script>alert('test')</script>";
      renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: specialText,
      });

      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading.innerHTML).toContain("alert('test')");
    });
    it("should not interfere with desktop left click", async () => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1920,
      });

      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderComponent({
        id: "1",
        category: "tasks",
        complete: false,
        text: "Test task",
      });

      await user.pointer({ keys: "[MouseLeft]", target: container });

      expect(setLocalStorage).not.toHaveBeenCalled();
    });
  });
});
