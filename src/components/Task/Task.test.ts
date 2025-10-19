import { screen } from "@testing-library/dom";
import user from "@testing-library/user-event";

import { TaskProps } from "@src/entities/props";

import { Task } from "@src/components/Task/Task";

import { getTasksFromLocalStorage } from "@src/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@src/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@src/constants/vars";

type RenderComponent = {
  container: HTMLLIElement;
  props: TaskProps;
};

const renderComponent = (custom?: Partial<TaskProps>): RenderComponent => {
  const props: TaskProps = {
    id: "task-1",
    category: "todo",
    complete: false,
    text: "My first task",
    ...custom,
  };

  const container = Task(props);
  document.body.appendChild(container);

  return { container: container, props: props };
};

jest.mock("@src/helpers/getTasksFromLocalStorage");
jest.mock("@src/helpers/setLocalStorage");

Object.defineProperty(globalThis, "DragEvent", {
  value: class DragEvent extends Event {
    public readonly dataTransfer: DataTransfer | null;
    constructor(type: string, params: DragEventInit = {}) {
      super(type, params);
      this.dataTransfer = params.dataTransfer ?? null;
    }
  },
});

describe("Task.ts", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    jest.clearAllMocks();
    (getTasksFromLocalStorage as jest.Mock).mockReturnValue([
      {
        id: "task-1",
        category: "todo",
        text: "My first task",
        complete: false,
      },
    ]);
  });

  describe("General Tests.", () => {
    test("It should render a li element with correct class and id", () => {
      const { container, props } = renderComponent();

      expect(container).toBeInstanceOf(HTMLLIElement);
      expect(container.classList.contains("menu__note-list-item")).toBe(true);
      expect(container.id).toBe(`${props.category}/${props.id}`);
    });

    test("It should render text and delete button correctly", () => {
      const { props } = renderComponent();

      const text = screen.getByText(props.text);
      const deleteBtn = screen.getByRole("button", {
        name: new RegExp(`delete task ${props.id}`, "i"),
      });

      expect(text).toBeInTheDocument();
      expect(deleteBtn).toBeInTheDocument();
    });

    test("It should apply 'line' class when complete is true", () => {
      const { container } = renderComponent({ complete: true });
      expect(container.classList.contains("menu__note-list-item--line")).toBe(
        true
      );
    });
  });

  describe("Complete Task Behavior.", () => {
    test("It should toggle line class and update localStorage", () => {
      const { container, props } = renderComponent();
      const li = container;

      expect(li.classList.contains("menu__note-list-item--line")).toBe(false);

      Object.defineProperty(window, "innerWidth", {
        value: 800,
        configurable: true,
      });
      li.dispatchEvent(new MouseEvent("mousedown", { button: 0 }));

      expect(li.classList.contains("menu__note-list-item--line")).toBe(true);
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.arrayContaining([
          expect.objectContaining({
            id: props.id,
            complete: true,
          }),
        ])
      );
    });
  });

  describe("Delete Task Behavior.", () => {
    test("It should remove element and update localStorage", async () => {
      const { container, props } = renderComponent();

      const deleteBtn = screen.getByRole("button", {
        name: new RegExp(`delete task ${props.id}`, "i"),
      });

      expect(document.body.contains(container)).toBe(true);
      await user.click(deleteBtn);

      expect(document.body.contains(container)).toBe(false);
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.not.arrayContaining([expect.objectContaining({ id: props.id })])
      );
    });
  });

  describe("Drag Events.", () => {
    test("It should set dataTransfer text on dragstart", () => {
      const { container } = renderComponent();

      const dataTransferMock = {
        setData: jest.fn(),
      } as unknown as DataTransfer;

      const dragStartEvent = new DragEvent("dragstart", {
        dataTransfer: dataTransferMock,
      });
      container.dispatchEvent(dragStartEvent);

      expect(dataTransferMock.setData).toHaveBeenCalledWith(
        "text",
        container.id
      );
    });
  });

  describe("Right Click Delete Behavior.", () => {
    test("It should delete task on right click (button 2)", async () => {
      const { container, props } = renderComponent();

      expect(document.body.contains(container)).toBe(true);

      await user.pointer([{ target: container, keys: "[MouseRight]" }]);

      expect(document.body.contains(container)).toBe(false);
      expect(setLocalStorage).toHaveBeenCalledWith(
        LOCAL_STORAGE_TASKS_KEY,
        expect.not.arrayContaining([expect.objectContaining({ id: props.id })])
      );
    });
  });
});
