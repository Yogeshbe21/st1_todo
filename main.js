const form = document.getElementById("form");
const listTasks = document.getElementById("list");

let tasks = [];
let searchTask = [];
loadTasksFromLocalStorage( );

// making or rendering task on page
function renderTasks(tasks) {
  listTasks.innerHTML = "";
  tasks.forEach((task) => {
    const newTask = document.createElement("div");
    newTask.classList.add("task");
    newTask.innerHTML = `
        <input type="checkbox" class="task_checkbox" ${task.completed ? 'checked' : ''}>
        <input type="text" name="" class="task_title" value="${
          task.title
        }" readonly required>
        <input type="text" name="" class="task_discription" value="${
          task.discription
        }" placeholder="add discription" readonly>
        <input type="date" name="" class="task_date" value="${
          task.date
        }" readonly required>
        <p id="task_error" style="display: none">enter valid date</p>
        <select name="" class="task_catagory" disabled>
           <option value="personal" ${
             task.catagory === "personal" ? "selected" : ""
           }>personal</option>
           <option value="home" ${
             task.catagory === "home" ? "selected" : ""
           }>home</option>
           <option value="work" ${
             task.catagory === "work" ? "selected" : ""
           }>work</option>
           <option value="shopping" ${
             task.catagory === "shopping" ? "selected" : ""
           }>shopping</option>
        </select>
        <button class="editbtn">edit</button>
        <button class="savebtn">save</button>
        <button class="deletebtn">delete</button>

        `;
    listTasks.appendChild(newTask);
  });

  listTasks.addEventListener("click", (event) => {
    const target = event.target;

    if (target.classList.contains("editbtn")) {
      editTask(target);
    } else if (target.classList.contains("savebtn")) {
      saveTask(target);
    } else if (target.classList.contains("deletebtn")) {
      deleteTask(target);
    }else if (target.classList.contains("task_checkbox")) {
        toggleTaskCompleted(target);
    }
  });
}

// adding task to localstorage
function addTask(title, discription, date, catagory) {
  const task = { title, discription, date, catagory };
  tasks.push(task);
  console.log("adding task", task);
  renderTasks(tasks);
}

// input form
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const inp_Title = event.target.elements.title.value;
  const inp_Discription = event.target.elements.discription.value;
  const inp_Date = event.target.elements.date.value;
  const inp_catagory = event.target.elements.catagory.value;
  const error = document.getElementById("error");

  const date_valid = document.getElementById("date");

  if (!Validate(date_valid)) {
    error.style.display = "inline";
    return false;
  } else if (Validate(date_valid)) {
    addTask(inp_Title, inp_Discription, inp_Date, inp_catagory);
    event.target.reset();
    saveTasksToLocalStorage();
  }
  error.style.display = "none";
});

// validation
function Validate(given_date) {
  console.log(given_date);
  // current date
  const today = new Date();
  const today_Date = new Intl.DateTimeFormat("ISO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const format = today_Date.format(today);
  const [month, day, year] = format.split("/");
  const curr_Date = `${year}-${month}-${day}`;
  // input date
  const user_date = given_date.value;
  // compairing date
  if (curr_Date > user_date) {
    console.log("wrong date");
    return false;
  } else {
    return true;
  }
}

// saving task localy
function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// loading task
function loadTasksFromLocalStorage() {
  const local = JSON.parse(localStorage.getItem("tasks"));
  if (local) {
    tasks = local;
    renderTasks(tasks);
  }
}

// Edit a task

function editTask(editButton) {
  const taskContainer = editButton.parentElement;
  const taskTitleInput = taskContainer.querySelector(".task_title");
  const taskDescriptionInput = taskContainer.querySelector(".task_discription");
  const taskDateInput = taskContainer.querySelector(".task_date");
  const taskCategorySelect = taskContainer.querySelector(".task_catagory");
  const saveButton = taskContainer.querySelector(".savebtn");

  taskTitleInput.removeAttribute("readonly");
  taskDescriptionInput.removeAttribute("readonly");
  taskDateInput.removeAttribute("readonly");
  taskCategorySelect.removeAttribute("disabled");

  editButton.style.display = "none";
  saveButton.style.display = "block";
}

// Save an edited task
function saveTask(saveButton) {
  const taskContainer = saveButton.parentElement;
  const taskTitleInput = taskContainer.querySelector(".task_title");
  const taskDiscriptionInput = taskContainer.querySelector(".task_discription");
  const taskDateInput = taskContainer.querySelector(".task_date");
  const taskCatagorySelect = taskContainer.querySelector(".task_catagory");
  const editButton = taskContainer.querySelector(".editbtn");
  const dateError = taskContainer.querySelector(".task_error");

  const index = Array.from(listTasks.children).indexOf(taskContainer);

  const updatedTitle = taskTitleInput.value;
  const updatedDiscription = taskDiscriptionInput.value;
  const updatedDate = taskDateInput.value;
  const updatedCatagory = taskCatagorySelect.value;

  if (!updatedTitle.trim()) {
    alert("Title cannot be empty.");
    return;
  }

  if (!Validate(updatedDate)) {
    alert("Invalid date.");
    return;
  }
  tasks[index].title = updatedTitle;
  tasks[index].discription = updatedDiscription;
  tasks[index].date = updatedDate;
  tasks[index].catagory = updatedCatagory;

  taskTitleInput.setAttribute("readonly", true);
  taskDiscriptionInput.setAttribute("readonly", true);
  taskDateInput.setAttribute("readonly", true);
  taskCatagorySelect.setAttribute("disabled", true);

  saveButton.style.display = "none";
  editButton.style.display = "block";

  saveTasksToLocalStorage();
  saveButton.style.display = "block";
}

// delete
function deleteTask(deleteButton) {
  const taskContainer = deleteButton.parentElement;
  const index = Array.from(listTasks.children).indexOf(taskContainer);

  if (index !== -1) {
    // Remove the task from the tasks array at the specified index
    tasks.splice(index, 1);

    // Remove the task container from the UI
    taskContainer.remove();

    // Save the updated tasks to localStorage
    saveTasksToLocalStorage();
  }
}

//checkbox
function toggleTaskCompleted(checkbox) {
    const taskContainer = checkbox.parentElement;
    const index = Array.from(listTasks.children).indexOf(taskContainer);
  
    tasks[index].completed = checkbox.checked;
  
    saveTasksToLocalStorage();
  }

//checkbox
function loadTasksFromLocalStorage() {
    const local = JSON.parse(localStorage.getItem("tasks"));
    if (local) {
      tasks = local;
      tasks.forEach(task => {
        task.completed = task.completed || false;
      });
      renderTasks(tasks);
    }
  }
// searching

function searchByTitle(title) {
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(title.toLowerCase())
  );
  renderTasks(filteredTasks);
}
const searchInput = document.getElementById("searchbox");
searchInput.addEventListener("input", (event) => {
  const searchQuery = event.target.value;
  searchByTitle(searchQuery);
});

// sorting

const sortCriteriaSelect = document.getElementById("sortCriteria");
sortCriteriaSelect.addEventListener("change", (event) => {
  const sortCriteria = event.target.value;

  if (sortCriteria === "title") {
    sortTasksByTitle();
  } else if (sortCriteria === "date") {
    sortTasksByDate();
  } else if (sortCriteria === "catagory") {
    sortTasksByCategory();
  } else if (sortCriteria === "completed") {
    sortTasksByCompleted();
  }
});

function sortTasksByTitle() {
  tasks.sort((a, b) => a.title.localeCompare(b.title));
  renderTasks(tasks);
}

function sortTasksByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTasks(tasks);
}

function sortTasksByCategory() {
  const categoryOrder = ["home", "personal", "work", "shopping"];
  tasks.sort((a, b) => {
    return categoryOrder.indexOf(a.catagory) - categoryOrder.indexOf(b.catagory);
  });
  renderTasks(tasks);
}

function sortTasksByCompleted() {
  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  tasks = [...completedTasks, ...incompleteTasks];
  renderTasks(tasks);
}

let b={name:"yogesh",roll:"1"};
console.log(b.name);













































































































