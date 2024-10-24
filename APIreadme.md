# Here is all of my todo endpoints that are in my code

### GET /todos
- Retrieves all todos.
- Response: JSON array of todos.

### POST /todos
- Creates a new todo.
- Request Body: JSON object containing:
  - `name`: (string) Name of the todo.
  - `status`: (string) Status of the todo (e.g., "active", "complete").
  - `category`: (string) Category of the todo.
  - `dueDate`: (string) Due date of the todo.
- Response: JSON object of the created todo.

### PUT /todos/:id
- Updates an existing todo by ID.
- Request Body: JSON object containing updated fields (e.g., name, status, category, dueDate).
- Response: JSON object of the updated todo.

### DELETE /todos/:id
- Deletes a todo by ID.
- Response: Confirmation message or status.

### GET /todos/category/:category
- Retrieves all todos for a specific category.
- Response: JSON array of todos filtered by category.


## Categories Endpoints

### GET /categories
- Retrieves all categories.
- Response: JSON array of categories (with `name` and `color`).

### POST /categories
- Creates a new category.
- Request Body: JSON object containing:
  - `name`: (string) Name of the category.
  - `color`: (string) Color of the category (in hex code).
- Response: JSON object of the created category.

### PUT /categories/:name
- Updates an existing category by name.
- Request Body: JSON object containing:
  - `name`: (string) New name of the category.
  - `color`: (string) New color of the category (in hex code).
- Response: JSON object of the updated category.

### DELETE /categories/:name
- Deletes a category by name.
- Response: Confirmation message or status.
