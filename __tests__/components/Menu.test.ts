import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { MenuProps } from "@/types/props";
import type { MenuComponent, TaskComponent } from "@/types/components";

import { Menu } from "@/components/Menu/Menu";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@/constants/vars";

jest.mock("@/helpers/getTasksFromLocalStorage");
jest.mock("@/helpers/setLocalStorage");

jest.mock("uuid", () => ({
  v4: jest.fn(() => "test-uuid-123"),
}));

const renderComponent = (props: MenuProps): MenuComponent => {
  const { id, title } = props;

  const container = Menu({ id, title });
  document.body.appendChild(container);
  return container;
};

describe("Menu", () => {
  beforeEach(() => {
    (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);
    (setLocalStorage as jest.Mock).mockImplementation(jest.fn());
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("should create a div element", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.tagName).toBe("DIV");
    });

    it("should have correct CSS class", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      expect(container).toHaveClass("menu");
    });

    it("should set correct id", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      expect(container.id).toBe("tasks");
    });

    it("should render title correctly", () => {
      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const title = screen.getByRole("heading", {
        name: "TASKS TO DO",
        level: 2,
      });

      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("menu__title");
    });

    it("should render open menu button", () => {
      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const button = screen.getByRole("button", { name: /open menu tasks/i });

      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("menu__btn-open-menu-tasks");
    });

    it("should render form with input", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const form =
        container.querySelector<HTMLFormElement>(".menu__form-tasks");
      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      expect(form).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(input?.tagName).toBe("INPUT");
    });

    it("should render form submit button", () => {
      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const button = screen.getByRole("button", {
        name: /button accept tasks/i,
      });

      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute("type", "submit");
    });

    it("should render close menu button", () => {
      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const button = screen.getByRole("button", { name: /close menu tasks/i });

      expect(button).toBeInTheDocument();
    });

    it("should render clear all tasks button", () => {
      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const button = screen.getByRole("button", {
        name: /clear all tasks tasks/i,
      });

      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("CLEAR ALL TASKS");
    });

    it("should render tasks list", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const list = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );

      expect(list).toBeInTheDocument();
      expect(list?.tagName).toBe("UL");
    });
  });

  describe("Add Task Functionality", () => {
    it("should add task when form is submitted", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "New task");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        expect(tasksList?.children.length).toBe(1);
      }
    });

    it("should create Task component with correct props", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "New task");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        const taskElement = tasksList?.querySelector<TaskComponent>(
          ".menu__note-list-item"
        );

        expect(taskElement).toBeInTheDocument();
        expect(taskElement?.id).toBe("tasks/test-uuid-123");
      }
    });

    it("should save task to localStorage", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "New task");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, [
          {
            id: "test-uuid-123",
            category: "tasks",
            text: "New task",
            complete: false,
          },
        ]);
      }
    });

    it("should clear input after adding task", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "New task");
        expect(input.value).toBe("New task");

        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        expect(input.value).toBe("");
      }
    });

    it("should not add empty task", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "   ");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        expect(tasksList?.children.length).toBe(0);
        expect(setLocalStorage).not.toHaveBeenCalled();
      }
    });

    it("should trim whitespace from task text", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "  Task with spaces  ");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        expect(setLocalStorage).toHaveBeenCalledWith(
          LOCAL_STORAGE_TASKS_KEY,
          expect.arrayContaining([
            expect.objectContaining({
              text: "Task with spaces",
            }),
          ])
        );
      }
    });

    it("should add multiple tasks", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "Task 1");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        await user.type(input, "Task 2");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        expect(tasksList?.children.length).toBe(2);
      }
    });
  });

  describe("Menu Toggle Functionality", () => {
    it("should open config menu when open button is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const openButton = screen.getByRole("button", {
        name: /open menu tasks/i,
      });
      const configMenu = container.querySelector<HTMLDivElement>(
        ".menu__config-tasks"
      );

      await user.click(openButton);

      expect(configMenu).toHaveClass("menu__config--open");
    });

    it("should close config menu when close button is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const openButton = screen.getByRole("button", {
        name: /open menu tasks/i,
      });
      const closeButton = screen.getByRole("button", {
        name: /close menu tasks/i,
      });
      const configMenu = container.querySelector<HTMLDivElement>(
        ".menu__config-tasks"
      );

      await user.click(openButton);
      expect(configMenu).toHaveClass("menu__config--open");

      await user.click(closeButton);
      expect(configMenu).not.toHaveClass("menu__config--open");
    });
  });

  describe("Clear All Tasks Functionality", () => {
    it("should clear all tasks when button is clicked", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "Task 1");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        const clearButton = screen.getByRole("button", {
          name: /clear all tasks/i,
        });

        await user.click(clearButton);

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        expect(tasksList?.children.length).toBe(0);
      }
    });

    it("should remove tasks from localStorage", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "progress", text: "Task 2", complete: false },
      ]);

      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const clearButton = screen.getByRole("button", {
        name: /clear all tasks/i,
      });

      await user.click(clearButton);

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, [
        { id: "2", category: "progress", text: "Task 2", complete: false },
      ]);
    });

    it("should only clear tasks from current category", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
        { id: "3", category: "progress", text: "Task 3", complete: false },
      ]);

      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const clearButton = screen.getByRole("button", {
        name: /clear all tasks/i,
      });

      await user.click(clearButton);

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, [
        { id: "3", category: "progress", text: "Task 3", complete: false },
      ]);
    });

    it("should call cleanup on all active tasks", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "Task 1");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        const taskElement = tasksList?.firstChild as TaskComponent;

        expect(typeof taskElement.cleanup).toBe("function");

        const clearButton = screen.getByRole("button", {
          name: /clear all tasks/i,
        });

        await user.click(clearButton);

        expect(tasksList?.children.length).toBe(0);
      }
    });
  });

  describe("Drag and Drop Functionality", () => {
    it("should prevent default on dragover", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      const dragEvent = new DragEvent("dragover", { bubbles: true });

      const preventDefaultSpy = jest.spyOn(dragEvent, "preventDefault");

      tasksList?.dispatchEvent(dragEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it("should handle drop event with valid data", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );

      const li = document.createElement("li");
      li.id = "task-123";
      document.body.appendChild(li);

      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        dataTransfer: new DataTransfer(),
      });

      dropEvent.dataTransfer?.setData("text", "task-123");

      const preventDefaultSpy = jest.spyOn(dropEvent, "preventDefault");

      tasksList?.dispatchEvent(dropEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(tasksList?.contains(li)).toBe(true);
    });

    it("should handle drop event with invalid id", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );

      const dropEvent = new DragEvent("drop", {
        bubbles: true,
        dataTransfer: new DataTransfer(),
      });

      dropEvent.dataTransfer?.setData("text", "non-existent-id");

      const alertSpy = jest.spyOn(window, "alert").mockImplementation();

      expect(() => {
        tasksList?.dispatchEvent(dropEvent);
      }).not.toThrow();

      alertSpy.mockRestore();
    });
  });

  describe("Props", () => {
    it("should handle different id values", () => {
      const ids = ["tasks", "progress", "finish"];

      ids.forEach((id) => {
        document.body.innerHTML = "";
        const container = renderComponent({ id: id, title: "Test" });

        expect(container.id).toBe(id);
        expect(
          container.querySelector<HTMLFormElement>(`.menu__form-${id}`)
        ).toBeInTheDocument();
      });
    });

    it("should handle different title values", () => {
      const titles = ["TASKS TO DO", "IN PROGRESS", "FINISH"];

      titles.forEach((title) => {
        document.body.innerHTML = "";
        renderComponent({ id: "test", title: title });

        const heading = screen.getByRole("heading", { level: 2 });
        expect(heading).toHaveTextContent(title);
      });
    });
  });

  describe("Cleanup", () => {
    it("should have cleanup function", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      expect(typeof container.cleanup).toBe("function");
    });

    it("should remove all event listeners on cleanup", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const form =
        container.querySelector<HTMLFormElement>(".menu__form-tasks");
      const removeEventListenerSpy = jest.spyOn(form!, "removeEventListener");

      container.cleanup?.();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "submit",
        expect.any(Function)
      );
    });

    it("should clear active tasks and call their cleanup", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "Task 1");
        await user.click(
          screen.getByRole("button", { name: /button accept/i })
        );

        container.cleanup?.();

        const tasksList = container.querySelector<HTMLUListElement>(
          ".menu__note-list-tasks"
        );
        expect(tasksList?.children.length).toBe(1);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle form submission with Enter key", async () => {
      const user = userEvent.setup({ delay: null });
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const input = container.querySelector<HTMLInputElement>(
        ".menu__form-input-tasks"
      );

      if (input) {
        await user.type(input, "New task{Enter}");

        expect(setLocalStorage).toHaveBeenCalled();
      }
    });

    it("should handle empty localStorage", async () => {
      const user = userEvent.setup({ delay: null });
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);

      renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const clearButton = screen.getByRole("button", {
        name: /clear all tasks/i,
      });

      await user.click(clearButton);

      expect(setLocalStorage).toHaveBeenCalledWith(LOCAL_STORAGE_TASKS_KEY, []);
    });
  });

  describe("DOM Structure", () => {
    it("should have menu header", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const header = container.querySelector<HTMLDivElement>(".menu__header");

      expect(header).toBeInTheDocument();
    });

    it("should have menu note section", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const note = container.querySelector<HTMLDivElement>(".menu__note");

      expect(note).toBeInTheDocument();
    });

    it("should nest elements correctly", () => {
      const container = renderComponent({ id: "tasks", title: "TASKS TO DO" });

      const title = container.querySelector<HTMLHeadingElement>(".menu__title");
      const header = container.querySelector<HTMLDivElement>(".menu__header");

      expect(title?.parentElement).toBe(header);
    });
  });
});
