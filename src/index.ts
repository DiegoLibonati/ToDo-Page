import { v4 as uuidv4 } from "uuid";

import { Task } from "./entities/entities";

import { getElements } from "./helpers/getElements";
import { getTasksFromLocalStorage } from "./helpers/getTasksFromLocalStorage";
import { setLocalStorage } from "./helpers/setLocalStorage";

import { LOCAL_STORAGE_TASKS_KEY } from "./constants/constants";

const handleClickAccept = (button: HTMLButtonElement) => {
  const input = button.parentElement?.children[0] as HTMLInputElement;

  const idTask = uuidv4();
  const categoryTask = button.parentElement?.parentElement?.id || "";
  const valueTask = input.value;
  const completeTask = false;

  const task: Task = {
    id: idTask,
    category: categoryTask,
    text: valueTask,
    complete: completeTask,
  };

  insertTaskInContainer(task);

  const tasks = getTasksFromLocalStorage();
  tasks.push(task);
  setLocalStorage(LOCAL_STORAGE_TASKS_KEY, tasks);

  input.value = "";
};

const handleClickHeader = (e: Event) => {
  const target = e.currentTarget as HTMLElement;
  const menuContainer = target?.parentElement?.parentElement?.children[2];

  menuContainer?.classList.add("menu");
};

const handleCloseHeader = (e: Event) => {
  const target = e.currentTarget as HTMLElement;
  const menuContainer = target?.parentElement?.parentElement;

  menuContainer?.classList.remove("menu");
};

const handleClearAllTasks = (e: Event) => {
  const target = e.currentTarget as HTMLElement;
  const tasks = getTasksFromLocalStorage();
  const idContainer = target?.parentElement?.parentElement?.parentElement?.id;
  const liContainer =
    target?.parentElement?.parentElement?.parentElement?.children[3]
      .children[0];

  liContainer!.innerHTML = "";

  const newList = tasks.filter(function (value) {
    return value.category != idContainer;
  });

  setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
};

const handleDeleteTask = (e: Event): void => {
  let task: HTMLElement;

  const tasks = getTasksFromLocalStorage();

  if (e.type === "click") {
    task = e.currentTarget as HTMLElement;
  } else if (e.type === "mousedown") {
    task = e.target as HTMLElement;
  }

  const idTask = task!.parentElement?.parentElement?.id;

  const elementTask = document.getElementById(idTask!);
  elementTask?.remove();

  const newList = tasks.filter((task) => task.id !== idTask?.split("/")[1]);

  setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
};

const handleCompleteTask = (e: MouseEvent): void => {
  const tasks = getTasksFromLocalStorage();
  const target = e.target as HTMLElement;
  const li = target.parentElement;
  const idTaskElement = li?.id;

  const newList = tasks.map((task) => {
    if (task.id === idTaskElement?.split("/")[1]) {
      task.complete = !task.complete;

      if (task.complete) {
        li?.classList.add("line");
      } else {
        li?.classList.remove("line");
      }
    }
    return task;
  });

  setLocalStorage(LOCAL_STORAGE_TASKS_KEY, newList);
};

const handleMouseDown = (e: MouseEvent): void => {
  const click = e.button;

  if (click === 2) handleDeleteTask(e);

  if (click === 0 || click === 1) handleCompleteTask(e);
};

const handleDragStart = (e: DragEvent): void => {
  const target = e.target as HTMLElement;
  e.dataTransfer?.setData("text", target.id);
};

const handleDragEnd = (e: DragEvent, containerTask: HTMLLIElement) => {
  const target = e.currentTarget as HTMLElement;
  const tasks = getTasksFromLocalStorage();
  const finalCategoryLiContainer =
    target?.parentElement?.parentElement?.parentElement?.id;

  const idLiContainer = target.id.split("/")[1];

  containerTask.setAttribute(
    "id",
    `${finalCategoryLiContainer}/${idLiContainer}`
  );

  const newList = tasks.map((task) => {
    if (task.id === idLiContainer) {
      task.category = finalCategoryLiContainer!;
    }
    return task;
  });

  setLocalStorage<Task[]>(LOCAL_STORAGE_TASKS_KEY, newList);
};

const handleDragOver = (e: Event) => {
  e.preventDefault();
};

const handleDrop = (e: Event) => {
  e.preventDefault();
  const target = e.target as HTMLElement;

  try {
    // @ts-ignore:next-line
    const data = e.dataTransfer?.getData("text");
    target?.appendChild(document.getElementById(data!)!);
  } catch (e) {}
};

// Con cada click, se genera un LI en la respectiva categoria
const insertTaskInContainer = (task: Task): void => {
  const container = document.querySelector(
    `.section_container_${task.category}_note_list`
  );

  const containerTask = document.createElement("li");
  containerTask.draggable = true;
  containerTask.classList.add("li");
  containerTask.id = `${task.category}/${task.id}`;

  if (task.complete) containerTask.classList.add("line");

  containerTask.addEventListener("mousedown", (e) => handleMouseDown(e));
  containerTask.addEventListener("dragstart", (e) => handleDragStart(e));
  containerTask.addEventListener("dragend", (e) =>
    handleDragEnd(e, containerTask)
  );

  const containerTaskDiv = document.createElement("div");

  const taskText = document.createElement("h2");
  taskText.textContent = task.text;

  const buttonDelete = document.createElement("button");
  buttonDelete.type = "button";
  buttonDelete.classList.add("deleteTask");

  buttonDelete.addEventListener("click", (e) => handleDeleteTask(e));

  const iconDelete = document.createElement("i");
  iconDelete.setAttribute("class", "fa-solid fa-trash");

  buttonDelete.append(iconDelete);

  containerTaskDiv.append(taskText);
  containerTaskDiv.append(buttonDelete);

  containerTask.append(containerTaskDiv);

  container?.append(containerTask);
};

// lee el LocalStorage, cada vez que se refresca la pagina. En caso de que haya elementos los completa en el DOM, donde corresponde
const loadTasksInLocalStorage = (): void => {
  const tasks = getTasksFromLocalStorage();

  tasks.forEach((task) => insertTaskInContainer(task));
};

const onInit = () => {
  const {
    tasksContainers,
    tasksBtnsAccept,
    tasksBtnsHeader,
    tasksBtnsCloseHeader,
    tasksBtnsClearAllTasks,
  } = getElements();

  loadTasksInLocalStorage();

  tasksContainers.forEach((taskContainer) => {
    taskContainer.addEventListener("dragover", (e) => handleDragOver(e));
    taskContainer.addEventListener("drop", (e) => handleDrop(e));
  });

  tasksBtnsAccept.forEach((tasksBtnAccept) => {
    const button = tasksBtnAccept as HTMLButtonElement;

    button.addEventListener("click", () => handleClickAccept(button));
  });

  tasksBtnsHeader.forEach((taskBtnHeader) =>
    taskBtnHeader.addEventListener("click", (e) => handleClickHeader(e))
  );

  tasksBtnsCloseHeader.forEach((taskBtnCloseHeader) =>
    taskBtnCloseHeader.addEventListener("click", (e) => handleCloseHeader(e))
  );

  tasksBtnsClearAllTasks.forEach((taskBtnClearAllTasks) =>
    taskBtnClearAllTasks.addEventListener("click", (e) =>
      handleClearAllTasks(e)
    )
  );
};

document.addEventListener("DOMContentLoaded", onInit);
