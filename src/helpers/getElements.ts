export const getElements = () => ({
  tasksContainers: document.querySelectorAll(".menus__menu-note-list") as NodeList,
  tasksBtnsAccept: document.querySelectorAll(".menus__menu-form-btn-accept") as NodeList,
  tasksBtnsHeader: document.querySelectorAll(".menus__menu-header-btn-open") as NodeList,
  tasksBtnsCloseHeader: document.querySelectorAll(".menus__menu-config-header-btn-close") as NodeList,
  tasksBtnsClearAllTasks: document.querySelectorAll(
    ".menus__menu-config-actions-btn-clear-all-tasks"
  ) as NodeList,
});
