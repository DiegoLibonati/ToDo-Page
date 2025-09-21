import { getElements } from "@src/helpers/getElements";

import { OFFICIAL_BODY } from "@tests/jest.constants";

describe("getElements.ts", () => {
  describe("General Tests.", () => {
    beforeEach(() => {
      document.body.innerHTML = OFFICIAL_BODY;
    });

    afterEach(() => {
      document.body.innerHTML = "";
    });

    test("It must render the elements of the document that the 'getElements' function exports.", () => {
      const {
        tasksBtnsClearAllTasks,
        tasksBtnsAccept,
        tasksBtnsCloseHeader,
        tasksBtnsHeader,
        tasksContainers,
      } = getElements();

      for (let taskBtnClearAllTask of tasksBtnsClearAllTasks) {
        expect(taskBtnClearAllTask).toBeInTheDocument();
      }

      for (let taskBtnAccept of tasksBtnsAccept) {
        expect(taskBtnAccept).toBeInTheDocument();
      }

      for (let taskBtnCloseHeader of tasksBtnsCloseHeader) {
        expect(taskBtnCloseHeader).toBeInTheDocument();
      }

      for (let taskBtnHeader of tasksBtnsHeader) {
        expect(taskBtnHeader).toBeInTheDocument();
      }

      for (let taskContainer of tasksContainers) {
        expect(taskContainer).toBeInTheDocument();
      }
    });
  });
});
