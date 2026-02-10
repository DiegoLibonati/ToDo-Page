import type { Page } from "@/types/pages";
import type { TaskComponent } from "@/types/components";

import { Menu } from "@/components/Menu/Menu";
import { Task } from "@/components/Task/Task";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";

import "@/pages/ToDoPage/ToDoPage.css";

export const ToDoPage = (): Page => {
  const main = document.createElement("main") as Page;
  main.className = "todo-page";

  main.innerHTML = `
    <section class="menus"></section>
  `;

  const tasks = getTasksFromLocalStorage();

  const menus = main.querySelector<HTMLElement>(".menus");

  const menuTasks = Menu({ id: "tasks", title: "TASKS TO DO" });
  const menuInProgress = Menu({ id: "progress", title: "IN PROGRESS" });
  const menuFinish = Menu({ id: "finish", title: "FINISH" });

  menus?.append(menuTasks, menuInProgress, menuFinish);

  const allTasks: TaskComponent[] = [];

  tasks.forEach((task) => {
    const tasksList = main.querySelector<HTMLUListElement>(
      `.menu__note-list-${task.category}`
    );

    const taskComponent = Task({
      id: task.id,
      category: task.category,
      complete: task.complete,
      text: task.text,
    });

    tasksList?.append(taskComponent);
    allTasks.push(taskComponent);
  });

  main.cleanup = (): void => {
    menuTasks.cleanup?.();
    menuInProgress.cleanup?.();
    menuFinish.cleanup?.();

    allTasks.forEach((task) => {
      task.cleanup?.();
    });
  };

  return main;
};
