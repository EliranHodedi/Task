document.addEventListener("DOMContentLoaded", function() {
    tinymce.init({
        selector: '#task-desc',
        plugins: 'advlist autolink lists link image charmap print preview anchor textcolor',
        toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help'
    });

    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');
    const totalTimeElement = document.getElementById('total-time');
    const tasksTodayElement = document.getElementById('tasks-today');
    const currentTaskElement = document.getElementById('current-task');
    let totalMinutes = 0;

    function getCurrentDate() {
        const today = new Date();
        const hebrewDate = new Intl.DateTimeFormat('he-u-ca-hebrew', { dateStyle: 'full' }).format(today);
        const englishDate = today.toLocaleDateString('en-US');
        return `${hebrewDate} | ${englishDate}`;
    }

    document.getElementById('date').textContent = getCurrentDate();

    function createTaskElement(title, description) {
        const li = document.createElement('li');
        li.className = 'task';

        const titleSpan = document.createElement('span');
        titleSpan.className = 'task-title';
        titleSpan.textContent = title;

        const descDiv = document.createElement('div');
        descDiv.className = 'task-desc';
        descDiv.innerHTML = description;

        const timerSpan = document.createElement('span');
        timerSpan.className = 'task-timer';
        timerSpan.textContent = '00:00';

        const playButton = document.createElement('button');
        playButton.textContent = 'הפעלה';

        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'השהייה';

        const stopButton = document.createElement('button');
        stopButton.textContent = 'עצירה';

        let startTime, elapsedTime = 0, timerInterval;

        function updateTime() {
            const now = Date.now();
            const diff = now - startTime + elapsedTime;
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            timerSpan.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            totalTimeElement.textContent = parseInt(totalTimeElement.textContent) + 1;
        }

        playButton.addEventListener('click', function() {
            startTime = Date.now();
            timerInterval = setInterval(updateTime, 1000);
            currentTaskElement.textContent = title;
            li.style.backgroundColor = '#deffd9';
        });

        pauseButton.addEventListener('click', function() {
            clearInterval(timerInterval);
            elapsedTime += Date.now() - startTime;
        });

        stopButton.addEventListener('click', function() {
            clearInterval(timerInterval);
            li.classList.add('completed');
            completedTaskList.appendChild(li);
            li.style.backgroundColor = '#ccc';
            updateTasksTodayCount();
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const taskNumber = document.createElement('span');
        taskNumber.className = 'task-number';

        li.appendChild(taskNumber);
        li.appendChild(checkbox);
        li.appendChild(titleSpan);
        li.appendChild(descDiv);
        li.appendChild(playButton);
        li.appendChild(pauseButton);
        li.appendChild(stopButton);
        li.appendChild(timerSpan);

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

        return li;
    }

    function updateTasksTodayCount() {
        tasksTodayElement.textContent = taskList.children.length + completedTaskList.children.length;
    }

    addTaskButton.addEventListener('click', function() {
        const title = document.getElementById('task-title').value;
        const description = tinymce.get('task-desc').getContent();
        if (title) {
            const taskElement = createTaskElement(title, description);
            taskList.appendChild(taskElement);
            document.getElementById('task-title').value = '';
            tinymce.get('task-desc').setContent('');
            updateTasksTodayCount();
        }
    });
});
