'use strict';

// Date

const dateTitle = document.querySelector("#date");
const date = new Date();

const days = {
    0: "Domingo", 1: "Lunes", 2: "Martes", 3: "Miercoles",
    4: "Jueves", 5: "Viernes", 6: "Sábado"
}

const abbreviatedDays = {
    0: "Dom", 1: "Lun", 2: "Mar", 3: "Mier",
    4: "Jue", 5: "Vie", 6: "Sáb"
}

const months = {
    0: "Enero", 1: "Febrero", 2: "Marzo", 3: "Abril",
    4: "Mayo", 5: "Junio", 6: "Julio", 7: "Agosto",
    8: "Septiembre", 9: "Octubre", 10: "Noviembre", 11: "Diciembre"
}

const maxDaysPerMonth = {
    0: "Enero", 1: "Febrero", 2: "Marzo", 3: "Abril",
    4: "Mayo", 5: "Junio", 6: "Julio", 7: "Agosto",
    8: "Septiembre", 9: "Octubre", 10: "Noviembre", 11: "Diciembre"
}

const dateComplete =    months[date.getMonth()]+ ", " + 
                        days[date.getDay()] + " " + 
                        date.getDate();

dateTitle.innerHTML = dateComplete;
// Calendar

function GetDaysLeft(year, month){
    const daysLeft = new Date(year, month, 0);
    return daysLeft.getDate();
}

const currentDay = date.getDate();
const currentYear = date.getFullYear();
const month = date.getMonth() + 1;
const daysLeft = GetDaysLeft(currentYear,month);

$('#datepicker').datepicker({
    dateFormat: "yy-mm-dd",
    minDate: 0
});


const calendar = document.getElementById("calendar")

var daysArray = []
 
for (let i = currentDay; i <= daysLeft; i++) {

    let div = document.createElement("div");
    i == currentDay ? div.className = "day-box date-selected date-selected-color" : div.className = "day-box no-selected";
    div.id = i;

    let dayCalendar = new Date(currentYear, month - 1, i);


    div.innerHTML = `<p class='day-number'>${i}</p>
                    <p class='day-name'>${abbreviatedDays[dayCalendar.getDay()]}</p>`;

    calendar.appendChild(div)
    
    var elementCalendar = document.getElementById(i);
    daysArray.push(elementCalendar);
}

// Change color of day selected

const changeDayInformation = function () {
	let daySelected = this;

    for (let i = 0; i < daysArray.length; i++) {
        if(i != daySelected){
            daysArray[i].classList.remove("date-selected-color")
            daysArray[i].classList.remove("date-selected")
            daysArray[i].classList.add("no-selected");
        }
    }
    
    daySelected.classList.add("date-selected-color")
    daySelected.classList.add("date-selected")
    daySelected.classList.remove("no-selected")

    updateDisplay()

}

daysArray.forEach(days => { days.addEventListener("click", changeDayInformation)});

// Change display

const changeButton = document.getElementById("create-task");
const tasks = document.getElementById("tasks");
const formAddTask = document.getElementById("form-add-tasks");

changeButton.addEventListener("click", () => {
    changeDisplay()
},false)

function changeDisplay(){

    if(dateTitle.classList.contains("sectionSide")){
        changeButton.classList.add("sectionSide")
        dateTitle.classList.remove("sectionSide")

        calendar.style.display = "flex";
        tasks.style.display = "block";
        formAddTask.style.display = "none";
        dateTitle.innerHTML = dateComplete;
        changeButton.style.backgroundImage = "url(assets/add.svg)"

        updateDisplay();

    }else{

        changeButton.classList.remove("sectionSide")
        dateTitle.classList.add("sectionSide")

        calendar.style.display = "none";
        tasks.style.display = "none";
        formAddTask.style.display = "block";
        dateTitle.innerHTML = "Crear nueva tarea";
        changeButton.style.backgroundImage = "url(assets/back.svg)"

    }

}

function updateDisplay(){

    let updatedTasks = [];
    updatedTasks = JSON.parse(localStorage.getItem('tasks'));
    let dayButtonSelected = parseInt(document.getElementsByClassName("date-selected")[0].id);

    tasks.innerHTML = ""

    var tasksArray = []

    updatedTasks.forEach(element => {

        let elementDate = element.date;
        let  elementDay = elementDate.split('-');

        if(elementDay[2] == dayButtonSelected){
            tasksArray.push(element);
        }

    });

    if(tasksArray.length >= 1){

        tasksArray.forEach(element => {

        let div = document.createElement("div");
        console.log(element);

        var divTextColor = "";
        var divMarginColor = "";

        if(element.category == "DESARROLLO"){
            divTextColor = "type-development";
            divMarginColor = "event-development";
        }else if(element.category == "UNIVERSIDAD"){
            divTextColor = "type-university";
            divMarginColor = "event-university";
        }else{
            divTextColor = "type-home";
            divMarginColor = "event-home";
        }



        div.innerHTML = `
        
        <div class="event-card">
                <div class="type ${divTextColor}">
                    <p>${element.category}</p>
                </div>
                <div class="event-content ${divMarginColor}">
                    <img src="assets/menu-card.png" class="menu-card">
                    <h3>${element.name}</h3>
                    <p>${element.comment}</p>
                </div>
                <div class="event-info">
                    <div class="time">${element.startTime} - ${element.finishTime}</div>
                    <div class="status">Activo</div>
                </div>
            </div>
        
        `;

        tasks.appendChild(div)
            
        });

    }else{

        tasks.innerHTML = ` <p style="text-align: center; margin: 30px;">
                                No hay tareas para este día, oprime el botón para crear una nueva
                            </p>
                            <button onclick="changeDisplay()" id="new-task-secondary" style="width: 100px; display: block; margin: auto; background: var(--blue-main-bg-color); padding: 20px;border-radius: 25px;cursor: pointer;">
                                <img src="assets/add.svg">
                            </button>
                            `

    }
    

}

// Creating a new task

const developDiv = document.getElementById("develop-div");
const universityDiv = document.getElementById("university-div");
const homeDiv = document.getElementById("home-div");

const form = document.getElementById("form")

developDiv.addEventListener("click", () => {
    universityDiv.classList.remove("university-selected");
    homeDiv.classList.remove("home-selected");
    developDiv.classList.add("develop-selected");
},false);

universityDiv.addEventListener("click", () => {
    developDiv.classList.remove("develop-selected");
    homeDiv.classList.remove("home-selected");
    universityDiv.classList.add("university-selected");
},false);

homeDiv.addEventListener("click", () => {
    developDiv.classList.remove("develop-selected");
    universityDiv.classList.remove("university-selected");
    homeDiv.classList.add("home-selected");
},false);

if(localStorage.getItem("tasks")){
    const taskArray = JSON.parse(localStorage.getItem('tasks'))
    localStorage.setItem('tasks', JSON.stringify(taskArray));
}else{
    const taskArray = []
    localStorage.setItem('tasks', JSON.stringify(taskArray));
}


function SaveTask(task){
    var taskArray = [];
    taskArray = JSON.parse(localStorage.getItem('tasks'));
    taskArray.push(task);
    localStorage.setItem('tasks', JSON.stringify(taskArray));
    changeDisplay()
}


form.addEventListener("submit", (e) => {
    e.preventDefault();

    var data = new FormData(form);

    var taskName = data.get("task-name");
    var taskDate = data.get("datepicker");
    var taskStartTime = data.get("task-start-time");
    var taskFinishTime = data.get("task-finish-time");
    var taskInfo = data.get("task-info");
    var taskCategory = data.get("category");

    if(taskName == "" || taskDate == "" || taskStartTime == ""
    || taskFinishTime == "" || taskCategory == ""){

        const error = document.getElementById("error");
        error.classList.add("error");
        error.innerHTML = "Hay campos que aún debes rellenar";

    }else{

        error.classList.remove("error");
        error.innerHTML = "";

        class Task {
            constructor(name, date, stime, ftime, category, comment = "") {
                this.comment = comment;
                this.category = category;
                this.startTime = stime;
                this.finishTime = ftime;
                this.date = date;
                this.name = name;
            }
        }

        var newTask = new Task(taskName,taskDate,taskStartTime,taskFinishTime,taskCategory,taskInfo);

        form.reset();
        SaveTask(newTask);

    }

},false)

// Retrive tasks

function RetriveTasks(){
    var dataRetrived = JSON.parse(localStorage.getItem('tasks'));
    var dataRows = Object.keys(dataRetrived).length

    console.log(dataRows);

    for (let j = 0; j < dataRows; j++) {
        console.log(dataRetrived[j].name)
    }

}

$(function () {
    $("#datepicker").datepicker();
    });

    $('.timepicker').timepicker({
        timeFormat: 'h:mm p',
        interval: 30,
        minTime: '00:00am',
        maxTime: '11:30pm',
        defaultTime: '13',
        startTime: '0',
        dynamic: true,
        dropdown: true,
        scrollbar: true
    });


// Once the page is loaded

updateDisplay()