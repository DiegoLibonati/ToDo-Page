import { screen } from "@testing-library/dom";
import user from "@testing-library/user-event";

import { OFFICIAL_BODY } from "./tests/jest.setup";

beforeEach(() => {
  jest.resetAllMocks();

  document.body.innerHTML = OFFICIAL_BODY;

  require("./index.ts");
  document.dispatchEvent(new Event("DOMContentLoaded"));
});

afterEach(() => {
  document.body.innerHTML = "";
});

test("It should render 3 columns on the page: all, in progress and done.", () => {
  const ids = ["tasks", "progress", "finish"];

  for (let id of ids) {
    const column = document.getElementById(id) as HTMLElement;
    expect(column).toBeInTheDocument();

    const heading = column?.querySelector("h2") as HTMLHeadingElement;
    expect(heading).toBeInTheDocument();
  }
});

test("It must add a task to the To Do column.", async () => {
  const idColumn = "tasks";
  const valueText = "pepe";

  const column = document.getElementById(idColumn) as HTMLElement;
  const listTasks = document.querySelector(
    `.section_container_${idColumn}_note_list`
  );

  expect(column).toBeInTheDocument();
  expect(listTasks).toBeInTheDocument();
  expect(listTasks?.children).toHaveLength(0);

  const input = column?.querySelector("input") as HTMLInputElement;

  await user.clear(input);
  await user.click(input);
  await user.keyboard(valueText);

  expect(input).toHaveValue(valueText);

  const btnAddTask = column.querySelector(".btnAccept") as HTMLButtonElement;

  expect(btnAddTask).toBeInTheDocument();

  await user.click(btnAddTask);

  expect(listTasks?.children).toHaveLength(1);
});

test("It must cross out an existing task if you left click on it.", async () => {
  const idColumn = "tasks";
  const valueText = "pepe";

  const column = document.getElementById(idColumn) as HTMLElement;
  const listTasks = document.querySelector(
    `.section_container_${idColumn}_note_list`
  );

  expect(column).toBeInTheDocument();
  expect(listTasks).toBeInTheDocument();
  expect(listTasks?.children).toHaveLength(0);

  const input = column?.querySelector("input") as HTMLInputElement;

  await user.clear(input);
  await user.click(input);
  await user.keyboard(valueText);

  expect(input).toHaveValue(valueText);

  const btnAddTask = column.querySelector(".btnAccept") as HTMLButtonElement;

  expect(btnAddTask).toBeInTheDocument();

  await user.click(btnAddTask);

  expect(listTasks?.children).toHaveLength(1);

  const task = screen.getByRole("listitem");

  expect(task).toBeInTheDocument();
  expect(task.classList.contains("line")).toBeFalsy();

  await user.click(task);

  expect(task.classList.contains("line")).toBeTruthy();

  await user.click(task);

  expect(task.classList.contains("line")).toBeFalsy();
});

test("It must delete a task when you right click.", async () => {
  const idColumn = "tasks";
  const valueText = "pepe";

  const column = document.getElementById(idColumn) as HTMLElement;
  const listTasks = document.querySelector(
    `.section_container_${idColumn}_note_list`
  );

  expect(column).toBeInTheDocument();
  expect(listTasks).toBeInTheDocument();
  expect(listTasks?.children).toHaveLength(0);

  const input = column?.querySelector("input") as HTMLInputElement;

  await user.clear(input);
  await user.click(input);
  await user.keyboard(valueText);

  expect(input).toHaveValue(valueText);

  const btnAddTask = column.querySelector(".btnAccept") as HTMLButtonElement;

  expect(btnAddTask).toBeInTheDocument();

  await user.click(btnAddTask);

  expect(listTasks?.children).toHaveLength(1);

  const task = screen.getByRole("listitem");

  expect(task).toBeInTheDocument();

  const btnDeleteTask = screen.getByRole("button", { name: /delete task/i });

  await user.pointer({ keys: "[MouseRight>]", target: btnDeleteTask });

  expect(task).not.toBeInTheDocument();
});

test("It must open the actions menu by tapping the open menu button and close the actions menu by tapping the close menu button.", async () => {
  const idColumn = "tasks";

  const menu = document.querySelector(
    `.section_container_${idColumn}_menu`
  ) as HTMLDivElement;
  const btnOpenMenu = screen.getByRole("button", {
    name: `open menu ${idColumn}`,
  });
  const btnCloseMenu = screen.getByRole("button", {
    name: `close menu ${idColumn}`,
  });

  expect(menu).toBeInTheDocument();
  expect(menu.classList.contains("menu")).toBeFalsy();
  expect(btnOpenMenu).toBeInTheDocument();
  expect(btnCloseMenu).toBeInTheDocument();

  await user.click(btnOpenMenu);

  expect(menu.classList.contains("menu")).toBeTruthy();

  await user.click(btnCloseMenu);

  expect(menu.classList.contains("menu")).toBeFalsy();
});

test("It must clear all tasks from the To Do column when you click 'Clear All Tasks'.", async () => {
  const idColumn = "tasks";
  const valueText = "pepe";

  const column = document.getElementById(idColumn) as HTMLElement;
  const listTasks = document.querySelector(
    `.section_container_${idColumn}_note_list`
  );
  const btnClearAllTasks = screen.getByRole("button", {
    name: `clear all tasks ${idColumn}`,
  });

  expect(column).toBeInTheDocument();
  expect(listTasks).toBeInTheDocument();
  expect(listTasks?.children).toHaveLength(0);

  const input = column?.querySelector("input") as HTMLInputElement;

  await user.clear(input);
  await user.click(input);
  await user.keyboard(valueText);

  expect(input).toHaveValue(valueText);

  const btnAddTask = column.querySelector(".btnAccept") as HTMLButtonElement;

  expect(btnAddTask).toBeInTheDocument();

  await user.click(btnAddTask);

  expect(listTasks?.children).toHaveLength(1);

  await user.click(btnClearAllTasks);

  expect(listTasks?.children).toHaveLength(0);
});
