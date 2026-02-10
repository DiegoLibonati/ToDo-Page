import "@/index.css";
import { ToDoPage } from "@/pages/ToDoPage/ToDoPage";

const onInit = (): void => {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) throw new Error(`You must render a container to mount the app.`);

  const toDoPage = ToDoPage();
  app.appendChild(toDoPage);
};

document.addEventListener("DOMContentLoaded", onInit);
