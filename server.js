const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001; // Backend server on port 3001

app.use(cors()); // Enable CORS to allow communication from localhost:3000
app.use(express.json()); // Middleware to parse incoming JSON

// Sample To-Do data (mock database)
let todos = [];

// Sample Categories data (mock database)
let categories = {
    'Work': 'red',
    'Home': 'blue',
    'Other': 'green'
};

// GET TODOS - Retrieve all todos
app.get('/todos', (req, res) => {
    res.json(todos); // Send back the list of todos as JSON
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// POST TODO - Add a new todo
app.post('/todos', (req, res) => {
    const newTodo = req.body; // Get the new todo from the request body
    newTodo.id = todos.length + 1; // Assign a new ID to the todo
    todos.push(newTodo); // Add the new todo to the array

    res.status(201).json(newTodo); // Send back the newly added todo as a response
});

// DELETE ALL TODOS - Clear all todos
app.delete('/todos', (req, res) => {
    todos = []; // Clear the todos array
    res.status(204).send(); // No content response
});

// DELETE TODO BY ID - Delete a specific todo
app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id); // Get the ID from the request parameters
    todos = todos.filter(todo => todo.id !== todoId); // Remove the todo with the matching ID

    res.status(204).send(); // Send a "No Content" response to indicate successful deletion
});


// PUT TODOS - Update todos (e.g., after removing completed todos)
app.put('/todos', (req, res) => {
    todos = req.body; // Update the todos array with the new data from the client
    res.status(200).json(todos); // Send back the updated list of todos
});

// PUT TODO BY ID - Update a specific todo
app.put('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id); // Get the ID from the request parameters
    const updatedTodo = req.body; // Get the updated todo from the request body

    // Find the index of the todo to be updated
    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex !== -1) {
        todos[todoIndex] = updatedTodo; // Update the todo in the array
        res.json(updatedTodo); // Send back the updated todo
    } else {
        res.status(404).send('Todo not found'); // Send an error if the todo is not found
    }
});

app.get('/todos/category/:category', (req, res) => {
    const category = req.params.category;
    const todosInCategory = todos.filter(todo => todo.category === category);
    res.json(todosInCategory);
});

app.get('/categories', (req, res) => {
    const categoryList = Object.entries(categories).map(([name, color]) => ({ name, color }));
    res.json(categoryList); // Send an array of objects with name and color
});


app.post('/categories', (req, res) => {
    const { name, color } = req.body;
    if (!name || !color) {
        return res.status(400).send('Category name and color are required');
    }
    categories[name] = color;
    res.status(201).json({ name, color });
});

app.put('/categories/:name', (req, res) => {
    const oldName = req.params.name;
    const { newName, newColor } = req.body;
    if (categories[oldName]) {
        categories[newName] = newColor || categories[oldName];
        delete categories[oldName];
        res.json({ name: newName, color: newColor });
    } else {
        res.status(404).send('Category not found');
    }
});


app.delete('/categories/:name', (req, res) => {
    const name = req.params.name;
    if (categories[name]) {
        delete categories[name];
        res.status(204).send(); // Success with no content
    } else {
        res.status(404).send('Category not found');
    }
});





