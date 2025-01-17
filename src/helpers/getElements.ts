export const getElements = () => ({
  tasksContainers: document.querySelectorAll(".list") as NodeList,
  tasksBtnsAccept: document.querySelectorAll(".btn__accept") as NodeList,
  tasksBtnsHeader: document.querySelectorAll(".menu__open") as NodeList,
  tasksBtnsCloseHeader: document.querySelectorAll(".menu__close") as NodeList,
  tasksBtnsClearAllTasks: document.querySelectorAll(
    ".clear__all__tasks"
  ) as NodeList,
});
