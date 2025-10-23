import { screen } from "@testing-library/dom";
import user from "@testing-library/user-event";

import { MenuProps } from "@src/entities/props";

import { Menu } from "@src/components/Menu/Menu";
import { Task } from "@src/components/Task/Task";

import { getTasksFromLocalStorage } from "@src/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@src/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@src/constants/vars";

type RenderComponent = {
  container: HTMLDivElement;
  props: MenuProps;
};

const renderComponent = (): RenderComponent => {
  const props = { id: "todo", title: "To Do" };
  const container = Menu(props);
  document.body.appendChild(container);

  return { container: container, props: props };
};

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-uuid"),
}));

jest.mock("@src/components/Task/Task");
jest.mock("@src/helpers/getTasksFromLocalStorage");
jest.mock("@src/helpers/setLocalStorage");

(
  globalThis as unknown as { DragEvent: typeof Event }
).DragEvent = class DragEvent extends Event {
  public readonly dataTransfer: DataTransfer | null;

  constructor(type: string, params: DragEventInit = {}) {
    super(type, params);
    this.dataTransfer = params.dataTransfer ?? null;
  }
};

describe("Menu.ts", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();

    (getTasksFromLocalStorage as jest.Mock).mockReturnValue([]);
    (Task as jest.Mock).mockImplementation(({ text }) => {
      const li = document.createElement("li");
      li.className = "task";
      li.textContent = text;
      return li;
    });
  });

  describe("General Tests.", () => {
    test("It should render the menu component with correct class and id", () => {
      const { container, props } = renderComponent();

      expect(container).toBeInstanceOf(HTMLDivElement);
      expect(container.className).toBe("menu");
      expect(container.id).toBe(props.id);
    });

    test("It should render title and buttons correctly", () => {
      const { props } = renderComponent();

      const title = screen.getByText(props.title);
      const openBtn = screen.getByRole("button", { name: /open menu todo/i });
      const closeBtn = screen.getByRole("button", { name: /close menu todo/i });
      const clearBtn = screen.getByRole("button", {
        name: /clear all tasks todo/i,
      });

      expect(title).toBeInTheDocument();
      expect(openBtn).toBeInTheDocument();
      expect(closeBtn).toBeInTheDocument();
      expect(clearBtn).toBeInTheDocument();
    });

    test("It should render the input form and task list", () => {
      const { props } = renderComponent();

      const form = document.querySelector<HTMLFormElement>(
        `.menu__form-${props.id}`
      );
      const input = document.querySelector<HTMLInputElement>(
        `.menu__form-input-${props.id}`
      );
      const list = document.querySelector<HTMLUListElement>(
        `.menu__note-list-${props.id}`
      );

      expect(form).toBeInTheDocument();
      expect(input).toBeInTheDocument();
      expect(list).toBeInTheDocument();
    });
  });

  describe("Add Task Behavior.", () => {
    test("It should add a task when submitting form", async () => {
      const { props } = renderComponent();

      const input = document.querySelector<HTMLInputElement>(
        `.menu__form-input-${props.id}`
      )!;
      const form = document.querySelector<HTMLFormElement>(
        `.menu__form-${props.id}`
      )!;
      const submitBtn = form.querySelector<HTMLButtonElement>(
        'button[type="submit"]'
      )!;
      const list = document.querySelector<HTMLUListElement>(
        `.menu__note-list-${props.id}`
      )!;

      await user.click(input);
      await user.keyboard("Buy milk");
      await user.click(submitBtn);

      expect(Task).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Buy milk",
          category: "todo",
          complete: false,
          id: "mocked-uuid",
        })
      );

      expect(list.querySelector<HTMLLIElement>(".task")).toBeInTheDocument();
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.arrayContaining([
          expect.objectContaining({ text: "Buy milk", category: "todo" }),
        ])
      );

      expect(input.value).toBe("");
    });
  });

  describe("Header Interaction Tests.", () => {
    test("It should open menu config when open button is clicked", async () => {
      const { props } = renderComponent();

      const openBtn = screen.getByRole("button", { name: /open menu todo/i });
      const config = document.querySelector<HTMLDivElement>(
        `.menu__config-${props.id}`
      )!;

      expect(config.classList.contains("menu__config--open")).toBe(false);

      await user.click(openBtn);

      expect(config.classList.contains("menu__config--open")).toBe(true);
    });

    test("It should close menu config when close button is clicked", async () => {
      const { props } = renderComponent();

      const openBtn = screen.getByRole("button", { name: /open menu todo/i });
      const closeBtn = screen.getByRole("button", { name: /close menu todo/i });
      const config = document.querySelector<HTMLDivElement>(
        `.menu__config-${props.id}`
      )!;

      await user.click(openBtn);
      expect(config.classList.contains("menu__config--open")).toBe(true);

      await user.click(closeBtn);
      expect(config.classList.contains("menu__config--open")).toBe(false);
    });
  });

  describe("Clear All Tasks Tests.", () => {
    test("It should clear all tasks for the given category", async () => {
      (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
        { id: "1", category: "todo", text: "task 1", complete: false },
        { id: "2", category: "other", text: "task 2", complete: true },
      ]);

      const { props } = renderComponent();

      const list = document.querySelector<HTMLUListElement>(
        `.menu__note-list-${props.id}`
      )!;
      const clearBtn = screen.getByRole("button", {
        name: /clear all tasks todo/i,
      });

      const li = document.createElement("li");
      li.textContent = "Task to remove";
      list.append(li);

      await user.click(clearBtn);

      expect(list.children.length).toBe(0);
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.arrayContaining([expect.objectContaining({ category: "other" })])
      );
    });
  });

  describe("Drag and Drop Tests.", () => {
    test("It should prevent default on dragover event", () => {
      const { props } = renderComponent();

      const list = document.querySelector<HTMLUListElement>(
        `.menu__note-list-${props.id}`
      )!;
      const dragOverEvent = new DragEvent("dragover", { cancelable: true });

      const preventDefaultSpy = jest.spyOn(dragOverEvent, "preventDefault");
      list.dispatchEvent(dragOverEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    test("It should append dragged element on drop", () => {
      const { props } = renderComponent();

      const list = document.querySelector<HTMLUListElement>(
        `.menu__note-list-${props.id}`
      )!;
      const li = document.createElement("li");
      li.id = "task-1";
      document.body.append(li);

      const dataTransferMock = {
        getData: jest.fn(() => "task-1"),
      } as unknown as DataTransfer;

      const dropEvent = new DragEvent("drop", {
        cancelable: true,
        dataTransfer: dataTransferMock,
      });

      const preventDefaultSpy = jest.spyOn(dropEvent, "preventDefault");
      list.dispatchEvent(dropEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(list.contains(li)).toBe(true);
    });
  });
});
