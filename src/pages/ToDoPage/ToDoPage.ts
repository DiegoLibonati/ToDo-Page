import { Menu } from "@src/components/Menu/Menu";
import { Task } from "@src/components/Task/Task";

import { getTasksFromLocalStorage } from "@src/helpers/getTasksFromLocalStorage";

import "@src/pages/ToDoPage/ToDoPage.css";

export const ToDoPage = (): HTMLElement => {
  const main = document.createElement("main");
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
  });

  return main;
};
