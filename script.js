document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-tasks');
    const successMessage = document.getElementById('success-message');
    const totalTimeElement = document.getElementById('total-time');
    const tasksTodayElement = document.getElementById('tasks-today');
    const currentTaskElement = document.getElementById('current-task');
    let taskCount = 0;
    let totalMinutes = 0;
    let activeTask = null;
    let activeTimer = null;
    let activeTaskElement = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const taskName = document.getElementById('task-name').value;
        const taskDescription = tinymce.get('task-description').getContent();

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
        const showMore = document.createElement('span');

        checkbox.type = 'checkbox';
        span.textContent = name;
        descriptionDiv.innerHTML = description;
        descriptionDiv.classList.add('task-description');
        timerDiv.classList.add('timer');
        timerDiv.textContent = '00:00:00';
        showMore.textContent = 'משולם';
        showMore.classList.add('show-more');

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
        li.appendChild(showMore);
        li.appendChild(timerDiv);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);
        updateTasksTodayCount();

        let timerSeconds = 0;

        playButton.addEventListener('click', function() {
            if (activeTimer && activeTaskElement !== li) {
                clearInterval(activeTimer);
                activeTaskElement.classList.remove('active-task');
            }
            activeTask = li;
            activeTaskElement = li;
            li.classList.add('active-task');
            currentTaskElement.textContent = name;

            activeTimer = setInterval(function() {
                timerSeconds++;
                totalMinutes++;
                const hours = String(Math.floor(timerSeconds / 3600)).padStart(2, '0');
                const minutes = String(Math.floor((timerSeconds % 3600) / 60)).padStart(2, '0');
                const seconds = String(timerSeconds % 60).padStart(2, '0');
                timerDiv.textContent = `${hours}:${minutes}:${seconds}`;
                totalTimeElement.textContent = Math.floor(totalMinutes / 60);
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
                totalTimeElement.textContent = Math.floor(totalMinutes / 60);
                updateTasksTodayCount();
            }
        });

        showMore.addEventListener('click', function() {
            if (descriptionDiv.style.maxHeight) {
                descriptionDiv.style.maxHeight = null;
                showMore.textContent = 'משולם';
            } else {
                descriptionDiv.style.maxHeight = descriptionDiv.scrollHeight + 'px';
                showMore.textContent = 'הצג פחות';
            }
        });

        checkbox.addEventListener('change', function() {
            if (this.checked) {
                li.classList.add('completed-task');
                completedTaskList.appendChild(li);
            } else {
                li.classList.remove('completed-task');
                taskList.appendChild(li);
            }
            updateTasksTodayCount();
        });
    }

    function updateTasksTodayCount() {
        tasksTodayElement.textContent = taskList.children.length + completedTaskList.children.length;
    }

    function getCurrentDate() {
        const today = new Date();
        const hebrewDate = new Intl.DateTimeFormat('he-u-ca-hebrew', { dateStyle: 'full' }).format(today);
        const englishDate = today.toLocaleDateString('en-US');
        return `${hebrewDate} | ${englishDate}`;
    }

    document.getElementById('date').textContent = getCurrentDate();
});
