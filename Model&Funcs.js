let currentEditId = null;
let categories = {
    'Work': 'red',
    'Home': 'blue',
    'Other': 'green'
};

// Fetch categories from server
function fetchCategories() {
    fetch('http://localhost:3001/categories') // Update to 3002 if server port changed
        .then(response => response.json())
        .then(data => {
            categories = data;
            updateCategoryDropdown();
        })
        .catch(error => console.error('Error fetching categories:', error));
}

// Function to add a new todo (POST to server)
function addTodo(name, status, category, dueDate) {
    // Fetch the color for the selected category from the categories object
    const color = categories[category]; // Get the color of the selected category

    // Check if the category and color exist before proceeding
    if (!color) {
        alert('Please select a valid category with a color.');
        return;
    }

    // Make the POST request to add the new To-Do
    fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            status,
            category,
            dueDate,
            color // Send the category's color along with the request
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Todo created:', data);
        displayAllTodos(); // Refresh the todo list after adding
    })
    .catch(error => console.error('Error creating todo:', error));

    // Clear input fields after adding the todo
    document.getElementById('name').value = '';
    document.getElementById('status').value = '';
    document.getElementById('category').value = '';
    document.getElementById('dueDate').value = '';
}



// Function to add a new category (POST to server)
function addNewCategory(name, color) {
    if (!name || !color) {
        alert('Please enter both a category name and color.');
        return;
    }

    // Update the categories object with the new category and its color
    categories[name] = color;

    // Send the new category to the server
    fetch('http://localhost:3001/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Category added:', data);
        fetchCategories(); // Refresh the category dropdown after adding
    })
    .catch(error => console.error('Error adding category:', error));

    // Clear the input fields after adding the new category
    document.getElementById('newCategoryName').value = '';
}


// Function to get the color for each category
function getCategoryColor(category) {
    if (!categories[category]) {
        console.warn(`Category ${category} not found. Returning default color.`);
        return 'grey'; // Or handle this case differently
    }
    return categories[category];
}

// Function to update the category dropdown with fetched categories
function updateCategoryDropdown() {
    const categoryDropdown = document.getElementById('category');
    categoryDropdown.innerHTML = '<option value="">Select Category</option>'; // Reset options

    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryDropdown.appendChild(option);
    });
}

// Function to display the most recent todo (GET from server)
function displayRecentTodo() {
    const recentTodoContainer = document.getElementById('recentTodo');
    const todoListContainer = document.getElementById('todoList');

    recentTodoContainer.innerHTML = ''; // Clear previous content
    todoListContainer.innerHTML = '';   // Hide all other todos

    // Fetch all todos and display the most recent
    fetch('http://localhost:3001/todos') // Update to 3002 if server port changed
    .then(response => response.json())
    .then(todos => {
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
    })
    .catch(error => console.error('Error fetching recent todo:', error));
}

// Function to display all todos (GET from server)
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

        fetch('http://localhost:3001/todos') // Update to 3002 if server port changed
        .then(response => response.json())
        .then(todos => {
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
        })
        .catch(error => console.error('Error fetching todos:', error));

        isTodosVisible = true;
    }
}

// Function to remove completed todos (loop and delete from server)
function removeCompletedTodos() {
    fetch('http://localhost:3001/todos') // Update to 3002 if server port changed
    .then(response => response.json())
    .then(todos => {
        todos.forEach(todo => {
            if (todo.status.toLowerCase() === 'complete') { // Ensure case-insensitive match
                deleteTodo(todo.id);
            }
        });
        displayRecentTodo(); // Refresh the display after removal
    })
    .catch(error => console.error('Error fetching todos for removal:', error));
}

// Delete a todo (DELETE from server)
function deleteTodo(id) {
    fetch(`http://localhost:3001/todos/${id}`, { // Update to 3002 if server port changed
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message); // Log the success message
        displayRecentTodo(); // Refresh to show only the most recent todo
    })
    .catch(error => console.error('Error deleting todo:', error));
}

// Clear all todos (use remove function for all todos)
function clearAllTodos() {
    fetch('http://localhost:3001/todos') // Update to 3002 if server port changed
    .then(response => response.json())
    .then(todos => {
        todos.forEach(todo => deleteTodo(todo.id)); // Clear each todo
        document.getElementById('todoList').innerHTML = '';
        document.getElementById('recentTodo').innerHTML = '';
    })
    .catch(error => console.error('Error clearing todos:', error));
}

// Function to display and handle the edit menu visibility (fetch from server)
let isEditMenuVisible = false; // Track if the edit menu is visible

function showEditMenu() {
    const todoList = document.getElementById('todoList');
    const recentTodoContainer = document.getElementById('recentTodo'); // Clear recent todo

    if (isEditMenuVisible) {
        todoList.innerHTML = ''; // Hide the menu
        isEditMenuVisible = false;
    } else {
        todoList.innerHTML = ''; // Clear previous content to start fresh
        recentTodoContainer.innerHTML = ''; // Hide the recent todo when showing the edit menu

        fetch('http://localhost:3001/todos') // Update to 3002 if server port changed
        .then(response => response.json())
        .then(todos => {
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
        })
        .catch(error => console.error('Error fetching todos for edit menu:', error));
    }
}

let selectedEditColor = null; // Global variable to store selected color for editing

function editTodo(id) {
    currentEditId = id; // Set the current edit ID
    const todoList = document.getElementById('todoList');

    // Clear the todoList first to show the editable todo
    todoList.innerHTML = '';

    fetch(`http://localhost:3001/todos`)
    .then(response => response.json())
    .then(todos => {
        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.classList.add('todo-item');

            if (currentEditId === todo.id) {
                // Fetch the saved categories to include in the edit menu
                fetchCategories(); // Ensure categories are up-to-date

                todoItem.innerHTML = `
                    <strong>ID:</strong> ${todo.id} 
                    <input type="text" id="editName${todo.id}" value="${todo.name}" />
                    <select id="editStatus${todo.id}">
                        <option value="Not Complete" ${todo.status === 'Not Complete' ? 'selected' : ''}>Not Complete</option>
                        <option value="complete" ${todo.status === 'complete' ? 'selected' : ''}>Complete</option>
                        <option value="Other" ${todo.status === 'Other' ? 'selected' : ''}>Other</option>
                    </select>
                    <!-- Category Dropdown for Edit -->
                    <input type="text" id="editCategoryName${todo.id}" value="${todo.category}" placeholder="Edit Category Name" />
                    <!-- Color Picker for Edit Category -->
                    <p>Pick a new color for the category</p>
                    <div class="color-picker">
                        ${Object.keys(categories).map(category => {
                            const color = categories[category];
                            return `<button class="color-btn" data-color="${color}" style="background-color: ${color};"></button>`;
                        }).join('')}
                    </div>
                    <input type="date" id="editDueDate${todo.id}" value="${todo.dueDate}" />
                    <button onclick="saveEdit(${todo.id})">Save</button>
                    <button onclick="cancelEdit()">Cancel</button>
                `;

                // Add event listeners for color buttons in edit mode
                const colorButtons = todoItem.querySelectorAll('.color-btn');
                selectedEditColor = null; // Reset color selection when editing

                colorButtons.forEach(btn => {
                    btn.addEventListener('click', function() {
                        // Update selected color for editing
                        selectedEditColor = this.getAttribute('data-color');
                        
                        // Remove any previously selected outlines
                        colorButtons.forEach(b => b.style.outline = 'none');
                        
                        // Highlight the selected button (add black border)
                        this.style.outline = '2px solid #000';

                        console.log("Selected color:", selectedEditColor); // Debugging log to check color
                    });
                });

                todoList.appendChild(todoItem);
            }
        });
    })
    .catch(error => console.error('Error fetching todo for edit:', error));
}



function saveEdit(id) {
    const name = document.getElementById(`editName${id}`).value;
    const status = document.getElementById(`editStatus${id}`).value;
    const newCategoryName = document.getElementById(`editCategoryName${id}`).value;

    // Ensure a valid color is selected
    if (!newCategoryName || !selectedEditColor) {
        alert("Please provide a valid category name and select a color.");
        return;
    }

    const dueDate = document.getElementById(`editDueDate${id}`).value;

    // Debugging log to ensure selectedEditColor is set
    console.log("Saving with selected color:", selectedEditColor);

    // Send the updated To-Do data back to the server with a PUT request
    fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            status,
            category: newCategoryName,
            dueDate,
            color: selectedEditColor // Pass the selected color to the server
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Todo updated:', data);
        // Update the UI after saving
        displayAllTodos(); // Refresh the display after editing
    })
    .catch(error => console.error('Error updating todo:', error));

    currentEditId = null; // Reset the current edit ID
}

// Cancel editing a todo
function cancelEdit() {
    currentEditId = null; // Reset the current edit ID
    showEditMenu(); // Refresh the edit menu to revert back to display mode
}

// Initialize the app by fetching categories and displaying recent todo
fetchCategories();
displayRecentTodo();

// Function to update the category dropdown with fetched categories
function updateCategoryDropdown() {
    const categoryDropdown = document.getElementById('category');
    categoryDropdown.innerHTML = '<option value="">Select Category</option>'; // Reset options

    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryDropdown.appendChild(option);
    });
}
