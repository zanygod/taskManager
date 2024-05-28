document.addEventListener('DOMContentLoaded', () => {
  const taskTitle = document.getElementById('taskTitle');
  const taskDescription = document.getElementById('taskDescription');
  const taskDueDate = document.getElementById('taskDueDate');
  const taskCategory = document.getElementById('taskCategory');
  const taskPriority = document.getElementById('taskPriority');
  const taskProgress = document.getElementById('taskProgress');
  const taskProgressValue = document.getElementById('taskProgressValue');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');
  const sortTasks = document.getElementById('sortTasks');

  const filterTitle = document.getElementById('filterTitle');
  const filterDueDate = document.getElementById('filterDueDate');
  const filterCategory = document.getElementById('filterCategory');
  const filterPriority = document.getElementById('filterPriority');

  let editTaskId = null;

  taskProgress.addEventListener('input', () => {
    taskProgressValue.textContent = `${taskProgress.value}%`;
  });

  addTaskButton.addEventListener('click', () => {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const dueDate = taskDueDate.value;
    const category = taskCategory.value;
    const priority = taskPriority.value;
    const progress = taskProgress.value;

    if (!title || !description || !dueDate || !priority || !category) {
      alert('Please fill in all fields!');
      return;
    }

    if (editTaskId) {
      updateTask(editTaskId, title, description, dueDate, category, priority, progress);
    } else {
      const id = new Date().getTime().toString();
      addTask(id, title, description, dueDate, category, priority, progress);
    }

    saveTasks();
    clearInputs();
    editTaskId = null;
    addTaskButton.textContent = 'Add Task';
  });

  filterTitle.addEventListener('input', filterAndSortTasks);
  filterDueDate.addEventListener('change', filterAndSortTasks);
  filterCategory.addEventListener('change', filterAndSortTasks);
  filterPriority.addEventListener('change', filterAndSortTasks);

  sortTasks.addEventListener('change', filterAndSortTasks);

  function addTask(id, title, description, dueDate, category, priority, progress) {
    const taskItem = document.createElement('div');
    taskItem.classList.add('taskItem', priority);
    taskItem.setAttribute('data-id', id);
    taskItem.setAttribute('data-title', title);
    taskItem.setAttribute('data-dueDate', dueDate);
    taskItem.setAttribute('data-category', category);
    taskItem.setAttribute('data-priority', priority);
    taskItem.innerHTML = `
      <h3>${title}</h3>
      <p>${description}</p>
      <small>Due Date: ${new Date(dueDate).toLocaleDateString()}</small>
      <small>Category: ${category}</small>
      <small>Priority: ${priority}</small>
      <div class="progress">
        <label for="taskProgress">Progress:</label>
        <progress value="${progress}" max="100"></progress>
        <span>${progress}%</span>
        <input type="range" class="taskProgressRange" value="${progress}" min="0" max="100">
      </div>
      <button class="editButton">Edit</button>
      <button class="deleteButton">Delete</button>
    `;

    const deleteButton = taskItem.querySelector('.deleteButton');
    deleteButton.addEventListener('click', () => {
      taskItem.remove();
      saveTasks();
    });

    const editButton = taskItem.querySelector('.editButton');
    editButton.addEventListener('click', () => {
      editTaskId = id;
      taskTitle.value = title;
      taskDescription.value = description;
      taskDueDate.value = dueDate;
      taskCategory.value = category;
      taskPriority.value = priority;
      taskProgress.value = progress;
      taskProgressValue.textContent = `${progress}%`;
      addTaskButton.textContent = 'Update Task';
    });

    const progressRange = taskItem.querySelector('.taskProgressRange');
    progressRange.addEventListener('input', () => {
      const progressValue = progressRange.value;
      taskItem.querySelector('progress').value = progressValue;
      taskItem.querySelector('span').textContent = `${progressValue}%`;
      updateTask(id, title, description, dueDate, category, priority, progressValue);
      saveTasks();
    });

    taskList.appendChild(taskItem);
  }

  function updateTask(id, title, description, dueDate, category, priority, progress) {
    const taskItems = document.querySelectorAll('.taskItem');
    taskItems.forEach(taskItem => {
      if (taskItem.getAttribute('data-id') === id) {
        taskItem.setAttribute('data-title', title);
        taskItem.setAttribute('data-dueDate', dueDate);
        taskItem.setAttribute('data-category', category);
        taskItem.setAttribute('data-priority', priority);
        taskItem.classList = `taskItem ${priority}`;
        taskItem.innerHTML = `
          <h3>${title}</h3>
          <p>${description}</p>
          <small>Due Date: ${new Date(dueDate).toLocaleDateString()}</small>
          <small>Category: ${category}</small>
          <small>Priority: ${priority}</small>
          <div class="progress">
            <label for="taskProgress">Progress:</label>
            <progress value="${progress}" max="100"></progress>
            <span>${progress}%</span>
            <input type="range" class="taskProgressRange" value="${progress}" min="0" max="100">
          </div>
          <button class="editButton">Edit</button>
          <button class="deleteButton">Delete</button>
        `;

        const deleteButton = taskItem.querySelector('.deleteButton');
        deleteButton.addEventListener('click', () => {
          taskItem.remove();
          saveTasks();
        });

        const editButton = taskItem.querySelector('.editButton');
        editButton.addEventListener('click', () => {
          editTaskId = id;
          taskTitle.value = title;
          taskDescription.value = description;
          taskDueDate.value = dueDate;
          taskCategory.value = category;
          taskPriority.value = priority;
          taskProgress.value = progress;
          taskProgressValue.textContent = `${progress}%`;
          addTaskButton.textContent = 'Update Task';
        });

        const progressRange = taskItem.querySelector('.taskProgressRange');
        progressRange.addEventListener('input', () => {
          const progressValue = progressRange.value;
          taskItem.querySelector('progress').value = progressValue;
          taskItem.querySelector('span').textContent = `${progressValue}%`;
          updateTask(id, title, description, dueDate, category, priority, progressValue);
          saveTasks();
        });
      }
    });
  }

  function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll('.taskItem');
    taskItems.forEach(taskItem => {
      tasks.push({
        id: taskItem.getAttribute('data-id'),
        title: taskItem.getAttribute('data-title'),
        description: taskItem.querySelector('p').textContent,
        dueDate: taskItem.getAttribute('data-dueDate'),
        category: taskItem.getAttribute('data-category'),
        priority: taskItem.getAttribute('data-priority'),
        progress: taskItem.querySelector('progress').value,
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      addTask(task.id, task.title, task.description, task.dueDate, task.category, task.priority, task.progress);
    });
  }

  function filterAndSortTasks() {
    const filterTitleValue = filterTitle.value.toLowerCase();
    const filterDueDateValue = filterDueDate.value;
    const filterCategoryValue = filterCategory.value;
    const filterPriorityValue = filterPriority.value;
    const sortValue = sortTasks.value;

    const tasks = Array.from(document.querySelectorAll('.taskItem'));

    tasks.forEach(task => {
      const title = task.getAttribute('data-title').toLowerCase();
      const dueDate = task.getAttribute('data-dueDate');
      const category = task.getAttribute('data-category');
      const priority = task.getAttribute('data-priority');

      let isVisible = true;

      if (filterTitleValue && !title.includes(filterTitleValue)) {
        isVisible = false;
      }

      if (filterDueDateValue && dueDate !== filterDueDateValue) {
        isVisible = false;
      }

      if (filterCategoryValue && category !== filterCategoryValue) {
        isVisible = false;
      }

      if (filterPriorityValue && priority !== filterPriorityValue) {
        isVisible = false;
      }

      task.style.display = isVisible ? '' : 'none';
    });

    sortTasksArray(tasks, sortValue);

    taskList.innerHTML = '';
    tasks.forEach(task => {
      taskList.appendChild(task);
    });
  }

  function sortTasksArray(tasks, sortValue) {
    tasks.sort((a, b) => {
      const titleA = a.getAttribute('data-title').toLowerCase();
      const titleB = b.getAttribute('data-title').toLowerCase();
      const dueDateA = new Date(a.getAttribute('data-dueDate'));
      const dueDateB = new Date(b.getAttribute('data-dueDate'));

      if (sortValue === 'alphabetical') {
        return titleA.localeCompare(titleB);
      } else if (sortValue === 'reverseAlphabetical') {
        return titleB.localeCompare(titleA);
      } else if (sortValue === 'soonest') {
        return dueDateA - dueDateB;
      } else if (sortValue === 'latest') {
        return dueDateB - dueDateA;
      }
    });
  }

  loadTasks();
});
