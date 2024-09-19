# ToDo Page

## Getting Started

1. Clone the repository
2. Join to the correct path of the clone
3. Install LiveServer extension from Visual Studio Code [OPTIONAL]
4. Click in "Go Live" from LiveServer extension

---

1. Clone the repository
2. Join to the correct path of the clone
3. Open index.html in your favorite navigator

---

1. Clone the repository
2. Join to the correct path of the clone
3. Execute: `yarn install`
4. Execute: `yarn dev`

## Description

I made a web page that works like JIRA. It is a page where we can upload tasks to do, that are in progress or that are done. In addition we can delete all the tasks of each category separately, we can drag and drop the tasks from one category to another with drag and drop. Also by clicking with the wheel we can cross out the task and with the right click we can delete it from the dashboard.

## Technologies used

1. Javascript
2. CSS3
3. HTML5

## Libraries used

1. uuid

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/ToDo-Page`](https://www.diegolibonati.com.ar/#/project/ToDo-Page)

## Video

https://user-images.githubusercontent.com/99032604/199377059-5a00ae00-f9a7-487b-bde3-73fd8b6b0328.mp4

## Documentation

Here we obtain all the elements which we are going to use to dump the information:

```
const tasksContainers = document.querySelectorAll(".list") as NodeList;
const tasksBtnsAccept = document.querySelectorAll(".btnAccept") as NodeList;
const tasksBtnsHeader = document.querySelectorAll(".openMenu") as NodeList;
const tasksBtnsCloseHeader = document.querySelectorAll(
  ".closeMenu"
) as NodeList;
const tasksBtnsClearAllTasks = document.querySelectorAll(
  ".clearAllTasks"
) as NodeList;
```

When I click on `tasksBtnAccept`, I get the values needed to add them to the LocalStorage:

```
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
```

With the `addLocalStorageItem()` function you create the database by adding an item in it:

```
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
```

With the `getLocalStorage()` function we get the LocalStorage:

```
const getLocalStorage = (): Task[] => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list")!)
    : [];
};
```

With the `deleteTask()` function we will delete tasks:

```
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
```

With the `insertTaskInContainer()` function we are going to insert an HTML element belonging to the task we want to create:

```
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
```

With the function `loadTasksInLocalStorage()` it reads the LocalStorage, each time the page is refreshed. In case there are elements it fills them in the DOM, where it corresponds:

```
const loadTasksInLocalStorage = (): void => {
  const list = getLocalStorage();

  list.forEach((task) => {
    insertTaskInContainer(task.id, task.category, task.text, task.complete);
  });
};
```
