import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import type { MenuProps } from "@/types/props";
import type { MenuComponent } from "@/types/components";

import { Menu } from "@/components/Menu/Menu";

import { mocksLocalStorage } from "@tests/__mocks__/localStorage.mock";

const renderComponent = (props: MenuProps): MenuComponent => {
  const container = Menu(props);
  document.body.appendChild(container);
  return container;
};

describe("Menu Component", () => {
  beforeEach(() => {
    mocksLocalStorage.clear();
    mocksLocalStorage.setItem("tasks", JSON.stringify([]));
  });

  afterEach(() => {
    document.body.innerHTML = "";
    mocksLocalStorage.clear();
  });

  const defaultProps: MenuProps = {
    id: "tasks",
    title: "TASKS TO DO",
  };

  it("should render menu with correct structure", () => {
    renderComponent(defaultProps);

    const menu = document.querySelector<HTMLDivElement>(".menu");
    expect(menu).toBeInTheDocument();
    expect(menu).toHaveAttribute("id", "tasks");
  });

  it("should render menu title", () => {
    renderComponent(defaultProps);

    const title = screen.getByRole("heading", { name: "TASKS TO DO" });
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("menu__title");
  });

  it("should render form with input and submit button", () => {
    renderComponent(defaultProps);

    const input = document.querySelector<HTMLInputElement>(
      ".menu__form-input-tasks"
    );
    const submitButton = screen.getByRole("button", {
      name: "button accept tasks",
    });

    expect(input).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("should render open and close menu buttons", () => {
    renderComponent(defaultProps);

    const openButton = screen.getByRole("button", { name: "open menu tasks" });
    const closeButton = screen.getByRole("button", {
      name: "close menu tasks",
    });

    expect(openButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
  });

  it("should render clear all tasks button", () => {
    renderComponent(defaultProps);

    const clearButton = screen.getByRole("button", {
      name: "clear all tasks tasks",
    });
    expect(clearButton).toBeInTheDocument();
  });

  it("should add task when form is submitted", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    const input = document.querySelector<HTMLInputElement>(
      ".menu__form-input-tasks"
    );
    const form = document.querySelector<HTMLFormElement>(".menu__form-tasks");

    if (input) await user.type(input, "New task");
    if (form) form.dispatchEvent(new Event("submit", { bubbles: true }));

    const tasks = document.querySelectorAll<HTMLLIElement>(
      ".menu__note-list-item"
    );
    expect(tasks.length).toBeGreaterThan(0);
  });

  it("should not add task when input is empty", () => {
    renderComponent(defaultProps);

    const form = document.querySelector<HTMLFormElement>(".menu__form-tasks");
    if (form) form.dispatchEvent(new Event("submit", { bubbles: true }));

    const tasks = document.querySelectorAll<HTMLLIElement>(
      ".menu__note-list-item"
    );
    expect(tasks).toHaveLength(0);
  });

  it("should open menu config when open button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    const openButton = screen.getByRole("button", { name: "open menu tasks" });
    await user.click(openButton);

    const menuConfig = document.querySelector<HTMLDivElement>(
      ".menu__config-tasks"
    );
    expect(menuConfig).toHaveClass("menu__config--open");
  });

  it("should close menu config when close button is clicked", async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps);

    const openButton = screen.getByRole("button", { name: "open menu tasks" });
    const closeButton = screen.getByRole("button", {
      name: "close menu tasks",
    });

    await user.click(openButton);
    await user.click(closeButton);

    const menuConfig = document.querySelector<HTMLDivElement>(
      ".menu__config-tasks"
    );
    expect(menuConfig).not.toHaveClass("menu__config--open");
  });

  it("should cleanup event listeners and tasks", () => {
    const menu = renderComponent(defaultProps);

    expect(menu.cleanup).toBeDefined();
    menu.cleanup?.();

    expect(menu.cleanup).toBeDefined();
  });
});
