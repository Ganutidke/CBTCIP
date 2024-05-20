document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const filterUncompletedBtn = document.getElementById('filter-uncompleted');
    const countdownEl = document.getElementById('countdown');

    let filter = 'all';

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if (filter === 'completed' && !task.completed) return;
            if (filter === 'uncompleted' && task.completed) return;

            const taskItem = document.createElement('li');
            taskItem.className = 'flex items-center  justify-between bg-gray-700 p-4 rounded-lg shadow cursor-move';
            taskItem.setAttribute('draggable', 'true');
            taskItem.setAttribute('data-index', index);
            taskItem.innerHTML = `
                <span class="flex-1 text-white truncate ${task.completed ? 'line-through' : ''}" onclick="toggleTask(${index})">${task.text}</span>
                <div>
                    <button onclick="editTask(${index})" class="text-yellow-500 mr-2 hover:text-yellow-400">Edit</button>
                    <button onclick="deleteTask(${index})" class="text-red-500 hover:text-red-400">Delete</button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });

        new Sortable(taskList, {
            animation: 150,
            onEnd: (evt) => {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const [movedTask] = tasks.splice(evt.oldIndex, 1);
                tasks.splice(evt.newIndex, 0, movedTask);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            }
        });
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText) {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push({ text: taskText, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskInput.value = '';
            loadTasks();
        }
    });

    window.deleteTask = (index) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    };

    window.editTask = (index) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const newTask = prompt('Edit task:', tasks[index].text);
        if (newTask !== null) {
            tasks[index].text = newTask.trim();
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
    };

    window.toggleTask = (index) => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks[index].completed = !tasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    };

    filterAllBtn.addEventListener('click', () => {
        filter = 'all';
        loadTasks();
    });

    filterCompletedBtn.addEventListener('click', () => {
        filter = 'completed';
        loadTasks();
    });

    filterUncompletedBtn.addEventListener('click', () => {
        filter = 'uncompleted';
        loadTasks();
    });

    const updateCountdown = () => {
        const now = new Date();
        const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const timeRemaining = midnight - now;

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownEl.textContent = `Time until midnight: ${hours}h ${minutes}m ${seconds}s`;

        setTimeout(updateCountdown, 1000);
    };

    const clearTasksAtMidnight = () => {
        const now = new Date();
        const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0) - now;
        setTimeout(() => {
            localStorage.removeItem('tasks');
            loadTasks();
            clearTasksAtMidnight(); // set the timeout again for the next day
        }, msToMidnight);
    };

    loadTasks();
    updateCountdown();
    clearTasksAtMidnight();
});
