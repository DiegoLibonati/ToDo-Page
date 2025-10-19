import { screen } from "@testing-library/dom";

import { Menu } from "@src/components/Menu/Menu";
import { Task } from "@src/components/Task/Task";

import { ToDoPage } from "@src/pages/ToDoPage/ToDoPage";

import { getTasksFromLocalStorage } from "@src/helpers/getTasksFromLocalStorage";

type RenderComponent = {
  container: HTMLElement;
};

const renderComponent = (): RenderComponent => {
  const container = ToDoPage();
  document.body.appendChild(container);
  return { container: container };
};

jest.mock("@src/components/Menu/Menu");
jest.mock("@src/components/Task/Task");
jest.mock("@src/helpers/getTasksFromLocalStorage");

describe("ToDoPage.ts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";

    (Menu as jest.Mock).mockImplementation(({ title }) => {
      const div = document.createElement("div");
      div.className = "menu";
      div.textContent = title;
      return div;
    });

    (Task as jest.Mock).mockImplementation(({ text }) => {
      const li = document.createElement("li");
      li.className = "task";
      li.textContent = text;
      return li;
    });

    (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);
  });

  describe("General Tests.", () => {
    test("It should render the main element with correct class", () => {
      const { container } = renderComponent();

      expect(container).toBeInstanceOf(HTMLElement);
      expect(container.className).toBe("todo-page");
      expect(container.querySelector(".menus")).toBeInTheDocument();
    });

    test("It should render three Menu components (TASKS, IN PROGRESS, FINISH)", () => {
      renderComponent();

      expect(Menu).toHaveBeenCalledTimes(3);
      expect(Menu).toHaveBeenCalledWith(
        expect.objectContaining({ id: "tasks", title: "TASKS TO DO" })
      );
      expect(Menu).toHaveBeenCalledWith(
        expect.objectContaining({ id: "progress", title: "IN PROGRESS" })
      );
      expect(Menu).toHaveBeenCalledWith(
        expect.objectContaining({ id: "finish", title: "FINISH" })
      );

      expect(screen.getByText("TASKS TO DO")).toBeInTheDocument();
      expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
      expect(screen.getByText("FINISH")).toBeInTheDocument();
    });
  });

  describe("Tasks Rendering Tests.", () => {
    test("It should render tasks returned from localStorage", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        {
          id: "t1",
          category: "tasks",
          complete: false,
          text: "Buy milk",
        },
        {
          id: "t2",
          category: "finish",
          complete: true,
          text: "Clean room",
        },
      ]);

      renderComponent();

      expect(Task).toHaveBeenCalledTimes(2);
      expect(Task).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "t1",
          text: "Buy milk",
          category: "tasks",
        })
      );
      expect(Task).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "t2",
          text: "Clean room",
          category: "finish",
        })
      );
    });

    test("It should append Task components to the correct menu lists", () => {
      const mockMenuTasks = document.createElement("div");
      mockMenuTasks.className = "menu";
      mockMenuTasks.innerHTML = `<ul class="menu__note-list-tasks"></ul>`;
      const mockMenuFinish = document.createElement("div");
      mockMenuFinish.className = "menu";
      mockMenuFinish.innerHTML = `<ul class="menu__note-list-finish"></ul>`;

      (Menu as jest.Mock)
        .mockReturnValueOnce(mockMenuTasks)
        .mockReturnValueOnce(document.createElement("div"))
        .mockReturnValueOnce(mockMenuFinish);

      const mockTask1 = document.createElement("li");
      mockTask1.className = "task";
      const mockTask2 = document.createElement("li");
      mockTask2.className = "task";

      (Task as jest.Mock)
        .mockReturnValueOnce(mockTask1)
        .mockReturnValueOnce(mockTask2);

      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "t1", category: "tasks", complete: false, text: "Task 1" },
        { id: "t2", category: "finish", complete: true, text: "Task 2" },
      ]);

      const { container } = renderComponent();

      const listTasks = container.querySelector(".menu__note-list-tasks")!;
      const listFinish = container.querySelector(".menu__note-list-finish")!;

      expect(listTasks.contains(mockTask1)).toBe(true);
      expect(listFinish.contains(mockTask2)).toBe(true);
    });
  });

  describe("Integration Tests.", () => {
    test("It should integrate Menu and Task correctly within the .menus section", () => {
      const { container } = renderComponent();
      const menusSection = container.querySelector(".menus");

      expect(menusSection?.children.length).toBe(3);
      expect(Menu).toHaveBeenCalledTimes(3);
    });

    test("It should render no tasks when getTasksFromLocalStorage returns empty array", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);

      renderComponent();

      expect(Task).not.toHaveBeenCalled();
    });
  });
});
