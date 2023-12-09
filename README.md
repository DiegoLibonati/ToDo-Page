# ToDo-Page

## Getting Started

1. Clone the repository
2. Join to the correct path of the clone
3. Install LiveServer extension from Visual Studio Code [OPTIONAL]
4. Click in "Go Live" from LiveServer extension

---

1. Clone the repository
2. Join to the correct path of the clone
3. Open index.html in your favorite navigator

## Description

I made a web page that works like JIRA. It is a page where we can upload tasks to do, that are in progress or that are done. In addition we can delete all the tasks of each category separately, we can drag and drop the tasks from one category to another with drag and drop. Also by clicking with the wheel we can cross out the task and with the right click we can delete it from the dashboard.

## Technologies used

1. Javascript
2. CSS3
3. HTML5

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/45`](https://www.diegolibonati.com.ar/#/project/45)

## Video

https://user-images.githubusercontent.com/99032604/199377059-5a00ae00-f9a7-487b-bde3-73fd8b6b0328.mp4

## Documentation

Here we obtain all the elements which we are going to use to dump the information:

```
const tasksContainers = document.querySelectorAll(".list");
const tasksBtnsAccept = document.querySelectorAll(".btnAccept");
const tasksMenus = document.querySelectorAll(".menu");
const tasksBtnsHeader = document.querySelectorAll(".openMenu");
const tasksBtnsCloseHeader = document.querySelectorAll(".closeMenu");
const tasksBtnsClearAllTasks = document.querySelectorAll(".clearAllTasks");
```

When I click on `tasksBtnAccept`, I get the values needed to add them to the LocalStorage:

```
tasksBtnsAccept.forEach(function (tasksBtnAccept) {
  tasksBtnAccept.addEventListener("click", () => {
    let tasksInputValue = tasksBtnAccept.parentElement.children[0].value;
    let tasksCategory = tasksBtnAccept.parentElement.parentElement.id;
    let tasksId = idGenerator();
    let tasksComplete = false;

    addLocalStorageItem(tasksId, tasksCategory, tasksInputValue, tasksComplete);
  });
});
```

With the `addLocalStorageItem()` function you create the database by adding an item in it:

```
const addLocalStorageItem = (id, category, text, complete) => {
  let arrayLocalStorage = getLocalStorage();
  insertTaskInContainer(id, category, text);

  const task = { id: id, category: category, text: text, complete: complete };

  arrayLocalStorage.push(task);

  localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
};
```

With the `getLocalStorage()` function we get the LocalStorage:

```
const getLocalStorage = () => {
  return localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
};
```

With the `idGenerator()` function we will generate a unique id based on its length:

```
const idGenerator = () => {
  let arrayLocalStorage = getLocalStorage();

  if (arrayLocalStorage.length === 0) {
    let contador = 0;
    contador++;
    return contador;
  } else {
    let contador = arrayLocalStorage[arrayLocalStorage.length - 1].id;
    contador++;
    return contador;
  }
};
```

With the `deleteTaskMobile()` function we will delete tasks from the mobile version:

```
const deleteTaskMobile = () => {
  const btnsDeleteTask = document.querySelectorAll(".deleteTask");

  btnsDeleteTask.forEach(function (btnDeleteTask) {
    btnDeleteTask.addEventListener("click", (e) => {
      let arrayLocalStorage = getLocalStorage();
      const liContainer = e.currentTarget.parentElement.parentElement;
      const idContainer =
        e.currentTarget.parentElement.parentElement.id.replace(/^\D+/g, "");
      liContainer.remove();

      for (let i = 0; i < arrayLocalStorage.length; i++) {
        if (idContainer == arrayLocalStorage[i].id) {
          const index = arrayLocalStorage.indexOf(arrayLocalStorage[i]);

          arrayLocalStorage.splice(index, 1);

          localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
        }
      }
    });
  });
};
```

With the function `removeAndAddLineThroughInDesktop()` we are going to cross out the tasks but if they are already crossed out and we execute this function again we remove that crossing out:

```
const removeAndAddLineThroughInDesktop = () => {
  const lisContainers = document.querySelectorAll(".li");

  lisContainers.forEach(function (liContainer) {
    liContainer.addEventListener("mousedown", (e) => {
      switch (e.which) {
        case 2:
          let arrayLocalStorage = getLocalStorage();
          const idContainer = e.currentTarget.id.replace(/^\D+/g, "");

          for (let i = 0; i < arrayLocalStorage.length; i++) {
            if (idContainer == arrayLocalStorage[i].id) {
              if (arrayLocalStorage[i].complete == false) {
                liContainer.classList.add("line");
                arrayLocalStorage[i].complete = true;
                localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
              }
            }
          }
          break;

        case 3:
          let arrayLocalStorage2 = getLocalStorage();
          const liContainer2 = e.currentTarget;
          const idContainer2 = e.currentTarget.id.replace(/^\D+/g, "");

          liContainer2.remove();

          for (let i = 0; i < arrayLocalStorage2.length; i++) {
            if (idContainer2 == arrayLocalStorage2[i].id) {
              const index = arrayLocalStorage2.indexOf(arrayLocalStorage2[i]);

              arrayLocalStorage2.splice(index, 1);

              localStorage.setItem("list", JSON.stringify(arrayLocalStorage2));
            }
          }

          break;
      }
    });
  });
};
```

With the `insertTaskInContainer()` function we are going to insert an HTML element belonging to the task we want to create:

```
const insertTaskInContainer = (id, category, text) => {
  tasksContainers.forEach(function (tasksContainer) {
    const idContainer = tasksContainer.parentElement.parentElement.id;

    if (category === idContainer) {
      tasksContainer.innerHTML += `

            <li class="li" id="${category}-${id}">
                <div>
                    <h2>${text}</h2>
                    <button type="button" class="deleteTask"><i class="fa-solid fa-trash"></i></button>
                </div>
            </li>

            `;
    }
  });

  deleteTaskMobile();
  removeAndAddLineThroughInDesktop();
  functionsMenuSection();
  dragsFunctions();
};
```

With the function `loadTasksInLocalStorage()` it reads the LocalStorage, each time the page is refreshed. In case there are elements it fills them in the DOM, where it corresponds:

```
const loadTasksInLocalStorage = () => {
  let arrayLocalStorage = getLocalStorage();

  tasksContainers.forEach(function (tasksContainer) {
    const idContainer = tasksContainer.parentElement.parentElement.id;

    for (let i = 0; i < arrayLocalStorage.length; i++) {
      if (arrayLocalStorage[i].category === idContainer) {
        tasksContainer.innerHTML += `

                <li class="li" id="${arrayLocalStorage[i].category}-${arrayLocalStorage[i].id}">
                    <div>
                        <h2>${arrayLocalStorage[i].text}</h2>
                        <button type="button" class="deleteTask"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </li>

                `;

        if (arrayLocalStorage[i].complete === true) {
          for (let i = 0; i < tasksContainer.children.length; i++) {
            tasksContainer.children[
              tasksContainer.children.length - 1
            ].classList.add("line");
          }
        }
      }
    }
  });

  deleteTaskMobile();
  removeAndAddLineThroughInDesktop();
  functionsMenuSection();
  dragsFunctions();
};
```

With the `dragsFunctions()` function we will be able to move the elements using `drag and drop`:

```
const dragsFunctions = () => {
  const liContainers = document.querySelectorAll(".li");

  liContainers.forEach(function (liContainer) {
    liContainer.draggable = true;
    liContainer.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text", e.target.id);
    });

    liContainer.addEventListener("dragend", (e) => {
      let arrayLocalStorage = getLocalStorage();
      const finalCategoryLiContainer =
        e.currentTarget.parentElement.parentElement.parentElement.id.replace(
          /-\d+/g,
          ""
        );
      const idLiContainer = e.currentTarget.id.replace(/^\D+/g, "");

      liContainer.setAttribute(
        "id",
        `${finalCategoryLiContainer}-${idLiContainer}`
      );

      for (let i = 0; i < arrayLocalStorage.length; i++) {
        if (idLiContainer == arrayLocalStorage[i].id) {
          arrayLocalStorage[i].category = finalCategoryLiContainer;

          localStorage.setItem("list", JSON.stringify(arrayLocalStorage));
        }
      }
    });
  });

  tasksContainers.forEach(function (taskContainer) {
    taskContainer.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    taskContainer.addEventListener("drop", (e) => {
      e.preventDefault();

      try {
        const data = e.dataTransfer.getData("text");
        e.target.appendChild(document.getElementById(data));
      } catch (e) {}
    });
  });
};
```
