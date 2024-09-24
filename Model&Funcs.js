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
    todoList.innerHTML = ''; // Clear current list
    
    todos.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.classList.add('todo-item', todo.status);
        
        if (currentEditId === todo.id) {
            // Editable task menu with the same "status" styling
            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id} 
                <input type="text" id="editName${todo.id}" value="${todo.name}" />
                <select id="editStatus${todo.id}" class="status-dropdown">
                    <option value="active" ${todo.status === 'active' ? 'selected' : ''}>Active</option>
                    <option value="inactive" ${todo.status === 'inactive' ? 'selected' : ''}>Inactive</option>
                    <option value="complete" ${todo.status === 'complete' ? 'selected' : ''}>Complete</option>
                </select>
                <input type="text" id="editCategory${todo.id}" value="${todo.category}" />
                <input type="date" id="editDueDate${todo.id}" value="${todo.dueDate}" />
                <button onclick="saveEdit(${todo.id})">Save</button>
                <button onclick="cancelEdit()">Cancel</button>
            `;
        } else {
            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id}, <strong>Task:</strong> ${todo.name}, <strong>Status:</strong> ${todo.status}
                <button onclick="editTodo(${todo.id})">Edit</button>
                <div class="icon-container">
                    <img src="trash.png" alt="Delete" style="width: 40px; height: 40px; cursor: pointer;" onclick="deleteTodo(${todo.id})">
                </div>
            `;
        }
        
        todoList.appendChild(todoItem);
    });
}

// Edit a todo
function editTodo(id) {
    currentEditId = id; // Set the current edit ID
    showEditMenu(); // Refresh the edit menu to show input fields for editing
}

// Save the edited todo
function saveEdit(id) {
    const name = document.getElementById(`editName${id}`).value;
    const status = document.getElementById(`editStatus${id}`).value; // Get the value from the dropdown
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
    showEditMenu(); // Refresh the edit menu to show the updated task
}

// Cancel editing a todo
function cancelEdit() {
    currentEditId = null; // Reset the current edit ID
    showEditMenu(); // Refresh the edit menu to revert back to display mode
}

// Handle adding or saving todo
function handleTodoAction() {
    const name = document.getElementById('name').value;
    const status = document.getElementById('status').value;
    const category = document.getElementById('category').value;
    const dueDate = document.getElementById('dueDate').value;

    if (name && status && category && dueDate) {
        addTodo(name, status, category, dueDate);
    }

    // Clear the input fields
    document.getElementById('name').value = '';
    document.getElementById('status').value = '';
    document.getElementById('category').value = '';
    document.getElementById('dueDate').value = '';

    showEditMenu(); // Refresh the menu to show the new task
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    showEditMenu(); // Refresh the edit menu display
}

// Function to remove completed todos
function removeCompletedTodos() {
    todos = todos.filter(todo => todo.status !== "complete"); // Keep todos that are not complete
    showEditMenu(); // Refresh the display after removal
}

// Add an event listener for the remove completed button
document.getElementById('removeCompletedBtn').addEventListener('click', removeCompletedTodos);

// Clear all todos
function clearAllTodos() {
    todos = []; // Reset the todos array (completely empty it)
    showEditMenu(); // Refresh the edit menu display
}

// Add an event listener for the "Clear All To-Dos" button
document.getElementById('clearTodosBtn').addEventListener('click', clearAllTodos);

// Initial setup for event listeners for the edit menu and display buttons
document.getElementById('editMenuBtn').addEventListener('click', showEditMenu);
document.getElementById('displayTodosBtn').addEventListener('click', showEditMenu);
