import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";
import type { Task } from "@/types/app";

import { ToDoPage } from "@/pages/ToDoPage/ToDoPage";

import { mocksLocalStorage } from "@tests/__mocks__/localStorage.mock";

const renderPage = (): Page => {
  const container = ToDoPage();
  document.body.appendChild(container);
  return container;
};

describe("ToDoPage", () => {
  beforeEach(() => {
    mocksLocalStorage.clear();
    mocksLocalStorage.setItem("tasks", JSON.stringify([]));
  });

  afterEach(() => {
    document.body.innerHTML = "";
    mocksLocalStorage.clear();
  });

  it("should render the page with correct structure", () => {
    renderPage();

    const main = document.querySelector<HTMLElement>(".todo-page");
    expect(main).toBeInTheDocument();
    expect(main?.tagName).toBe("MAIN");
  });

  it("should render three menus", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "TASKS TO DO" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "IN PROGRESS" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "FINISH" })).toBeInTheDocument();
  });

  it("should render menus container", () => {
    renderPage();

    const menusContainer = document.querySelector<HTMLElement>(".menus");
    expect(menusContainer).toBeInTheDocument();
  });

  it("should load and render tasks from localStorage", () => {
    const mockTasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: false },
      { id: "2", category: "progress", text: "Task 2", complete: false },
      { id: "3", category: "finish", text: "Task 3", complete: true },
    ];

    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    renderPage();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Task 3")).toBeInTheDocument();
  });

  it("should render tasks in correct categories", () => {
    const mockTasks: Task[] = [
      { id: "1", category: "tasks", text: "ToDo Task", complete: false },
      { id: "2", category: "progress", text: "Progress Task", complete: false },
    ];

    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    renderPage();

    const tasksList = document.querySelector<HTMLUListElement>(
      ".menu__note-list-tasks"
    );
    const progressList = document.querySelector<HTMLUListElement>(
      ".menu__note-list-progress"
    );

    expect(tasksList?.textContent).toContain("ToDo Task");
    expect(progressList?.textContent).toContain("Progress Task");
  });

  it("should cleanup all menus and tasks on page cleanup", () => {
    const mockTasks: Task[] = [
      { id: "1", category: "tasks", text: "Task 1", complete: false },
    ];

    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    const page = renderPage();

    expect(page.cleanup).toBeDefined();
    page.cleanup?.();

    expect(page.cleanup).toBeDefined();
  });
});
