import { TaskProps } from "@src/entities/props";

import { Task as TaskT } from "@src/entities/app";

import { getTasksFromLocalStorage } from "@src/helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "@src/helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "@src/constants/vars";

import "@src/components/Task/Task.css";

const handleMouseDown = (
  e: MouseEvent,
  id: string,
  idElement: string
): void => {
  const click = e.button as number;

  if (click === 2) handleDeleteTask(e, id, idElement);

  if ((click === 0 && window.innerWidth < 1024) || click === 1)
    handleCompleteTask(e, id, idElement);
};

const handleDragStart = (e: DragEvent): void => {
  const target = e.target as HTMLLIElement;
  e.dataTransfer?.setData("text", target.id);
};

const handleDragEnd = (e: DragEvent, id: string, _: string) => {
  const target = e.target as HTMLLIElement;

  const tasks = getTasksFromLocalStorage();

  const finalCategoryLiContainer =
    target?.parentElement?.parentElement?.parentElement?.id;

  target.id = `${finalCategoryLiContainer}/${id}`;

  const newList = tasks.map((task) => {
    if (task.id === id) {
      task.category = finalCategoryLiContainer!;
    }
    return task;
  });

  setLocalStorage<TaskT[]>(LOCAL_STORAGE_TASKS_KEY, newList);
};

const handleCompleteTask = (e: MouseEvent, id: string, _: string): void => {
  const tasks = getTasksFromLocalStorage();

  const li = e.currentTarget as HTMLLIElement;

  if (li.classList.contains("menu__note-list-item--line"))
    li?.classList.remove("menu__note-list-item--line");
  else li?.classList.add("menu__note-list-item--line");

  const newList = tasks.map((task) => {
    if (task.id === id) {
      task.complete = !task.complete;
    }
    return task;
  });

  setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
};

const handleDeleteTask = (
  e: MouseEvent,
  id: string,
  idElement: string
): void => {
  const task = (
    e.type === "click" ? e.currentTarget : e.target
  ) as HTMLButtonElement;

  console.log(task);

  const tasks = getTasksFromLocalStorage();

  const elementTask = document.querySelector<HTMLLIElement>(
    `#${CSS.escape(idElement)}`
  );
  elementTask?.remove();

  const newList = tasks.filter((task) => task.id !== id);

  setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
};

export const Task = ({
  id,
  category,
  complete,
  text,
}: TaskProps): HTMLLIElement => {
  const liRoot = document.createElement("li");
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
  );

  liRoot.addEventListener("mousedown", (e) =>
    handleMouseDown(e, id, liRoot.id)
  );
  liRoot.addEventListener("dragstart", (e) => handleDragStart(e));
  liRoot.addEventListener("dragend", (e) => handleDragEnd(e, id, liRoot.id));

  btnDelete!.addEventListener("click", (e) =>
    handleDeleteTask(e, id, liRoot.id)
  );

  return liRoot;
};
