export const getElements = () => ({
  tasksContainers: document.querySelectorAll(".list") as NodeList,
  tasksBtnsAccept: document.querySelectorAll(".btnAccept") as NodeList,
  tasksBtnsHeader: document.querySelectorAll(".openMenu") as NodeList,
  tasksBtnsCloseHeader: document.querySelectorAll(".closeMenu") as NodeList,
  tasksBtnsClearAllTasks: document.querySelectorAll(
    ".clearAllTasks"
  ) as NodeList,
});
