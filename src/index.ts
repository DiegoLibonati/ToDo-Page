import { ToDoPage } from "@src/pages/ToDoPage/ToDoPage";

const onInit = () => {
  const app = document.querySelector<HTMLDivElement>("#app")!;
  const toDoPage = ToDoPage();
  app.appendChild(toDoPage);
};

document.addEventListener("DOMContentLoaded", onInit);
