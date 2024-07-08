document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-tasks');
    const successMessage = document.getElementById('success-message');
    const totalTimeElement = document.getElementById('total-time');
    const currentTaskElement = document.getElementById('current-task');
    let taskCount = 0;
    let totalMinutes = 0;
    let activeTask = null;
    let activeTimer = null;
    let activeTaskElement = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDescription = document.getElementById('task-description').value;

        addTask(taskName, taskDescription);
        form.reset();
        successMessage.style.display = 'block';
        setTimeout(function() {
            successMessage.style.display = 'none';
        }, 2000); // Hide the success message after 2 seconds
    });

    function addTask(name, description) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        const span = document.createElement('span');
        const descriptionDiv = document.createElement('div');
        const actionsDiv = document.createElement('div');
        const timerDiv = document.createElement('div');

        checkbox.type = 'checkbox';
        span.textContent = name;
        descriptionDiv.textContent = description;
        descriptionDiv.classList.add('task-description');
        timerDiv.classList.add('timer');
        timerDiv.textContent = '00:00:00';

        li.classList.add('task');
        const taskNumber = document.createElement('span');
        taskNumber.textContent = ++taskCount;
        taskNumber.classList.add('task-number');

        const playButton = createButton('▶ הפעלה', 'play');
        const pauseButton = createButton('⏸ השהייה', 'pause');
        const stopButton = createButton('⏹ עצירה');

        actionsDiv.classList.add('task-actions');
        actionsDiv.appendChild(playButton);
        actionsDiv.appendChild(pauseButton);
        actionsDiv.appendChild(stopButton);

        li.appendChild(taskNumber);
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(descriptionDiv);
        li.appendChild(timerDiv);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);

        playButton.addEventListener('click', function() {
            if (activeTimer) {
                clearInterval(activeTimer);
                activeTaskElement.classList.remove('active-task');
            }
            activeTask = li;
            activeTaskElement = li;
            li.classList.add('active-task');
            currentTaskElement.textContent = name;

            let timerSeconds = 0;
            activeTimer = setInterval(function() {
                timerSeconds++;
                const hours = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
                const seconds = String(timerSeconds % 60).padStart(2, '0');
                timerDiv.textContent = `${hours}:${minutes}:${seconds}`;
            }, 1000);
        });

        pauseButton.addEventListener('click', function() {
            if (activeTask === li) {
                clearInterval(activeTimer);
                activeTimer = null;
            }
        });

        stopButton.addEventListener('click', function() {
            if (activeTask === li) {
                clearInterval(activeTimer);
                activeTimer = null;
                li.classList.remove('active-task');
                li.classList.add('completed-task');
                completedTaskList.appendChild(li);
                currentTaskElement.textContent = 'אין משימה פעילה';
                const timeParts = timerDiv.textContent.split(':');
                const taskMinutes = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                totalMinutes += taskMinutes;
                totalTimeElement.textContent = totalMinutes;
                taskList.removeChild(li);
            }
        });

        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                li.classList.add('completed-task');
                completedTaskList.appendChild(li);
            } else {
                li.classList.remove('completed-task');
                taskList.appendChild(li);
            }
        });

        saveTasks();
    }

    function createButton(text, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        return button;
    }

    function saveTasks() {
        const tasks = [];
        const completedTasks = [];
        
        taskList.querySelectorAll('.task').forEach(task => {
            tasks.push(task.innerHTML);
        });

        completedTaskList.querySelectorAll('.task').forEach(task => {
            completedTasks.push(task.innerHTML);
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks'));
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
        
        if (tasks) {
            taskList.innerHTML = tasks.join('');
        }
        
        if (completedTasks) {
            completedTaskList.innerHTML = completedTasks.join('');
        }
    }
    
    loadTasks();
});
