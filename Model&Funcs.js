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
}

// Show all todos in the edit menu
function showEditMenu() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item', todo.status);
        todoItem.innerHTML = `
            <strong>ID:</strong> ${todo.id}, <strong>Task:</strong> ${todo.name}
            <button onclick="editTodo(${todo.id})">Edit</button>
            <div class="icon-container">
                <img src="trash.png" alt="Delete" style="width: 40px; height: 40px; cursor: pointer;" onclick="deleteTodo(${todo.id})">
            </div>
        `;
        todoList.appendChild(todoItem);
    });
}

// Edit a todo
function editTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        document.getElementById('name').value = todo.name;
        document.getElementById('status').value = todo.status;
        document.getElementById('category').value = todo.category;
        document.getElementById('dueDate').value = todo.dueDate;
        currentEditId = id;
        document.getElementById('addTodoBtn').innerText = 'Save Changes';
    }
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    showEditMenu(); // Refresh the edit menu display
}

// Handle adding or saving todo
function handleTodoAction() {
    const name = document.getElementById('name').value;
    const status = document.getElementById('status').value;
    const category = document.getElementById('category').value;
    const dueDate = document.getElementById('dueDate').value;

    if (currentEditId !== null) {
        // If editing an existing todo
        const todo = todos.find(t => t.id === currentEditId);
        todo.name = name;
        todo.status = status;
        todo.category = category;
        todo.dueDate = dueDate;

        currentEditId = null; // Reset edit ID
        document.getElementById('addTodoBtn').innerText = 'Add To-Do'; // Reset button text
    } else if (name && status && category && dueDate) {
        // If adding a new todo
        addTodo(name, status, category, dueDate);
    }

    // Clear the input fields
    document.getElementById('name').value = '';
    document.getElementById('status').value = '';
    document.getElementById('category').value = '';
    document.getElementById('dueDate').value = '';
}

// Event listener for the "Add To-Do" button
document.getElementById('addTodoBtn').addEventListener('click', handleTodoAction);

// Event listener for the Enter key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleTodoAction();
    }
});

// Clear all todos
function clearAllTodos() {
    todos = []; // Reset the todos array
    showEditMenu(); // Refresh the edit menu display
}

// Event listener for the "Clear All To-Dos" button
document.getElementById('clearTodosBtn').addEventListener('click', clearAllTodos);

// Function to remove completed todos
function removeCompletedTodos() {
    todos = todos.filter(todo => todo.status !== "complete"); // Keep todos that are not complete
    showEditMenu(); // Refresh the display after removal
}

// Add an event listener for the remove completed button
document.getElementById('removeCompletedBtn').addEventListener('click', removeCompletedTodos);

// Initial setup for event listeners for the edit menu and display buttons
document.getElementById('editMenuBtn').addEventListener('click', showEditMenu);
document.getElementById('displayTodosBtn').addEventListener('click', showEditMenu);
  
