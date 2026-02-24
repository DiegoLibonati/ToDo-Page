import { screen } from "@testing-library/dom";

import type { Page } from "@/types/pages";

import { ToDoPage } from "@/pages/ToDoPage/ToDoPage";

import { mocksLocalStorage } from "@tests/__mocks__/localStorage.mock";
import { mockTasks } from "@tests/__mocks__/tasks.mock";

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
    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    renderPage();

    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("should render tasks in correct categories", () => {
    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    renderPage();

    const tasksList = document.querySelector<HTMLUListElement>(
      ".menu__note-list-tasks"
    );
    const progressList = document.querySelector<HTMLUListElement>(
      ".menu__note-list-progress"
    );

    expect(tasksList?.textContent).toContain("Task 1");
    expect(progressList?.textContent).toContain("Task 2");
  });

  it("should cleanup all menus and tasks on page cleanup", () => {
    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    const page = renderPage();

    expect(page.cleanup).toBeDefined();
    page.cleanup?.();

    expect(page.cleanup).toBeDefined();
  });
});
