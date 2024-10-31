// Selecting important DOM elements
const todoForm = document.querySelector('form');
const todoInput = document.getElementById('todo-input');
const todoListUL = document.getElementById('todo-list');

// Loading todos from localStorage or initializing an empty array
let allTodos = getTodos();
let editIndex = null; // Tracks the index of the item being edited
updateTodoList(); // Updates the UI with the current list

// Event listener for form submission
todoForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents page reload
    if (editIndex !== null) {
        updateTodo(); // Update an existing todo item if editing
    } else {
        addTodo(); // Add a new todo item
    }
});

// Adds a new todo item to the list
function addTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false // New todos are not completed by default
        };
        allTodos.push(todoObject); // Add new todo to the list
        updateTodoList(); // Refresh the UI
        saveTodos(); // Save changes to localStorage
        todoInput.value = ""; // Clear the input field
    }
}

// Updates an existing todo item in the list
function updateTodo() {
    const todoText = todoInput.value.trim();
    if (todoText.length > 0 && editIndex !== null) {
        allTodos[editIndex].text = todoText; // Update the text
        editIndex = null; // Reset edit index
        updateTodoList(); // Refresh the UI
        saveTodos(); // Save changes to localStorage
        todoInput.value = ""; // Clear the input field
    }
}

// Refreshes the todo list on the page
function updateTodoList() {
    todoListUL.innerHTML = ""; // Clear existing list
    allTodos.forEach((todo, todoIndex) => {
        const todoItem = createTodoItem(todo, todoIndex); // Create new item
        todoListUL.append(todoItem); // Append item to the list
    });
}

// Creates a new DOM element for a todo item
function createTodoItem(todo, todoIndex) {
    const todoId = "todo-" + todoIndex;
    const todoLI = document.createElement("li");
    const todoText = todo.text;
    todoLI.className = "todo";
    todoLI.innerHTML = `
        <input type="checkbox" id="${todoId}">
        <label class="custom-checkbox" for="${todoId}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
        </label>
        <label for="${todoId}" class="todo-text">
            ${todoText}
        </label>
        <button class="edit-button">Edit</button>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
        </button>
    `;
    
    const deleteButton = todoLI.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodoItem(todoIndex); // Deletes the todo item
    });

    const editButton = todoLI.querySelector(".edit-button");
    editButton.addEventListener("click", () => {
        todoInput.value = todo.text; // Sets input value to current text
        editIndex = todoIndex; // Set the edit index to current item
        todoInput.focus(); // Focus on the input field
    });

    const checkbox = todoLI.querySelector("input");
    checkbox.addEventListener("change", () => {
        allTodos[todoIndex].completed = checkbox.checked; // Update completion status
        saveTodos(); // Save changes
    });
    checkbox.checked = todo.completed; // Sets the checked status
    return todoLI;
}

// Deletes a todo item from the list
function deleteTodoItem(todoIndex) {
    allTodos = allTodos.filter((_, i) => i !== todoIndex); // Filter out the item
    saveTodos(); // Save updated list
    updateTodoList(); // Refresh the UI
}

// Saves the current state of todos to localStorage
function saveTodos() {
    const todosJson = JSON.stringify(allTodos);
    localStorage.setItem("todos", todosJson);
}

// Retrieves the list of todos from localStorage
function getTodos() {
    const todos = localStorage.getItem("todos") || "[]";
    return JSON.parse(todos); // Return parsed JSON or empty array
}
