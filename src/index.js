/* ------------------------- SELECTORS ------------------------- */
// List Selectors
const listsContainer = document.querySelector('[data-lists-container]');
const listInput = document.querySelector('[data-list-input ]');
const listForm = document.querySelector('[data-list-form]');
const listTemplate = document.querySelector('[data-list-template]');
const listTitle = document.querySelector('[data-list-title]');
const listAllTasks = document.querySelector('[data-all-tasks]');

// Task Selectors
const tasks = document.querySelector('[data-tasks]');
const taskForm = document.querySelector('[data-task-form]');
const taskNameInput = document.querySelector('[data-task-name-input]');
const taskDateInput = document.querySelector('[data-task-date-input]');
const taskTemplate = document.querySelector('[data-task-template]');

// ---------------------------- Local Storage ----------------------------//

const LOCAL_STORAGE_LIST_KEY = 'localStorageLists';
const LOCAL_STORAGE_SELECTED_LIST_ID = 'localStorageListId';

// Variables. lists is our main object, housing tasks objects inside of it. Remember this two variables.
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID);

// ----------------------------EVENT LISTENERS----------------------------//

// Makes the All task clickable, highlisghts and re renders tasks
listAllTasks.addEventListener('click', (e) => {
  selectedListId = null;
  listAllTasks.classList.add('active-list');
  lists.forEach((list) => {
    listsContainer.classList.remove('active-list');
  });
  saveAndRender();
});

// Takes lists form input and creates a list object and pushes into the lists object
listForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const list = createList(listInput.value);
  listInput.value = null;
  lists.push(list);
  selectedListId = list.id;
  saveAndRender();
});

//takes a task form input creates a task and pushes it into tasks object
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = createTask(taskNameInput.value, taskDateInput.value);
  taskNameInput.value = null;
  taskDateInput.value = null;
  const selectedList = selectedListObject();

  selectedList.tasks.push(task);

  saveAndRender();
});
// ----------------------------FACTORY FUNCTIONS ---------------------------//

// Creates a list object with unique id
function createList(name) {
  return { id: Date.now().toString(), name: name, tasks: [] };
}

// Creates a task object with unique id, task will live inside a list
function createTask(name, date) {
  return { id: Date.now().toString(), name: name, date: date, complete: false };
}

/* ------------------------- RENDER FUNCTIONS ------------------------- */

// Renders lists, adds event listeners to new lists, saves and checks which list is active to show it
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

// almost de same as renderList, renders tasks, adds event listeners, toggles clases and saves
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

// clever function, utilizes already existing renderTasks() to render ALL tasks from all lists
function renderAllTasks() {
  lists.forEach((list) => {
    renderTasks(list);
  });
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

function saveAndRender() {
  save();
  render();
}
/* ------------------------- HELPER FUNCTIONS ------------------------- */

// Used for deleating items,  both in lists and tasks
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// Saves lists and which list is selected to local storage
function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID, selectedListId);
}

// similar to selectedListId, but returns the whole object rather than just the id
function selectedListObject() {
  return lists.find((list) => list.id === selectedListId);
}

// helps when refreshing, otherwise it will not render items in localstorage if you dont click on anything
render();
