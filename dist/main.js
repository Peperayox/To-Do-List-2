const listsContainer = document.querySelector('[data-lists-container]');
const listInput = document.querySelector('[data-list-input ]');
const listForm = document.querySelector('[data-list-form]');
const listTemplate = document.querySelector('[data-list-template]');
const listTitle = document.querySelector('[data-list-title]');
const listAllTasks = document.querySelector('[data-all-tasks]');

const tasks = document.querySelector('[data-tasks]');
const taskForm = document.querySelector('[data-task-form]');
const taskNameInput = document.querySelector('[data-task-name-input]');
const taskDateInput = document.querySelector('[data-task-date-input]');
const taskTemplate = document.querySelector('[data-task-template]');

// ---------------------------- Local Storage ----------------------------//

const LOCAL_STORAGE_LIST_KEY = 'localStorageLists';
const LOCAL_STORAGE_SELECTED_LIST_ID = 'localStorageListId';

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);
// ----------------------------EVENT LISTENERS----------------------------//

listAllTasks.addEventListener('click', (e) => {
  selectedListId = null;
  listAllTasks.classList.add('active-list');
  lists.forEach((list) => {
    listsContainer.classList.remove('active-list');
  });
  saveAndRender();
});

listForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const list = createList(listInput.value);
  listInput.value = null;
  lists.push(list);
  selectedListId = list.id;
  saveAndRender();
});

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = createTask(taskNameInput.value, taskDateInput.value);
  taskNameInput.value = null;
  taskDateInput.value = null;
  const selectedList = selectedListObject();

  selectedList.tasks.push(task);

  saveAndRender();
});
// ---------------------------- FUNCTIONS ---------------------------//
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}
function createTask(name, date) {
  return { id: Date.now().toString(), name: name, date: date, complete: false };
}

function renderLists() {
  lists.forEach((list) => {
    const listTemplateElement = listTemplate.content.cloneNode(true);
    const listText = listTemplateElement.querySelector('[data-list-text]');
    const listDeleteButton = listTemplateElement.querySelector(
      '[data-list-delete-button]'
    );
    const listContainer = listTemplateElement.querySelector('div');
    listText.textContent = list.name;
    listsContainer.appendChild(listTemplateElement);

    if (list.id === selectedListId) {
      listContainer.classList.add('active-list');
      listAllTasks.classList.remove('active-list');
    }
    listDeleteButton.addEventListener('click', (e) => {
      const deleteListId = list.id;

      lists = lists.filter((list) => list.id !== deleteListId);

      if (deleteListId == selectedListId) {
        selectedListId = null;
        listAllTasks.classList.add('active-list');
      }

      saveAndRender();
    });
    listContainer.addEventListener('click', (e) => {
      if (e.target.closest('[data-list-delete-button]') == null) {
        selectedListId = list.id;
      }
      saveAndRender();
    });
  });
}

function isSelectedListIdNull() {
  if (selectedListId == null) {
    return true;
  } else {
    return false;
  }
}

function renderAllTasks() {
  lists.forEach((list) => {
    renderTasks(list);
  });
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskTemplateElement = taskTemplate.content.cloneNode(true);
    const taskText = taskTemplateElement.querySelector('[data-task-text]');
    const taskDate = taskTemplateElement.querySelector('[data-task-date]');
    const taskCheckbox = taskTemplateElement.querySelector(
      '[data-task-checkbox]'
    );
    const taskDeleteButton = taskTemplateElement.querySelector(
      '[data-task-delete-button]'
    );
    const taskDiv = taskTemplateElement.querySelector('[data-task-div]');

    taskDeleteButton.addEventListener('click', (e) => {
      const deleteTaskId = task.id;
      selectedList.tasks = selectedList.tasks.filter(
        (task) => task.id !== deleteTaskId
      );
      saveAndRender();
    });

    if (task.complete) {
      taskDiv.classList.add('active-item');
    } else {
      taskDiv.classList.remove('active-item');
    }

    taskCheckbox.addEventListener('click', () => {
      task.complete = !task.complete;
      saveAndRender();
    });

    taskCheckbox.checked = task.complete;
    taskText.textContent = task.name;
    taskDate.textContent = task.date;
    tasks.appendChild(taskTemplateElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
}

function render() {
  clearElement(listsContainer);
  clearElement(tasks);
  renderLists();
  if (selectedListId) {
    renderTasks(selectedListObject());
  } else {
    renderAllTasks();
  }
}

function selectedListObject() {
  return lists.find((list) => list.id === selectedListId);
}

render();
