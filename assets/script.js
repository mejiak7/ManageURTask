// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    localStorage.setItem('nextId', JSON.stringify(nextId + 1));
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const card = $(`
        <div class="card mb-2 task-card" data-id="${task.id}">
          <div class="card-body">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text">${task.description}</p>
            <p class="card-text"><small class="text-muted">Due Date: ${task.duedate}</small></p>
            <button class="btn btn-danger btn-sm delete-task">Delete</button>
          </div>
        </div>
    `);

    const today = dayjs();
    const duedate = dayjs(task.duedate);
    if (duedate.isBefore(today, 'day')) {
        card.find('.card-body').addClass('bg-danger text-white');
    } else if (duedate.isBefore(today.add(3, 'day'), 'day')) {
        card.find('.card-body').addClass('bg-warning text-dark');
    }
    
    return card;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards, #in-progress-cards, #done-cards').empty();
    taskList.forEach(task => {
        const card = createTaskCard(task);
        $(`#${task.status}-cards`).append(card);
        card.draggable({
            revert: "invalid",
            helper: "clone"
        });
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    const title = $('#task-title').val();
    const description = $('#task-desc').val();
    const duedate = $('#task-duedate').val();
  
    const newTask = {
        id: generateTaskId(),
        title,
        description,
        duedate,
        status: 'to-do'
    };
  
    taskList.push(newTask);
    saveTasks();
  
    $('#formModal').modal('hide');
    $('#task-form')[0].reset();
    renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(event.target).closest('.task-card').data('id');
    taskList = taskList.filter(task => task.id !== taskId);
    saveTasks();
    renderTaskList();
}


// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.data('id');
    const newStatus = $(this).attr('id').split('-')[0];
    const task = taskList.find(task => task.id === taskId);
    task.status = newStatus;
    saveTasks();
    renderTaskList();
}

// created a Save Task funtions to save them in local storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(taskList));
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    // made lanes droppable
    $('.lane .card-body').droppable({
      accept: ".task-card",
      drop: handleDrop
    });
  
    // created event listeners
    $('#save-task').on('click', handleAddTask);
    $('#todo-cards, #in-progress-cards, #done-cards').on('click', '.delete-task', handleDeleteTask);
});
