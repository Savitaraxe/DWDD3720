// Here is my data model for the ToDo app

// THIS IS MY IN-MEMORY DATA MODEL
let todos = [ //I specified "todo(s) because I wanted to make this an array that we can access based on id"

    {
        id: 1, //This will hold the container for each ToDo project or Assignment, it's mean to help house each in a neat format
        name: "name of the task or todo",
        status: "status of the todo app", // "active", "complete" "inactive"
        category: "what type of category will this todo be labeled as", // "Work" "Home" "School" "hobby" "relaxing" etc
        dueDate: "what time variance do we want to include" // "MM/DD/YYYY" OR "MM/DD" OR "DD"
    },
    { //Example
        id: 2,
        name: "Finish project report",
        status: "active",
        category: "Work",
        dueDate: "2024-09-22"
    }
];

// Here is where my functions are that will be used to manipulate/add/remove from the data model

// THESE ARE MY FUNCTIONS

// THIS IS MY FIRST FUNCTION TO CREATE THE TODO

function addTodo(name, status, category, dueDate) {
    const newTodo = { //this was why I wanted to make the array labeled as "todos" so that my function itself can be labeled "todo"
        id: todos.length + 1,  // very easy way to add a new ID container to manipulate and create
        name: name, //We will make the functions themselves hold the same variables that the user sees, or adding a basic extension like "idType" or "nameType" 
        status: status,
        category: category,
        dueDate: dueDate
    };
    todos.push(newTodo);  // Allows us to easily append a new object to the array based on our function names
    return newTodo;  // Return it so we can validate it's creation
}

// THIS IS MY SECOND FUNCTION TO VIEW THE TODO

function displayTodosAsMenu() {
    console.log("Available Todos:"); // I wanted to allow the user to view every todo after they make it so that they can verify it's there.
    todos.forEach(todo => {
        console.log(`ID: ${todo.id}, Name: ${todo.name}, Status: ${todo.status}`); //Less information displayed on the initial menu makes it easier to view and manipulate especially on smaller devices
    });
}

