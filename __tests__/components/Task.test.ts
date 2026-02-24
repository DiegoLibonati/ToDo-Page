import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { TaskProps } from "@/types/props";
import type { TaskComponent } from "@/types/components";

import { Task } from "@/components/Task/Task";

import { mocksLocalStorage } from "@tests/__mocks__/localStorage.mock";
import { mockTasks } from "@tests/__mocks__/tasks.mock";

const renderComponent = (props: TaskProps): TaskComponent => {
  const container = Task(props);
  document.body.appendChild(container);
  return container;
};

describe("Task Component", () => {
  beforeEach(() => {
    mocksLocalStorage.clear();
    mocksLocalStorage.setItem("tasks", JSON.stringify([]));
  });

  afterEach(() => {
    document.body.innerHTML = "";
    mocksLocalStorage.clear();
  });

  const defaultProps: TaskProps = {
    id: "task-1",
    category: "tasks",
    complete: false,
    text: "Test task",
  };

  it("should render task with correct structure", () => {
    renderComponent(defaultProps);

    const task = document.querySelector<HTMLLIElement>(".menu__note-list-item");
    expect(task).toBeInTheDocument();
    expect(task?.tagName).toBe("LI");
    expect(task).toHaveAttribute("draggable", "true");
    expect(task).toHaveAttribute("id", "tasks/task-1");
  });

  it("should render task text", () => {
    renderComponent(defaultProps);

    expect(screen.getByText("Test task")).toBeInTheDocument();
  });

  it("should render delete button", () => {
    renderComponent(defaultProps);

    const deleteButton = screen.getByRole("button", {
      name: "delete task task-1",
    });
    expect(deleteButton).toBeInTheDocument();
  });

  it("should apply completed class when task is complete", () => {
    const completedProps: TaskProps = {
      ...defaultProps,
      complete: true,
    };

    renderComponent(completedProps);

    const task = document.querySelector<HTMLLIElement>(".menu__note-list-item");
    expect(task).toHaveClass("menu__note-list-item--line");
  });

  it("should not apply completed class when task is not complete", () => {
    renderComponent(defaultProps);

    const task = document.querySelector<HTMLLIElement>(".menu__note-list-item");
    expect(task).not.toHaveClass("menu__note-list-item--line");
  });

  it("should delete task when delete button is clicked", async () => {
    const user = userEvent.setup();

    mocksLocalStorage.setItem("tasks", JSON.stringify(mockTasks));

    renderComponent(defaultProps);

    const deleteButton = screen.getByRole("button", {
      name: "delete task task-1",
    });
    await user.click(deleteButton);

    const task = document.querySelector<HTMLLIElement>(".menu__note-list-item");
    expect(task).not.toBeInTheDocument();
  });

  it("should cleanup event listeners", () => {
    const task = renderComponent(defaultProps);

    expect(task.cleanup).toBeDefined();
    task.cleanup?.();

    expect(task.cleanup).toBeDefined();
  });
});
