document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const categoryInput = document.getElementById('category-input');
    const todoList = document.getElementById('todo-list');
    const searchInput = document.getElementById('search-input');

    // Load todos from local storage
    const loadTodos = () => {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.forEach(todo => addTodoToList(todo));
    };

    // Save todo to local storage
    const saveTodoToLocalStorage = (todo) => {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Update local storage with current todos
    const updateLocalStorage = () => {
        const todos = Array.from(todoList.querySelectorAll('li')).map(li => {
            return {
                text: li.querySelector('span').textContent,
                completed: li.classList.contains('completed'),
                dueDate: li.querySelector('.due-date') ? li.querySelector('.due-date').textContent.replace('(Due: ', '').replace(')', '') : '',
                priority: li.querySelector('.priority') ? li.querySelector('.priority').textContent.toLowerCase() : '',
                category: li.querySelector('.category') ? li.querySelector('.category').textContent.replace('Category: ', '') : ''
            };
        });
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Remove todo from local storage
    const removeTodoFromLocalStorage = (todoToRemove) => {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos = todos.filter(todo => todo.text !== todoToRemove.text);
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    // Add todo to the list
    const addTodoToList = (todo) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        li.innerHTML = `
            <span>${todo.text}</span>
            <span class="due-date">${todo.dueDate ? `(Due: ${todo.dueDate})` : ''}</span>
            <span class="priority priority-${todo.priority}">${todo.priority ? todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1) : ''}</span>
            <span class="category">${todo.category ? `Category: ${todo.category}` : ''}</span>
            <button class="edit-btn">Edit</button>
            <button class="complete-btn">${todo.completed ? 'Uncomplete' : 'Complete'}</button>
            <button class="delete-btn">Delete</button>
        `;
        todoList.appendChild(li);

        // Edit button event
        li.querySelector('.edit-btn').addEventListener('click', () => {
            const newTodoText = prompt('Edit your task:', todo.text);
            if (newTodoText) {
                todo.text = newTodoText;
                li.querySelector('span').textContent = newTodoText;
                updateLocalStorage();
            }
        });

        // Complete button event
        li.querySelector('.complete-btn').addEventListener('click', () => {
            todo.completed = !todo.completed;
            li.classList.toggle('completed');
            li.querySelector('.complete-btn').textContent = todo.completed ? 'Uncomplete' : 'Complete';
            updateLocalStorage();
        });

        // Delete button event
        li.querySelector('.delete-btn').addEventListener('click', () => {
            todoList.removeChild(li);
            removeTodoFromLocalStorage(todo);
        });
    };

    // Handle form submission
    todoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newTodoText = todoInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;
        const category = categoryInput.value.trim();
        if (newTodoText) {
            const newTodo = { text: newTodoText, completed: false, dueDate, priority, category };
            addTodoToList(newTodo);
            saveTodoToLocalStorage(newTodo);
            todoInput.value = '';
            dueDateInput.value = '';
            priorityInput.value = 'low';
            categoryInput.value = '';
        }
    });

    // Filter todos based on search input
    const filterTodos = (searchText) => {
        const todos = JSON.parse(localStorage.getItem('todos')) || [];
        todoList.innerHTML = '';
        todos.filter(todo => todo.text.toLowerCase().includes(searchText)).forEach(todo => addTodoToList(todo));
    };

    // Search input event
    searchInput.addEventListener('input', () => {
        const searchText = searchInput.value.toLowerCase();
        filterTodos(searchText);
    });

    // Load todos on page load
    loadTodos();
});
