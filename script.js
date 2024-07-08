document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-tasks');
    const successMessage = document.getElementById('success-message');
    let taskCount = 0;

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
        const currentDate = new Date().toLocaleDateString();

        checkbox.type = 'checkbox';
        span.textContent = name;
        descriptionDiv.textContent = description;
        descriptionDiv.classList.add('task-description');
        li.classList.add('task');

        const taskNumber = document.createElement('span');
        taskNumber.textContent = ++taskCount;
        taskNumber.classList.add('task-number');

        const playButton = createButton('▶ הפעלה', 'play');
        const pauseButton = createButton('⏸ השהייה', 'pause');
        const stopButton = createButton('⏹ עצירה', 'stop');

        actionsDiv.classList.add('task-actions');
        actionsDiv.appendChild(playButton);
        actionsDiv.appendChild(pauseButton);
        actionsDiv.appendChild(stopButton);

        li.appendChild(taskNumber);
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(descriptionDiv);
        li.appendChild(actionsDiv);

        taskList.appendChild(li);
    }

    function createButton(text, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        return button;
    }
});
