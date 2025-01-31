export const getElements = () => ({
  tasksContainers: document.querySelectorAll(".menu__note-list") as NodeList,
  tasksBtnsAccept: document.querySelectorAll(".menu__form-btn-accept") as NodeList,
  tasksBtnsHeader: document.querySelectorAll(".menu__btn-open-menu") as NodeList,
  tasksBtnsCloseHeader: document.querySelectorAll(".menu__config-header-btn-close") as NodeList,
  tasksBtnsClearAllTasks: document.querySelectorAll(
    ".menu__config-actions-btn-clear-all-tasks"
  ) as NodeList,
});
