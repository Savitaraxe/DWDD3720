let todos = [];
let currentEditId = null;

// Function to add a new todo
function addTodo(name, status, category, dueDate) {
    const newTodo = {
        id: todos.length + 1,
        name,
        status,
        category,
        dueDate
    };
    todos.push(newTodo);
    return newTodo;
}

// Function to display the most recent todo
function displayRecentTodo() {
    const recentTodoContainer = document.getElementById('recentTodo');
    const todoListContainer = document.getElementById('todoList');

    recentTodoContainer.innerHTML = ''; // Clear previous content
    todoListContainer.innerHTML = '';   // Hide all other todos

    if (todos.length > 0) {
        const recentTodo = todos[todos.length - 1]; // Get the most recent todo
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');
        todoItem.innerHTML = `
            <strong>ID:</strong> ${recentTodo.id} <br>
            <strong>Name:</strong> ${recentTodo.name} <br>
            <strong>Status:</strong> ${recentTodo.status} <br>
            <strong>Category:</strong> ${recentTodo.category} <br>
            <strong>Due Date:</strong> ${recentTodo.dueDate}
        `;
        recentTodoContainer.appendChild(todoItem); // Show only the most recent todo
    }
}

// Function to display all todos except the most recent one
let isTodosVisible = false; // Flag to track if todos are currently visible

function displayAllTodos() {
    const todoListContainer = document.getElementById('todoList');
    const recentTodoContainer = document.getElementById('recentTodo');

    if (isTodosVisible) {
        todoListContainer.innerHTML = ''; // Hide all todos
        isTodosVisible = false;
    } else {
        todoListContainer.innerHTML = '';  // Clear previous list
        recentTodoContainer.innerHTML = ''; // Hide the recent todo since we're displaying all

        if (todos.length > 0) {
            todos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.classList.add('todo-item');
                todoItem.innerHTML = `
                    <strong>ID:</strong> ${todo.id} <br>
                    <strong>Name:</strong> ${todo.name} <br>
                    <strong>Status:</strong> ${todo.status} <br>
                    <strong>Category:</strong> ${todo.category} <br>
                    <strong>Due Date:</strong> ${todo.dueDate}
                `;
                todoListContainer.appendChild(todoItem); // Show all todos, including the most recent
            });
        } else {
            const noTodosMessage = document.createElement('div');
            noTodosMessage.textContent = 'No todos to display.';
            todoListContainer.appendChild(noTodosMessage);
        }
        isTodosVisible = true;
    }
}




// Function to remove completed todos
function removeCompletedTodos() {
    todos = todos.filter(todo => todo.status !== "complete"); // Keep todos that are not complete
    displayRecentTodo(); // Refresh the display after removal
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    displayRecentTodo(); // Refresh to show only the most recent todo
}

// Clear all todos
function clearAllTodos() {
    todos = [];
    document.getElementById('todoList').innerHTML = '';
    document.getElementById('recentTodo').innerHTML = '';
}

/// Function to display and handle the edit menu visibility
let isEditMenuVisible = false; // Track if the edit menu is visible

function showEditMenu() {
    const todoList = document.getElementById('todoList');

    if (isEditMenuVisible) {
        // If the edit menu is currently visible, hide it
        todoList.innerHTML = ''; // Clear the todoList to hide the menu
        isEditMenuVisible = false; // Set the flag to indicate the menu is hidden
    } else {
        // If the edit menu is not visible, show it
        todoList.innerHTML = ''; // Clear previous content to start fresh

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            // Display todos in normal (non-edit) mode by default
            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id}, <strong>Task:</strong> ${todo.name}, <strong>Status:</strong> ${todo.status}
                <button onclick="editTodo(${todo.id})">Edit</button>
            `;

            todoList.appendChild(todoItem);
        });

        isEditMenuVisible = true; // Set the flag to indicate the menu is visible
    }
}

// Edit a todo (do not call showEditMenu() here)
function editTodo(id) {
    currentEditId = id; // Set the current edit ID
    const todoList = document.getElementById('todoList');

    // Clear the todoList first to show the editable todo
    todoList.innerHTML = '';

    // Display the current todo in edit mode
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item');

        if (currentEditId === todo.id) {
            // Show the editable fields for the selected todo
            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id} 
                <input type="text" id="editName${todo.id}" value="${todo.name}" />
                <select id="editStatus${todo.id}">
                    <option value="Not Complete" ${todo.status === 'Not Complete' ? 'selected' : ''}>Not Complete</option>
                    <option value="complete" ${todo.status === 'complete' ? 'selected' : ''}>Complete</option>
                    <option value="Other" ${todo.status === 'Other' ? 'selected' : ''}>Other</option>
                </select>
                <input type="text" id="editCategory${todo.id}" value="${todo.category}" />
                <input type="date" id="editDueDate${todo.id}" value="${todo.dueDate}" />
                <button onclick="saveEdit(${todo.id})">Save</button>
                <button onclick="cancelEdit()">Cancel</button>
            `;
        } else {
            // Show other todos in normal display mode
            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id}, <strong>Task:</strong> ${todo.name}, <strong>Status:</strong> ${todo.status}
                <button onclick="editTodo(${todo.id})">Edit</button>
            `;
        }

        todoList.appendChild(todoItem);
    });
}

// Save the edited todo
function saveEdit(id) {
    const name = document.getElementById(`editName${id}`).value;
    const status = document.getElementById(`editStatus${id}`).value;
    const category = document.getElementById(`editCategory${id}`).value;
    const dueDate = document.getElementById(`editDueDate${id}`).value;

    // Update the todo with new values
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.name = name;
        todo.status = status; // Update status with selected value
        todo.category = category;
        todo.dueDate = dueDate;
    }

    currentEditId = null; // Reset the current edit ID
    showEditMenu(); // Refresh the edit menu to show all tasks again
}

// Cancel editing a todo
function cancelEdit() {
    currentEditId = null; // Reset the current edit ID
    showEditMenu(); // Refresh the edit menu to revert back to display mode
}