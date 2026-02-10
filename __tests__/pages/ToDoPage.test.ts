import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";
import type { MenuComponent, TaskComponent } from "@/types/components";

import { ToDoPage } from "@/pages/ToDoPage/ToDoPage";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";

jest.mock("@/helpers/getTasksFromLocalStorage");

const renderPage = (): Page => {
  const container = ToDoPage();
  document.body.appendChild(container);
  return container;
};

describe("ToDoPage", () => {
  beforeEach(() => {
    (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  describe("Render", () => {
    it("should create a main element", () => {
      renderPage();

      const main = screen.getByRole("main");

      expect(main).toBeInstanceOf(HTMLElement);
      expect(main.tagName).toBe("MAIN");
    });

    it("should have correct CSS class", () => {
      renderPage();

      const main = screen.getByRole("main");

      expect(main).toHaveClass("todo-page");
    });

    it("should render menus section", () => {
      const container = renderPage();

      const menus = container.querySelector<HTMLElement>(".menus");

      expect(menus).toBeInTheDocument();
      expect(menus?.tagName).toBe("SECTION");
    });

    it("should render three menus", () => {
      renderPage();

      const tasksMenu = screen.getByRole("heading", {
        name: "TASKS TO DO",
        level: 2,
      });
      const progressMenu = screen.getByRole("heading", {
        name: "IN PROGRESS",
        level: 2,
      });
      const finishMenu = screen.getByRole("heading", {
        name: "FINISH",
        level: 2,
      });

      expect(tasksMenu).toBeInTheDocument();
      expect(progressMenu).toBeInTheDocument();
      expect(finishMenu).toBeInTheDocument();
    });

    it("should render tasks menu with correct id", () => {
      const container = renderPage();

      const tasksMenu = container.querySelector<MenuComponent>("#tasks");

      expect(tasksMenu).toBeInTheDocument();
      expect(tasksMenu).toHaveClass("menu");
    });

    it("should render progress menu with correct id", () => {
      const container = renderPage();

      const progressMenu = container.querySelector<MenuComponent>("#progress");

      expect(progressMenu).toBeInTheDocument();
      expect(progressMenu).toHaveClass("menu");
    });

    it("should render finish menu with correct id", () => {
      const container = renderPage();

      const finishMenu = container.querySelector<MenuComponent>("#finish");

      expect(finishMenu).toBeInTheDocument();
      expect(finishMenu).toHaveClass("menu");
    });
  });

  describe("Load Tasks from LocalStorage", () => {
    it("should load tasks on mount", () => {
      renderPage();

      expect(getTasksFromLocalStorage).toHaveBeenCalled();
    });

    it("should render task in correct category", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Test task", complete: false },
      ]);

      const container = renderPage();

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      const task = tasksList?.querySelector<TaskComponent>(
        ".menu__note-list-item"
      );

      expect(task).toBeInTheDocument();
      expect(task?.id).toBe("tasks/1");
    });

    it("should render multiple tasks in different categories", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "progress", text: "Task 2", complete: false },
        { id: "3", category: "finish", text: "Task 3", complete: true },
      ]);

      const container = renderPage();

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      const progressList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-progress"
      );
      const finishList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-finish"
      );

      expect(tasksList?.children.length).toBe(1);
      expect(progressList?.children.length).toBe(1);
      expect(finishList?.children.length).toBe(1);
    });

    it("should render multiple tasks in same category", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
        { id: "3", category: "tasks", text: "Task 3", complete: false },
      ]);

      const container = renderPage();

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );

      expect(tasksList?.children.length).toBe(3);
    });

    it("should render tasks with correct properties", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "abc-123", category: "tasks", text: "Test task", complete: true },
      ]);

      const container = renderPage();

      const task = container.querySelector<TaskComponent>(
        ".menu__note-list-item"
      );

      expect(task?.id).toBe("tasks/abc-123");
      expect(task).toHaveClass("menu__note-list-item--line");
    });

    it("should render no tasks when localStorage is empty", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);

      const container = renderPage();

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      const progressList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-progress"
      );
      const finishList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-finish"
      );

      expect(tasksList?.children.length).toBe(0);
      expect(progressList?.children.length).toBe(0);
      expect(finishList?.children.length).toBe(0);
    });

    it("should append tasks to correct list", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "progress", text: "Task 1", complete: false },
      ]);

      const container = renderPage();

      const progressList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-progress"
      );
      const task = progressList?.querySelector<TaskComponent>("#progress\\/1");

      expect(task).toBeInTheDocument();
      expect(task?.parentElement).toBe(progressList);
    });
  });

  describe("Cleanup", () => {
    it("should have cleanup function", () => {
      const container = renderPage();

      expect(typeof container.cleanup).toBe("function");
    });

    it("should call cleanup on all menus", () => {
      const container = renderPage();

      const tasksMenu = container.querySelector<MenuComponent>("#tasks")!;
      const progressMenu = container.querySelector<MenuComponent>("#progress")!;
      const finishMenu = container.querySelector<MenuComponent>("#finish")!;

      const tasksCleanupSpy = jest.spyOn(tasksMenu, "cleanup");
      const progressCleanupSpy = jest.spyOn(progressMenu, "cleanup");
      const finishCleanupSpy = jest.spyOn(finishMenu, "cleanup");

      container.cleanup?.();

      expect(tasksCleanupSpy).toHaveBeenCalled();
      expect(progressCleanupSpy).toHaveBeenCalled();
      expect(finishCleanupSpy).toHaveBeenCalled();
    });

    it("should call cleanup on all tasks", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "progress", text: "Task 2", complete: false },
      ]);

      const container = renderPage();

      const tasks = container.querySelectorAll<TaskComponent>(
        ".menu__note-list-item"
      );
      const task1CleanupSpy = jest.spyOn(tasks[0]!, "cleanup");
      const task2CleanupSpy = jest.spyOn(tasks[1]!, "cleanup");

      container.cleanup?.();

      expect(task1CleanupSpy).toHaveBeenCalled();
      expect(task2CleanupSpy).toHaveBeenCalled();
    });

    it("should handle cleanup with no tasks", () => {
      const container = renderPage();

      expect(() => container.cleanup?.()).not.toThrow();
    });
  });

  describe("DOM Structure", () => {
    it("should nest menus inside menus section", () => {
      const container = renderPage();

      const menus = container.querySelector<HTMLElement>(".menus");
      const tasksMenu = container.querySelector<MenuComponent>("#tasks");

      expect(tasksMenu?.parentElement).toBe(menus);
    });

    it("should render all three menus inside menus section", () => {
      const container = renderPage();

      const menus = container.querySelector<HTMLElement>(".menus");

      expect(menus?.children.length).toBe(3);
    });

    it("should render menus in correct order", () => {
      const container = renderPage();

      const menus = container.querySelector<HTMLElement>(".menus");
      const children = Array.from(menus?.children ?? []);

      expect(children[0]!.id).toBe("tasks");
      expect(children[1]!.id).toBe("progress");
      expect(children[2]!.id).toBe("finish");
    });

    it("should nest tasks inside correct menu list", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
      ]);

      const container = renderPage();

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      const task = container.querySelector<TaskComponent>("#tasks\\/1");

      expect(task?.parentElement).toBe(tasksList);
    });
  });

  describe("Integration", () => {
    it("should create functional page with all components", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "progress", text: "Task 2", complete: true },
        { id: "3", category: "finish", text: "Task 3", complete: true },
      ]);

      const container = renderPage();

      expect(container).toBeInTheDocument();
      expect(
        container.querySelector<MenuComponent>("#tasks")
      ).toBeInTheDocument();
      expect(
        container.querySelector<MenuComponent>("#progress")
      ).toBeInTheDocument();
      expect(
        container.querySelector<MenuComponent>("#finish")
      ).toBeInTheDocument();
      expect(
        container.querySelectorAll<TaskComponent>(".menu__note-list-item")
      ).toHaveLength(3);
    });

    it("should maintain task references for cleanup", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "Task 1", complete: false },
        { id: "2", category: "tasks", text: "Task 2", complete: false },
      ]);

      const container = renderPage();

      container.cleanup?.();

      expect(() => container.cleanup?.()).not.toThrow();
    });
  });

  describe("Edge Cases", () => {
    it("should handle tasks with special characters", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        {
          id: "1",
          category: "tasks",
          text: "Task with <script>alert('xss')</script>",
          complete: false,
        },
      ]);

      const container = renderPage();

      const task = container.querySelector<TaskComponent>(
        ".menu__note-list-item"
      );
      expect(task).toBeInTheDocument();
    });

    it("should handle very long task lists", () => {
      const tasks = Array.from({ length: 100 }, (_, i) => ({
        id: `${i}`,
        category: "tasks",
        text: `Task ${i}`,
        complete: false,
      }));

      (getTasksFromLocalStorage as jest.Mock).mockReturnValue(tasks);

      const container = renderPage();

      const tasksList = container.querySelector<HTMLUListElement>(
        ".menu__note-list-tasks"
      );
      expect(tasksList?.children.length).toBe(100);
    });

    it("should handle tasks with invalid category gracefully", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        {
          id: "1",
          category: "invalid-category",
          text: "Task 1",
          complete: false,
        },
      ]);

      const container = renderPage();

      expect(container).toBeInTheDocument();
    });

    it("should handle empty task text", () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "tasks", text: "", complete: false },
      ]);

      const container = renderPage();

      const task = container.querySelector<TaskComponent>(
        ".menu__note-list-item"
      );
      expect(task).toBeInTheDocument();
    });
  });

  describe("Return Type", () => {
    it("should return Page type", () => {
      const container = renderPage();

      expect(container).toBeInstanceOf(HTMLElement);
      expect(typeof container.cleanup).toBe("function");
    });

    it("should be appendable to DOM", () => {
      const container = ToDoPage();

      document.body.appendChild(container);

      expect(document.body.contains(container)).toBe(true);
    });
  });
});
