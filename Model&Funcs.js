let todos = [];
let currentEditId = null;
let categories = {
    'Work': 'red',
    'Home': 'blue',
    'Other': 'green'
};

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

// Function to add a new category
function addNewCategory(name, color) {
    if (!name || !color) {
        alert('Please enter both a category name and color.');
        return;
    }
    
    // Add the new category to the categories object
    categories[name] = color;

    // Update the category dropdown to include the new category
    const categoryDropdown = document.getElementById('category');
    const newOption = document.createElement('option');
    newOption.value = name;
    newOption.text = name;
    categoryDropdown.appendChild(newOption);

    // Clear the input fields after adding the new category
    document.getElementById('newCategoryName').value = '';
    document.getElementById('newCategoryColor').value = '#ff0000'; // Reset color picker to default
}

// Function to get the color for each category
function getCategoryColor(category) {
    return categories[category] || 'grey'; // Default to grey if category is not found
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
        const categoryColor = getCategoryColor(recentTodo.category);
        
        todoItem.innerHTML = `
            <strong>ID:</strong> ${recentTodo.id} <br>
            <strong>Name:</strong> ${recentTodo.name} <br>
            <strong>Status:</strong> ${recentTodo.status} <br>
            <strong>Category:</strong> ${recentTodo.category} 
            <span style="background-color: ${categoryColor}; width: 15px; height: 15px; display: inline-block; margin-left: 10px;"></span> <br>
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
                const categoryColor = getCategoryColor(todo.category);

                todoItem.innerHTML = `
                    <strong>ID:</strong> ${todo.id} <br>
                    <strong>Name:</strong> ${todo.name} <br>
                    <strong>Status:</strong> ${todo.status} <br>
                    <strong>Category:</strong> ${todo.category} 
                    <span style="background-color: ${categoryColor}; width: 15px; height: 15px; display: inline-block; margin-left: 10px;"></span> <br>
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

// Function to display and handle the edit menu visibility
let isEditMenuVisible = false; // Track if the edit menu is visible

function showEditMenu() {
    const todoList = document.getElementById('todoList');
    const recentTodoContainer = document.getElementById('recentTodo'); // Clear recent todo

    if (isEditMenuVisible) {
        todoList.innerHTML = ''; // Clear the todoList to hide the menu
        recentTodoContainer.innerHTML = ''; // Clear recent to-do to hide it
        isEditMenuVisible = false; // Set the flag to indicate the menu is hidden
    } else {
        todoList.innerHTML = ''; // Clear previous content to start fresh
        recentTodoContainer.innerHTML = ''; // Hide the recent todo when showing the edit menu

        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');
            const categoryColor = getCategoryColor(todo.category);

            todoItem.innerHTML = `
                <span style="background-color: ${categoryColor}; width: 15px; height: 15px; display: inline-block; margin-left: 10px;"></span>
                <strong>ID:</strong> ${todo.id}, <strong>Task:</strong> ${todo.name}, <strong>Status:</strong> ${todo.status}
                <button onclick="editTodo(${todo.id})">Edit</button>
                <button onclick="deleteTodo(${todo.id})" style="margin-top: 5px;">Delete</button>
            `;

            todoList.appendChild(todoItem);
        });

        isEditMenuVisible = true;
    }
}

// Edit a todo (with option to edit category name and color)
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
            const categoryColor = getCategoryColor(todo.category); // Get current category color
            const categoryName = todo.category; // Get current category name

            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id} 
                <input type="text" id="editName${todo.id}" value="${todo.name}" />
                <select id="editStatus${todo.id}">
                    <option value="Not Complete" ${todo.status === 'Not Complete' ? 'selected' : ''}>Not Complete</option>
                    <option value="complete" ${todo.status === 'complete' ? 'selected' : ''}>Complete</option>
                    <option value="Other" ${todo.status === 'Other' ? 'selected' : ''}>Other</option>
                </select>
                <!-- Input for editing category name -->
                <input type="text" id="editCategoryName${todo.id}" value="${categoryName}" placeholder="Edit Category Name" />
                <!-- Color Picker for Category (matching design from Add Category) -->
                <p>Pick a color for the category</p>
                <div class="color-picker">
                    <button class="color-btn" data-color="#ff0000" style="background-color: #ff0000;"></button>
                    <button class="color-btn" data-color="#00ff00" style="background-color: #00ff00;"></button>
                    <button class="color-btn" data-color="#0000ff" style="background-color: #0000ff;"></button>
                    <button class="color-btn" data-color="#ffff00" style="background-color: #ffff00;"></button>
                    <button class="color-btn" data-color="#800080" style="background-color: #800080;"></button>
                    <button class="color-btn" data-color="#00ffff" style="background-color: #00ffff;"></button>
                    <button class="color-btn" data-color="#ff00ff" style="background-color: #ff00ff;"></button>
                    <button class="color-btn" data-color="#008080" style="background-color: #008080;"></button>
                    <button class="color-btn" data-color="#ffffff" style="background-color: #ffffff; border: 1px solid #ddd;"></button>
                </div>
                <input type="date" id="editDueDate${todo.id}" value="${todo.dueDate}" />
                <button onclick="saveEdit(${todo.id})">Save</button>
                <button onclick="cancelEdit()">Cancel</button>
            `;
        } else {
            const categoryColor = getCategoryColor(todo.category);

            todoItem.innerHTML = `
                <strong>ID:</strong> ${todo.id} <br>
                <strong>Name:</strong> ${todo.name} <br>
                <strong>Status:</strong> ${todo.status} <br>
                <strong>Category:</strong> ${todo.category} 
                <span style="background-color: ${categoryColor}; width: 15px; height: 15px; display: inline-block; margin-left: 10px;"></span> <br>
                <strong>Due Date:</strong> ${todo.dueDate}
            `;
        }

        todoList.appendChild(todoItem);
    });

    // Handle color selection for the edit menu
    document.querySelectorAll('.color-picker .color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove the 'selected' class from all color buttons
            document.querySelectorAll('.color-picker .color-btn').forEach(b => b.classList.remove('selected'));
            // Add the 'selected' class to the clicked button
            this.classList.add('selected');
        });
    });
}

// Save the edited todo, including category name and its updated color
function saveEdit(id) {
    const name = document.getElementById(`editName${id}`).value;
    const status = document.getElementById(`editStatus${id}`).value;
    const newCategoryName = document.getElementById(`editCategoryName${id}`).value; // New category name input

    // Get the selected color from the color buttons
    const selectedColorButton = document.querySelector('.color-picker .color-btn.selected');
    const categoryColor = selectedColorButton ? selectedColorButton.getAttribute('data-color') : null;

    if (!newCategoryName || !categoryColor) {
        alert("Please provide a valid category name and select a color.");
        return;
    }

    const dueDate = document.getElementById(`editDueDate${id}`).value;

    // Update the todo with new values
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.name = name;
        todo.status = status;
        todo.dueDate = dueDate;
        todo.category = newCategoryName; // Update the category name
        categories[newCategoryName] = categoryColor; // Update the category color
    }

    currentEditId = null; // Reset the current edit ID
    showEditMenu(); // Refresh the edit menu to show all tasks again
}

// Cancel editing a todo
function cancelEdit() {
    currentEditId = null; // Reset the current edit ID
    showEditMenu(); // Refresh the edit menu to revert back to display mode
}

// Handle color selection for the edit menu
document.querySelectorAll('.color-picker .color-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove the 'selected' class from all color buttons
        document.querySelectorAll('.color-picker .color-btn').forEach(b => b.classList.remove('selected'));
        // Add the 'selected' class to the clicked button
        this.classList.add('selected');
    });
});

