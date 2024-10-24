let todos = [];
let currentEditId = null;
let categories = {};

// Function to fetch categories from the backend and update the local categories object
function fetchCategories() {
    fetch('http://localhost:3001/categories')
        .then(response => response.json())
        .then(data => {
            categories = {}; // Clear the local categories object
            
            data.forEach(category => {
                categories[category.name] = category.color; // Store both the name and the color
            });

            updateCategoryDropdown(); // Update the dropdown after fetching categories
        })
        .catch(error => console.error('Error fetching categories:', error));
}


// Call fetchCategories on page load
window.onload = function() {
    fetchCategories(); // Fetch categories when the page loads
};

// Function to add a new todo
function addTodo(name, status, category, dueDate) {
    const newTodo = {
        id: todos.length + 1, // Temporary ID
        name,
        status,
        category,
        dueDate
    };

    // Post the new todo to the backend server
    fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo) // Send new todo as JSON
    })
    .then(response => response.json())
    .then(savedTodo => {
        // Update the todos array with the server's saved todo (including a real ID)
        todos.push(savedTodo);
        displayRecentTodo(); // Automatically show the most recent todo on the front-end
    })
    .catch(error => console.error('Error adding todo:', error));
}


// Function to add a new category
function addNewCategory(name, color) {
    if (!name || !color) {
        alert('Please enter both a category name and color.');
        return;
    }

    // Create new category data
    const newCategory = { name, color };

    // Post the new category to the backend server
    fetch('http://localhost:3001/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory) // Send new category as JSON
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add category to the server');
        }
        return response.json();
    })
    .then(savedCategory => {
        // Add the new category to the local categories object
        categories[savedCategory.name] = savedCategory.color;

        // Update the category dropdown to include the new category
        const categoryDropdown = document.getElementById('category');
        const newOption = document.createElement('option');
        newOption.value = savedCategory.name;
        newOption.text = savedCategory.name;
        categoryDropdown.appendChild(newOption);

        // Clear the input fields after adding the new category
        document.getElementById('newCategoryName').value = '';
        document.getElementById('newCategoryColor').value = '#ff0000'; // Reset color picker to default

        // Auto-hide the new category name dropdown
        document.getElementById('newCategoryDropdown').style.display = 'none';
    })
    .catch(error => console.error('Error adding category:', error));
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
let extraClickPerformed = false; // Flag to track if the extra click has already been performed

function displayAllTodos() {
    const todoListContainer = document.getElementById('todoList');
    const recentTodoContainer = document.getElementById('recentTodo');

    if (isTodosVisible) {
        // If todos are visible, hide them and reset the visibility flag
        todoListContainer.innerHTML = ''; // Clear the list to hide todos
        isTodosVisible = false;
    } else {
        // If todos are not visible, fetch them from the server
        fetch('http://localhost:3001/todos')
            .then(response => response.json()) // Parse the JSON response from the server
            .then(data => {
                todos = data; // Update the todos array with the fetched data

                // Clear previous content
                todoListContainer.innerHTML = '';  
                recentTodoContainer.innerHTML = ''; // Hide the recent todo since we're displaying all

                // If there are todos, display them
                if (todos.length > 0) {
                    todos.forEach(todo => {
                        const todoItem = document.createElement('div');
                        todoItem.classList.add('todo-item');
                        const categoryColor = getCategoryColor(todo.category);

                        // Create the HTML structure for each todo item
                        todoItem.innerHTML = `
                            <strong>ID:</strong> ${todo.id} <br>
                            <strong>Name:</strong> ${todo.name} <br>
                            <strong>Status:</strong> ${todo.status} <br>
                            <strong>Category:</strong> ${todo.category} 
                            <span style="background-color: ${categoryColor}; width: 15px; height: 15px; display: inline-block; margin-left: 10px;"></span> <br>
                            <strong>Due Date:</strong> ${todo.dueDate}
                        `;
                        todoListContainer.appendChild(todoItem); // Append the todo item to the container
                    });
                } else {
                    // Display a message if there are no todos
                    const noTodosMessage = document.createElement('div');
                    noTodosMessage.textContent = 'No todos to display.';
                    todoListContainer.appendChild(noTodosMessage);
                }

                isTodosVisible = true; // Set the flag to true indicating todos are now visible
            })
            .catch(error => console.error('Error fetching todos:', error)); // Handle any errors during fetch
    }

    // Simulate an extra click only once, to ensure visibility update
    if (!isTodosVisible && !extraClickPerformed) {
        extraClickPerformed = true; // Set flag indicating the extra click was performed

        setTimeout(() => {
            // Automatically simulate a second click to ensure proper visibility
            displayAllTodos();
        }, 50); // Short delay to allow UI to update
    }
}

// Remove completed todos
function removeCompletedTodos() {
    todos = todos.filter(todo => todo.status !== "complete"); // Keep todos that are not complete

    // Send a PUT request to the backend to update the todos after removing completed ones
    fetch('http://localhost:3001/todos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todos) // Send the updated todos array to the server
    })
    .then(() => {
        displayRecentTodo(); // Refresh the display after removal
    })
    .catch(error => console.error('Error removing completed todos:', error));
}


// Delete a todo
function deleteTodo(id) {
    // Send a DELETE request to the backend to delete the specific todo
    fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        todos = todos.filter(todo => todo.id !== id); // Remove the todo from the local todos array
        displayRecentTodo(); // Refresh the display after deletion
    })
    .catch(error => console.error('Error deleting todo:', error));
}


// Clear all todos
function clearAllTodos() {
    // Send a DELETE request to the backend to clear all todos
    fetch('http://localhost:3001/todos', {
        method: 'DELETE'
    })
    .then(() => {
        todos = []; // Clear the local todos array
        document.getElementById('todoList').innerHTML = '';
        document.getElementById('recentTodo').innerHTML = '';
    })
    .catch(error => console.error('Error clearing todos:', error));
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
                <br></br>
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
    const dueDate = document.getElementById(`editDueDate${id}`).value;

    // Get the selected color from the color buttons
    const selectedColorButton = document.querySelector('.color-picker .color-btn.selected');
    const categoryColor = selectedColorButton ? selectedColorButton.getAttribute('data-color') : null;

    if (!newCategoryName || !categoryColor) {
        alert("Please provide a valid category name and select a color.");
        return;
    }

    const todo = todos.find(t => t.id === id);
    if (todo) {
        // Update the todo locally with the new values
        todo.name = name;
        todo.status = status;
        todo.category = newCategoryName;
        todo.dueDate = dueDate;

        // Update the category color in the categories object
        categories[newCategoryName] = categoryColor; // This will update the color for the new category

        // Include the category color in the todo object
        todo.categoryColor = categoryColor;

        // Send the updated todo to the backend
        fetch(`http://localhost:3001/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
        .then(response => response.json())
        .then(updatedTodo => {
            console.log('Updated todo:', updatedTodo);
            currentEditId = null; // Reset the current edit ID
            showEditMenu(); // Refresh the edit menu to show all tasks again
        })
        .catch(error => console.error('Error updating todo:', error));
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

// Fetch Todos from the server
function fetchTodos() {
    fetch('http://localhost:3001/todos') // Make a GET request to the backend server
        .then(response => response.json()) // Parse the JSON from the response
        .then(data => {
            todos = data; // Update the todos array with the fetched data
            displayAllTodos(); // Display all the fetched todos
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// Fetch Todos by Category
function fetchTodosByCategory(category) {
    fetch(`http://localhost:3001/todos/category/${category}`)
        .then(response => response.json())
        .then(data => {
            todos = data; // Update the local todos array with the fetched data
            displayAllTodos(); // Display the filtered todos
        })
        .catch(error => console.error('Error fetching todos by category:', error));
}


// Toggle category filter dropdown visibility
document.getElementById('showCategoryFilterBtn').addEventListener('click', function() {
    const categoryFilterDropdown = document.getElementById('categoryFilterDropdown');
    categoryFilterDropdown.style.display = (categoryFilterDropdown.style.display === 'block') ? 'none' : 'block';

    // Populate the filter dropdown with available categories
    const filterCategoryDropdown = document.getElementById('filterCategory');
    filterCategoryDropdown.innerHTML = '<option value="">Select Category</option>'; // Reset dropdown options
    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        filterCategoryDropdown.appendChild(option);
    });
});

// Filter todos by selected category
document.getElementById('filterTodosBtn').addEventListener('click', function() {
    const selectedCategory = document.getElementById('filterCategory').value;

    // If no category is selected, display an alert and return
    if (!selectedCategory) {
        alert('Please select a category to filter by.');
        return;
    }

    // Call the function to fetch todos by category from the server
    fetchTodosByCategory(selectedCategory);
});

// Fetch Todos by Category (with display logic)
function fetchTodosByCategory(category) {
    fetch(`http://localhost:3001/todos/category/${category}`)
        .then(response => response.json())
        .then(data => {
            const todoListContainer = document.getElementById('todoList');
            todoListContainer.innerHTML = ''; // Clear the current list
            todos = data; // Update the local todos array with the fetched data

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
                    todoListContainer.appendChild(todoItem);
                });
            } else {
                const noTodosMessage = document.createElement('div');
                noTodosMessage.textContent = 'No todos to display for this category.';
                todoListContainer.appendChild(noTodosMessage);
            }
        })
        .catch(error => console.error('Error fetching todos by category:', error));
}


// Hide category filter dropdown when "Hide" button is clicked
document.getElementById('hideFilterBtn').addEventListener('click', function() {
    const categoryFilterDropdown = document.getElementById('categoryFilterDropdown');
    categoryFilterDropdown.style.display = 'none'; // Hide the dropdown
});


// Function to toggle category deletion dropdown visibility
document.getElementById('showDeleteCategoriesBtn').addEventListener('click', function() {
    const deleteCategoriesDropdown = document.getElementById('deleteCategoriesDropdown');
    deleteCategoriesDropdown.style.display = (deleteCategoriesDropdown.style.display === 'block') ? 'none' : 'block';

    // Populate the dropdown with available categories, delete buttons, and edit buttons
    deleteCategoriesDropdown.innerHTML = ''; // Clear previous content
    Object.keys(categories).forEach(category => {
        const categoryItem = document.createElement('div');
        categoryItem.classList.add('category-item');
        
        // Create edit button and delete button for each category
        categoryItem.innerHTML = `
            <span>${category}</span>
            <button onclick="deleteCategory('${category}')">Delete</button>
            <button onclick="showEditCategoryDropdown('${category}')">Edit</button> <!-- New edit button -->
            <div id="editCategoryDropdown-${category}" class="edit-dropdown" style="display: none;">
                <input type="text" id="newCategoryName-${category}" placeholder="New category name" />
                <button onclick="saveCategoryEdit('${category}')">Save</button>
            </div>
        `;
        deleteCategoriesDropdown.appendChild(categoryItem);
    });
});

// Function to show/hide the edit dropdown for a category
function showEditCategoryDropdown(category) {
    const dropdown = document.getElementById(`editCategoryDropdown-${category}`);

    if (dropdown.style.display === 'none') {
        dropdown.style.display = 'block'; // Show the dropdown
    } else {
        dropdown.style.display = 'none'; // Hide the dropdown
    }
}


// Function to delete a category and remove all traces of it in the dropdown
function deleteCategory(categoryName) {
    // Send DELETE request to the server to delete the category
    fetch(`http://localhost:3001/categories/${categoryName}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete category from server');
        }

        // Remove the category from the local categories object
        delete categories[categoryName]; // Delete category locally after successful server delete

        // Update all todos that had the deleted category to show "*" as the category and grey as the color
        todos.forEach(todo => {
            if (todo.category === categoryName) {
                todo.category = '*'; // Replace category name with "*"
                todo.categoryColor = 'grey'; // Set fallback color to grey
            }
        });

        // Send updated todos to the server to persist the changes
        return fetch('http://localhost:3001/todos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(todos), // Send the updated todos array to the server
        });
    })
    .then(() => {
        // Refresh the category dropdowns and display
        updateCategoryDropdown(); // This will update the dropdown and remove the deleted category
        displayAllTodos(); // Show updated todos with "*" and grey for deleted categories
    })
    .catch(error => console.error('Error deleting category or updating todos:', error));
}


//THIS REMOVES THE BUTTON TO REMOVE THE CATEGORY IN THE REMOVE CATEGORY DROPDOWN

// Function to refresh the category dropdown (removes deleted categories)
function updateCategoryDropdown() {
    const categoryDropdown = document.getElementById('category'); // The category dropdown
    categoryDropdown.innerHTML = '<option value="">Select Category</option>'; // Reset dropdown

    // Re-add only the categories that still exist
    Object.keys(categories).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.text = category;
        categoryDropdown.appendChild(option);
    });
    
    // Update the category dropdown in the edit menu (if any)
    const editCategoryDropdowns = document.querySelectorAll('[id^=editCategoryName]');
    editCategoryDropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Select Category</option>';
        Object.keys(categories).forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.text = category;
            dropdown.appendChild(option);
        });
    });

    // Hide the dropdown after deletion and update the display
    document.getElementById('deleteCategoriesDropdown').style.display = 'none';
    displayAllTodos(); // Show updated todos with blank categories
}

// Function to save the edited category name
function saveCategoryEdit(oldCategoryName) {
    const newCategoryName = document.getElementById(`newCategoryName-${oldCategoryName}`).value;

    if (!newCategoryName) {
        alert('Please enter a valid category name.');
        return;
    }

    // Check if the new category name already exists
    if (categories[newCategoryName]) {
        alert('This category name already exists.');
        return;
    }

    // Update the category in the categories object
    categories[newCategoryName] = categories[oldCategoryName];
    delete categories[oldCategoryName];

    // Update all todos that had the old category to use the new category name
    todos.forEach(todo => {
        if (todo.category === oldCategoryName) {
            todo.category = newCategoryName;
        }
    });

    // Send updated todos to the server to persist the changes
    fetch('http://localhost:3001/todos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(todos), // Send the updated todos array to the server
    })
    .then(() => {
        // Refresh the category dropdowns and todo display
        updateCategoryDropdown();
        displayAllTodos();
    })
    .catch(error => console.error('Error updating todos:', error));
}


