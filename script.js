// ===============================
// Select Elements
// ===============================


const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const category = document.getElementById("category");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const filters = document.querySelectorAll(".filter");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const emptyState = document.getElementById("emptyState");

const clearCompleted = document.getElementById("clearCompleted");

const currentDate = document.getElementById("currentDate");


// ===============================
// Current Date
// ===============================


currentDate.innerText =
new Date().toDateString();


// ===============================
// Load Tasks
// ===============================


let tasks = JSON.parse(
localStorage.getItem("tasks")
) || [];



let currentFilter = "all";

let editId = null;



// Initial Render

renderTasks();

// ===============================
// Add / Update Task
// ===============================


addBtn.addEventListener("click",()=>{


    const text = taskInput.value.trim();


    if(text === ""){

        alert("Please enter a task");

        return;

    }



    if(editId){

        tasks = tasks.map(task=>{

            if(task.id === editId){

                return {

                    ...task,

                    text:text,

                    date:dueDate.value,

                    priority:priority.value,

                    category:category.value

                }

            }

            return task;

        });


        editId=null;

        addBtn.innerText="Add Task";


    }

    else{


        const newTask={


            id:Date.now(),

            text:text,

            date:dueDate.value,

            priority:priority.value,

            category:category.value,

            completed:false


        };


        tasks.push(newTask);


    }



    saveTasks();


    renderTasks();



    clearInputs();



});


// ===============================
// Clear Inputs
// ===============================


function clearInputs(){


taskInput.value="";

dueDate.value="";

category.value="";

priority.value="High";


}

// ===============================
// Save Local Storage
// ===============================


function saveTasks(){


localStorage.setItem(
"tasks",
JSON.stringify(tasks)
);


}


// ===============================
// Render Tasks
// ===============================


function renderTasks(){


taskList.innerHTML="";



let filteredTasks = tasks.filter(task=>{


    if(currentFilter==="completed"){

        return task.completed;

    }


    if(currentFilter==="active"){

        return !task.completed;

    }


    return true;


});


const searchValue =
searchInput.value.toLowerCase();



filteredTasks =
filteredTasks.filter(task=>{


return task.text
.toLowerCase()
.includes(searchValue);



});

if(filteredTasks.length===0){


emptyState.style.display="block";


}

else{


emptyState.style.display="none";


}

filteredTasks.forEach(task=>{


const card=document.createElement("div");


card.className =
"task-card " +
(task.completed ? "completed":"");



card.draggable=true;



card.dataset.id=task.id;




card.innerHTML=`

<div class="task-left">


<input 
type="checkbox"
${task.completed ? "checked":""}
onchange="toggleComplete(${task.id})">


<div>


<h3>${task.text}</h3>


<p>
📅 ${task.date || "No Date"}
<br>

📂 ${task.category || "General"}

</p>


</div>



</div>



<div>


<span class="priority ${task.priority.toLowerCase()}">

${task.priority}

</span>



<div class="task-actions">


<button 
class="edit"
onclick="editTask(${task.id})">

Edit

</button>



<button
class="delete"
onclick="deleteTask(${task.id})">

Delete

</button>


</div>



</div>

`;





taskList.appendChild(card);



});



updateProgress();


dragEvents();


}


// ===============================
// Complete Task
// ===============================


function toggleComplete(id){


tasks =
tasks.map(task=>{


if(task.id===id){


task.completed =
!task.completed;


}


return task;


});



saveTasks();

renderTasks();


}


// ===============================
// Delete Task
// ===============================


function deleteTask(id){


tasks =
tasks.filter(task=>task.id!==id);



saveTasks();

renderTasks();


}

// ===============================
// Edit Task
// ===============================


function editTask(id){


const task =
tasks.find(task=>task.id===id);



taskInput.value=task.text;

dueDate.value=task.date;

priority.value=task.priority;

category.value=task.category;



editId=id;



addBtn.innerText="Update Task";


window.scrollTo({

top:0,

behavior:"smooth"

});


}

// ===============================
// Search
// ===============================


searchInput.addEventListener(
"input",
()=>{

renderTasks();

});

// ===============================
// Filters
// ===============================


filters.forEach(button=>{


button.addEventListener("click",()=>{


filters.forEach(btn=>{

btn.classList.remove("active");

});


button.classList.add("active");


currentFilter =
button.dataset.filter;


renderTasks();



});


});


// ===============================
// Progress
// ===============================


function updateProgress(){



const total =
tasks.length;



const completed =
tasks.filter(
task=>task.completed
).length;



totalTasks.innerText=total;


completedTasks.innerText=completed;



let percentage =
total===0
?
0
:
Math.round(
(completed/total)*100
);



progressFill.style.width =
percentage+"%";



progressText.innerText =
percentage+"%";



}

// ===============================
// Clear Completed
// ===============================


clearCompleted.addEventListener(
"click",
()=>{


tasks =
tasks.filter(
task=>!task.completed
);


saveTasks();

renderTasks();


});

// ===============================
// Drag & Drop
// ===============================


function dragEvents(){


const cards =
document.querySelectorAll(".task-card");



let dragged;



cards.forEach(card=>{


card.addEventListener(
"dragstart",
()=>{


dragged=card;


});




card.addEventListener(
"dragover",
e=>{

e.preventDefault();

});




card.addEventListener(
"drop",
()=>{


let from =
tasks.findIndex(
t=>t.id==dragged.dataset.id
);



let to =
tasks.findIndex(
t=>t.id==card.dataset.id
);



[
tasks[from],
tasks[to]

]=
[
tasks[to],
tasks[from]
];



saveTasks();

renderTasks();


});



});


}
