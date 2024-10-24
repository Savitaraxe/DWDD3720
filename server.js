const express = require('express');
const cors = require('cors'); // Import CORS middleware
const app = express();
const port = 3001;

// Enable CORS for all requests (allows your front-end running on localhost:3000 to communicate with your API)
app.use(cors());

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// In-memory data storage
let todos = []; // Array to store todos
let categories = { // Predefined categories with associated colors
    'Work': 'red',
    'Home': 'blue',
    'Other': 'green'
};

// Helper function to generate the next To-Do ID
function getNextTodoId() {
    return todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) + 1 : 1;
}

// === TODOS Endpoints ===

// GET ALL TODOS
app.get('/todos', (req, res) => {
    res.json(todos); // Return the full list of todos as JSON
});

// POST TODO (create a new todo)
app.post('/todos', (req, res) => {
    const { name, status, category, dueDate, color } = req.body;

    // Validate required fields
    if (!name || !category || !dueDate) {
        return res.status(400).json({ message: 'Missing required fields: name, category, or due date' });
    }

    // Check if the color is provided in the request body
    if (!color) {
        return res.status(400).json({ message: 'Color is required' });
    }

    // Create a new To-Do
    const newTodo = {
        id: getNextTodoId(),
        name,
        status: status || 'Not Complete', // Default status if not provided
        category,
        dueDate,
        color // Use the color from the request body
    };

    todos.push(newTodo); // Add the new To-Do to the in-memory list
    res.status(201).json(newTodo); // Return the newly created To-Do as JSON
});

// PUT TODO (update a todo by ID)
app.put('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
    }

    // Debugging log to check color being passed
    console.log("Received color in PUT request:", req.body.color);

    // Update the To-Do with the provided values or keep the existing ones
    todo.name = req.body.name || todo.name;
    todo.status = req.body.status || todo.status;
    todo.category = req.body.category || todo.category;
    todo.dueDate = req.body.dueDate || todo.dueDate;
    todo.color = req.body.color;  // Ensure color is updated and required

    res.json(todo); // Return the updated To-Do as JSON
});




// DELETE TODO (delete a todo by ID)
app.delete('/todos/:id', (req, res) => {
    const todoId = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== todoId); // Remove the To-Do from the list
    res.json({ message: 'Todo deleted successfully' }); // Return success message
});

// GET ALL TODOS FOR A SPECIFIC CATEGORY
app.get('/todos/category/:category', (req, res) => {
    const category = req.params.category;
    const filteredTodos = todos.filter(t => t.category === category); // Filter todos by category
    res.json(filteredTodos); // Return filtered todos as JSON
});

// === CATEGORIES Endpoints ===

// GET ALL CATEGORIES
app.get('/categories', (req, res) => {
    res.json(categories); // Return all categories and their colors as JSON
});

// POST CATEGORY (create a new category)
app.post('/categories', (req, res) => {
    const { name, color } = req.body;

    // Validate required fields
    if (!name || !color) {
        return res.status(400).json({ message: 'Category name and color are required' });
    }

    // Add the new category to the in-memory list
    categories[name] = color;
    res.status(201).json({ name, color }); // Return the newly created category as JSON
});

// PUT CATEGORY (update a category's color)
app.put('/categories/:name', (req, res) => {
    const categoryName = req.params.name;

    if (!categories[categoryName]) {
        return res.status(404).json({ message: 'Category not found' });
    }

    // Update the category color
    categories[categoryName] = req.body.color || categories[categoryName];
    res.json({ name: categoryName, color: categories[categoryName] }); // Return the updated category as JSON
});

// DELETE CATEGORY (delete a category by name)
app.delete('/categories/:name', (req, res) => {
    const categoryName = req.params.name;

    if (!categories[categoryName]) {
        return res.status(404).json({ message: 'Category not found' });
    }

    // Delete the category from the list
    delete categories[categoryName];
    res.json({ message: `Category '${categoryName}' deleted successfully` }); // Return success message
});

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
