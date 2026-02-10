import { v4 as uuidv4 } from "uuid";

import type { Task as TaskT } from "@/types/app";
import type { MenuProps } from "@/types/props";
import type { MenuComponent, TaskComponent } from "@/types/components";

import { Task } from "@/components/Task/Task";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@/constants/vars";

import "@/components/Menu/Menu.css";

export const Menu = ({ id, title }: MenuProps): MenuComponent => {
  const divRoot = document.createElement("div") as MenuComponent;
  divRoot.className = "menu";
  divRoot.id = id;

  divRoot.innerHTML = `
    <div class="menu__header">
        <h2 class="menu__title">${title}</h2>

        <button class="menu__btn-open-menu menu__btn-open-menu-${id}" aria-label="open menu ${id}">
            <i class="fa-solid fa-chevron-down menu__btn-open-menu-icon"></i>
        </button>
    </div>

    <form class="menu__form menu__form-${id}">
        <input type="text" class="menu__form-input menu__form-input-${id}" />
        <button
            type="submit"
            class="menu__form-btn-accept"
            aria-label="button accept ${id}"
        >
            <i class="fa-solid fa-check menu__form-btn-accept-icon"></i>
        </button>
    </form>

    <div class="menu__config menu__config-${id}">
        <div class="menu__config-header">
            <button
                type="button"
                class="menu__config-header-btn-close menu__config-header-btn-close-${id}"
                aria-label="close menu ${id}"
            >
                <i class="fa-solid fa-chevron-up menu__config-header-btn-close-icon"></i>
            </button>
        </div>

        <div class="menu__config-actions">
            <button
                type="button"
                class="menu__config-actions-btn-clear-all-tasks menu__config-actions-btn-clear-all-tasks-${id}"
                aria-label="clear all tasks ${id}"
            >
                CLEAR ALL TASKS
            </button>
        </div>
    </div>

    <div class="menu__note">
        <ul class="menu__note-list menu__note-list-${id}"></ul>
    </div>
  `;

  const btnMenuOpen = divRoot.querySelector<HTMLButtonElement>(
    `.menu__btn-open-menu-${id}`
  )!;
  const btnMenuClose = divRoot.querySelector<HTMLButtonElement>(
    `.menu__config-header-btn-close-${id}`
  )!;
  const bntClearAllTasks = divRoot.querySelector<HTMLButtonElement>(
    `.menu__config-actions-btn-clear-all-tasks-${id}`
  )!;
  const menuForm = divRoot.querySelector<HTMLFormElement>(`.menu__form-${id}`)!;
  const tasksList = divRoot.querySelector<HTMLUListElement>(
    `.menu__note-list-${id}`
  )!;

  const activeTasks = new Set<TaskComponent>();

  const handleClickAddTask = (e: SubmitEvent): void => {
    e.preventDefault();

    const input = divRoot.querySelector<HTMLInputElement>(
      `.menu__form-input-${id}`
    );
    const tasksList = divRoot.querySelector<HTMLUListElement>(
      `.menu__note-list-${id}`
    );

    const tasksLocalStorage = getTasksFromLocalStorage();

    const idTask = uuidv4();
    const categoryTask = id;
    const valueTask = input!.value.trim();
    const completeTask = false;

    if (!valueTask) return;

    const task: TaskT = {
      id: idTask,
      category: categoryTask,
      text: valueTask,
      complete: completeTask,
    };

    const taskComponent = Task({
      id: task.id,
      category: task.category,
      complete: task.complete,
      text: task.text,
    });

    tasksList?.append(taskComponent);
    activeTasks.add(taskComponent);

    tasksLocalStorage.push(task);
    setLocalStorage(LOCAL_STORAGE_TASKS_KEY, tasksLocalStorage);

    input!.value = "";
  };

  const handleDragOver = (e: DragEvent): void => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent): void => {
    e.preventDefault();
    const target = e.target as HTMLUListElement;

    try {
      const idLiElement = e.dataTransfer?.getData("text");
      const element = document.querySelector<HTMLLIElement>(
        `#${CSS.escape(idLiElement!)}`
      );
      if (element) target.appendChild(element);
    } catch (e) {
      alert(e);
    }
  };

  const handleClickHeader = (_: PointerEvent): void => {
    const menuConfig = divRoot.querySelector<HTMLDivElement>(
      `.menu__config-${id}`
    );

    menuConfig?.classList.add("menu__config--open");
  };

  const handleCloseHeader = (_: PointerEvent): void => {
    const menuConfig = divRoot.querySelector<HTMLDivElement>(
      `.menu__config-${id}`
    );

    menuConfig?.classList.remove("menu__config--open");
  };

  const handleClearAllTasks = (_: PointerEvent): void => {
    const tasks = getTasksFromLocalStorage();

    const tasksList = divRoot.querySelector<HTMLUListElement>(
      `.menu__note-list-${id}`
    );

    activeTasks.forEach((task) => {
      task.cleanup?.();
    });
    activeTasks.clear();

    tasksList?.replaceChildren();

    const newList = tasks.filter((value) => {
      return value.category !== id;
    });

    setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
  };

  menuForm.addEventListener("submit", handleClickAddTask);
  tasksList.addEventListener("dragover", handleDragOver);
  tasksList.addEventListener("drop", handleDrop);
  btnMenuOpen.addEventListener("click", handleClickHeader);
  btnMenuClose.addEventListener("click", handleCloseHeader);
  bntClearAllTasks.addEventListener("click", handleClearAllTasks);

  divRoot.cleanup = (): void => {
    menuForm.removeEventListener("submit", handleClickAddTask);
    tasksList.removeEventListener("dragover", handleDragOver);
    tasksList.removeEventListener("drop", handleDrop);
    btnMenuOpen.removeEventListener("click", handleClickHeader);
    btnMenuClose.removeEventListener("click", handleCloseHeader);
    bntClearAllTasks.removeEventListener("click", handleClearAllTasks);

    activeTasks.forEach((task) => {
      task.cleanup?.();
    });
    activeTasks.clear();
  };

  return divRoot;
};
