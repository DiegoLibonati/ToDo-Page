import { Task } from "./entities/entities";
import { v4 as uuidv4 } from "uuid";

// Obtengo datos
const tasksContainers = document.querySelectorAll(".list") as NodeList;
const tasksBtnsAccept = document.querySelectorAll(".btnAccept") as NodeList;
const tasksBtnsHeader = document.querySelectorAll(".openMenu") as NodeList;
const tasksBtnsCloseHeader = document.querySelectorAll(
  ".closeMenu"
) as NodeList;
const tasksBtnsClearAllTasks = document.querySelectorAll(
  ".clearAllTasks"
) as NodeList;

// Al hacer click, obtengo los valores necesarios para agregarlos al LocalStorage
tasksBtnsAccept.forEach(function (tasksBtnAccept) {
  const button = tasksBtnAccept as HTMLButtonElement;

  button.addEventListener("click", () => {
    const input = button.parentElement?.children[0] as HTMLInputElement;

    const valueTask = input.value;
    const categoryTask = button.parentElement?.parentElement?.id || "";
    const idTask = uuidv4();
    const completeTask = false;

    insertTaskInContainer(idTask, categoryTask, valueTask);
    addLocalStorageItem(idTask, categoryTask, valueTask, completeTask);

    input.value = "";
  });
});

// Se crea el localstorage
const addLocalStorageItem = (
  id: string,
  category: string,
  text: string,
  complete: boolean
): void => {
  const list: Task[] = getLocalStorage();

  const task: Task = {
    id: id,
    category: category,
    text: text,
    complete: complete,
  };

  list.push(task);

  localStorage.setItem("list", JSON.stringify(list));
};

// Se obtiene el localStorage
const getLocalStorage = (): Task[] => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list")!)
    : [];
};

const deleteTask = (e: Event): void => {
  let task: HTMLElement;

  const list = getLocalStorage();

  if (e.type === "click") {
    task = e.currentTarget as HTMLElement;
  } else if (e.type === "mousedown") {
    task = e.target as HTMLElement;
  }

  const idTask = task!.parentElement?.parentElement?.id;

  const elementTask = document.getElementById(idTask!);
  elementTask?.remove();

  const newList = list.filter((task) => task.id !== idTask?.split("/")[1]);

  localStorage.setItem("list", JSON.stringify(newList));
};

const completeTask = (e: MouseEvent): void => {
  const list = getLocalStorage();
  const target = e.target as HTMLElement;
  const li = target.parentElement;
  const idTaskElement = li?.id;

  console.log(idTaskElement)
  console.log(list)

  const newList = list.map((task) => {
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

  localStorage.setItem("list", JSON.stringify(newList));
};

const actionTasks = (e: MouseEvent): void => {
  const click = e.button;

  if (click === 2) {
    // Delete
    deleteTask(e);
  } else if (click === 0 || click === 1) {
    // Complete
    completeTask(e);
  }
};

// Con cada click, se genera un LI en la respectiva categoria
const insertTaskInContainer = (
  idTask: string,
  categoryTask: string,
  textTask: string,
  complete?: boolean
): void => {
  const container = document.querySelector(
    `.section_container_${categoryTask}_note_list`
  );

  const containerTask = document.createElement("li");
  containerTask.draggable = true;
  containerTask.classList.add("li");
  containerTask.id = `${categoryTask}/${idTask}`;

  if (complete) {
    containerTask.classList.add("line");
  }

  containerTask.addEventListener("mousedown", (e) => actionTasks(e));
  containerTask.addEventListener("dragstart", (e) => {
    const target = e.target as HTMLElement;
    e.dataTransfer?.setData("text", target.id);
  });
  containerTask.addEventListener("dragend", (e) => {
    const target = e.currentTarget as HTMLElement;
    const list = getLocalStorage();
    const finalCategoryLiContainer =
      target?.parentElement?.parentElement?.parentElement?.id;

    const idLiContainer = target.id.split("/")[1];
 
    containerTask.setAttribute(
      "id",
      `${finalCategoryLiContainer}/${idLiContainer}`
    );

    const newList = list.map((task) => {
      if (task.id === idLiContainer) {
        task.category = finalCategoryLiContainer!;
      }
      return task;
    });

    localStorage.setItem("list", JSON.stringify(newList));
  });

  const containerTaskDiv = document.createElement("div");

  const taskText = document.createElement("h2");
  taskText.textContent = textTask;

  const buttonDelete = document.createElement("button");
  buttonDelete.type = "button";
  buttonDelete.classList.add("deleteTask");

  buttonDelete.addEventListener("click", (e) => deleteTask(e));

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
  const list = getLocalStorage();

  list.forEach((task) => {
    insertTaskInContainer(task.id, task.category, task.text, task.complete);
  });
};

const functionsMenuSection = (): void => {
  tasksBtnsHeader.forEach(function (taskBtnHeader) {
    taskBtnHeader.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      const menuContainer = target?.parentElement?.parentElement?.children[2];

      menuContainer?.classList.add("menu");
    });
  });

  tasksBtnsCloseHeader.forEach(function (taskBtnCloseHeader) {
    taskBtnCloseHeader.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      const menuContainer = target?.parentElement?.parentElement;

      menuContainer?.classList.remove("menu");
    });
  });

  tasksBtnsClearAllTasks.forEach(function (taskBtnClearAllTasks) {
    taskBtnClearAllTasks.addEventListener("click", (e) => {
      const target = e.currentTarget as HTMLElement;
      const list = getLocalStorage();
      const idContainer =
        target?.parentElement?.parentElement?.parentElement?.id;
      const liContainer =
        target?.parentElement?.parentElement?.parentElement?.children[3]
          .children[0];

      liContainer!.innerHTML = "";

      const newList = list.filter(function (value) {
        return value.category != idContainer;
      });

      localStorage.setItem("list", JSON.stringify(newList));
    });
  });
};

tasksContainers.forEach(function (taskContainer) {
  taskContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  
  taskContainer.addEventListener("drop", (e) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    
    try {
      // @ts-ignore:next-line
      const data = e.dataTransfer?.getData("text");
      target?.appendChild(document.getElementById(data!)!);
    } catch (e) {}
  });
});

loadTasksInLocalStorage();
functionsMenuSection();
