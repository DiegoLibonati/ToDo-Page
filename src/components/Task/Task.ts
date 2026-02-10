import type { TaskProps } from "@/types/props";
import type { TaskComponent } from "@/types/components";

import { getTasksFromLocalStorage } from "@/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@/constants/vars";

import "@/components/Task/Task.css";

export const Task = ({
  id,
  category,
  complete,
  text,
}: TaskProps): TaskComponent => {
  const liRoot = document.createElement("li") as TaskComponent;
  liRoot.draggable = true;
  liRoot.className = "menu__note-list-item";
  liRoot.id = `${category}/${id}`;

  if (complete) liRoot.classList.add("menu__note-list-item--line");

  liRoot.innerHTML = `
    <div class="menu__note-list-item-wrapper">
        <h2 class="menu__note-list-item-wrapper-text">${text}</h2>
        <button type="button" aria-label="delete task ${id}" class="menu__note-list-item-wrapper-btn-delete menu__note-list-item-wrapper-btn-delete-${id}">
            <i class="fa-solid fa-trash menu__note-list-item-wrapper-btn-delete-icon"></i>
        </button>
    </div>
  `;

  const btnDelete = liRoot.querySelector<HTMLButtonElement>(
    `.menu__note-list-item-wrapper-btn-delete-${id}`
  )!;

  const handleMouseDown = (e: MouseEvent): void => {
    const click = e.button;

    if (click === 2) handleDeleteTask(e);

    if ((click === 0 && window.innerWidth < 1024) || click === 1)
      handleCompleteTask(e);
  };

  const handleDragStart = (e: DragEvent): void => {
    const target = e.target as HTMLLIElement;
    e.dataTransfer?.setData("text", target.id);
  };

  const handleDragEnd = (e: DragEvent): void => {
    const target = e.target as HTMLLIElement;

    const tasks = getTasksFromLocalStorage();

    const finalCategoryLiContainer =
      target.parentElement?.parentElement?.parentElement?.id;

    target.id = `${finalCategoryLiContainer}/${id}`;

    const newList = tasks.map((task) => {
      if (task.id === id) {
        task.category = finalCategoryLiContainer!;
      }
      return task;
    });

    setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
  };

  const handleCompleteTask = (e: MouseEvent): void => {
    const tasks = getTasksFromLocalStorage();

    const li = e.currentTarget as HTMLLIElement;

    if (li.classList.contains("menu__note-list-item--line"))
      li.classList.remove("menu__note-list-item--line");
    else li.classList.add("menu__note-list-item--line");

    const newList = tasks.map((task) => {
      if (task.id === id) {
        task.complete = !task.complete;
      }
      return task;
    });

    setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
  };

  const handleDeleteTask = (_e: MouseEvent): void => {
    const tasks = getTasksFromLocalStorage();

    liRoot.remove();

    const newList = tasks.filter((task) => task.id !== id);

    setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);

    liRoot.cleanup?.();
  };

  liRoot.addEventListener("mousedown", handleMouseDown);
  liRoot.addEventListener("dragstart", handleDragStart);
  liRoot.addEventListener("dragend", handleDragEnd);

  btnDelete.addEventListener("click", handleDeleteTask);

  liRoot.cleanup = (): void => {
    liRoot.removeEventListener("mousedown", handleMouseDown);
    liRoot.removeEventListener("dragstart", handleDragStart);
    liRoot.removeEventListener("dragend", handleDragEnd);
    btnDelete.removeEventListener("click", handleDeleteTask);
  };

  return liRoot;
};
