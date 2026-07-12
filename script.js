// ===========================
// Select Elements
// ===========================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const category = document.getElementById("category");

const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const greeting = document.getElementById("greeting");
const todayDate = document.getElementById("todayDate");

const emptyState = document.getElementById("emptyState");
const clearCompleted = document.getElementById("clearCompleted");

const filters = document.querySelectorAll(".filter");

// ===========================
// Variables
// ===========================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editTaskId = null;

// ===========================
// Greeting & Date
// ===========================

showGreeting();
displayDate();

function showGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) {
        greeting.textContent = "Good Morning ☀️";
    } else if (hour < 18) {
        greeting.textContent = "Good Afternoon 🌤";
    } else {
        greeting.textContent = "Good Evening 🌙";
    }

}

function displayDate() {

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    };

    todayDate.textContent = new Date().toLocaleDateString("en-US", options);

}

// ===========================
// Add / Update Task
// ===========================

taskForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    if (editTaskId) {

        const task = tasks.find(item => item.id === editTaskId);

        task.title = title;
        task.date = dueDate.value;
        task.priority = priority.value;
        task.category = category.value;

        editTaskId = null;

        document.getElementById("addTaskBtn").innerHTML =
            '<i class="fa-solid fa-plus"></i> Add Task';

    } else {

        const newTask = {

            id: Date.now(),

            title: title,

            date: dueDate.value,

            priority: priority.value,

            category: category.value,

            completed: false

        };

        tasks.push(newTask);

    }

    saveTasks();
    clearForm();
    displayTasks();

});

// ===========================
// Helper Functions
// ===========================

function clearForm() {

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "High";
    category.value = "";

}

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}

// ===========================
// Initial Load
// ===========================

displayTasks();
// ===========================
// Display Tasks
// ===========================

function displayTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    // Search
    const searchValue = searchInput.value.toLowerCase();

    filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchValue)
    );

    // Filter
    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    }

    // Empty State
    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
        taskList.style.display = "none";
    } else {
        emptyState.style.display = "none";
        taskList.style.display = "flex";
    }

    filteredTasks.forEach(task => {

        const card = createTaskCard(task);

        taskList.appendChild(card);

    });

    updateProgress();

}

// ===========================
// Create Task Card
// ===========================

function createTaskCard(task) {

    const card = document.createElement("div");

    card.className = "task-card";

    if (task.completed) {
        card.classList.add("completed");
    }

    card.innerHTML = `

    <div class="task-left">

        <input type="checkbox" ${task.completed ? "checked" : ""}>

        <div class="task-info">

            <h3 class="task-title">${task.title}</h3>

            <div class="task-details">

                <span class="badge category">
                    📂 ${task.category || "General"}
                </span>

                <span class="badge date">
                    📅 ${task.date || "No Date"}
                </span>

                <span class="badge ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

        </div>

    </div>

    <div class="task-actions">

        <button class="edit-btn">
            <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
        </button>

    </div>

    `;

    // Complete Task
    card.querySelector("input").addEventListener("change", function () {

        task.completed = this.checked;

        saveTasks();

        displayTasks();

    });

    // Delete Task
    card.querySelector(".delete-btn").addEventListener("click", function () {

        tasks = tasks.filter(item => item.id !== task.id);

        saveTasks();

        displayTasks();

    });

    // Edit Task
    card.querySelector(".edit-btn").addEventListener("click", function () {

        taskInput.value = task.title;
        dueDate.value = task.date;
        priority.value = task.priority;
        category.value = task.category;

        editTaskId = task.id;

        document.getElementById("addTaskBtn").innerHTML =
            '<i class="fa-solid fa-pen"></i> Update Task';

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    return card;

}

// ===========================
// Progress
// ===========================

function updateProgress() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    progressFill.style.width = percentage + "%";

    progressText.textContent = percentage + "%";

}
// ===========================
// Search Tasks
// ===========================

searchInput.addEventListener("input", displayTasks);

// ===========================
// Filter Tasks
// ===========================

filters.forEach(button => {

    button.addEventListener("click", function () {

        filters.forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        displayTasks();

    });

});

// ===========================
// Clear Completed Tasks
// ===========================

clearCompleted.addEventListener("click", function () {

    const completed = tasks.filter(task => task.completed);

    if (completed.length === 0) {
        alert("No completed tasks found.");
        return;
    }

    if (confirm("Delete all completed tasks?")) {

        tasks = tasks.filter(task => !task.completed);

        saveTasks();

        displayTasks();

    }

});

// ===========================
// Save Before Closing
// ===========================

window.addEventListener("beforeunload", saveTasks);

// ===========================
// Initial Display
// ===========================

displayTasks();
