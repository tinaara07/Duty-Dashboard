// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Function to generate a unique task ID
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  const card = $("<div></div>")
    .addClass("task-card ui-state-default")
    .data("task-id", task.taskId) // Store task ID in the card
    .draggable({
      revert: "invalid", // Revert if not dropped in a valid droppable area
      start: function() {
        $(this).addClass("dragging");
      },
      stop: function() {
        $(this).removeClass("dragging");
      }
    });

  const title = $("<p></p>").text(task.taskTitle);
  const dueDate = $("<div></div>").text(task.taskDueDate);
  const description = $("<div></div>").text(task.taskDescription);

  // Append elements to the card
  card.append(title);
  card.append(dueDate);
  card.append(description);
  return card;
}

// Function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards").empty();
  taskList.forEach(task => {
    if (task.status === "To Do") {
      const taskCard = createTaskCard(task);
      $("#todo-cards").append(taskCard);
    }
  });
}

// Function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault(); // Prevents page refresh
  const taskTitle = $("#taskTitle").val();
  const taskDueDate = $("#taskDueDate").val();
  const taskDescription = $("#taskDescription").val();

  const newTask = {
    taskId: generateTaskId(),
    taskTitle,
    taskDueDate,
    taskDescription,
    status: "To Do",
  };

  taskList.push(newTask); // Update the list with the new task
  localStorage.setItem("taskList", JSON.stringify(taskList));
  
  // Clear input fields
  $("#taskTitle").val("");
  $("#taskDueDate").val("");
  $("#taskDescription").val("");

  renderTaskList();
}

// Function to handle deleting a task
function handleDeleteTask(event) {
  const taskId = $(event.target).data("task-id");
  taskList = taskList.filter(task => task.taskId !== taskId);
  localStorage.setItem("taskList", JSON.stringify(taskList));
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const droppedTaskId = ui.draggable.data("task-id");
  const newStatus = $(this).data("status"); // Get the new status from the droppable area

  // Update the task's status
  const task = taskList.find(task => task.taskId === droppedTaskId);
  if (task) {
    task.status = newStatus;
    localStorage.setItem("taskList", JSON.stringify(taskList));
    renderTaskList(); // Re-render the task list to reflect changes
  }
}

// When the page loads, render the task list, add event listeners, and initialize date picker
$(document).ready(function () {
  renderTaskList();
  $("#submit").click(handleAddTask);
  $("#taskDueDate").datepicker({ changeMonth: true, changeYear: true });

  // Initialize droppable areas for each status lane
  $(".sortable").droppable({
    accept: ".task-card",
    over: function(event, ui) {
      $(this).addClass("hover"); // Add hover class when dragging over
    },
    out: function(event, ui) {
      $(this).removeClass("hover"); // Remove hover class when dragging out
    }
  }); 
}); 