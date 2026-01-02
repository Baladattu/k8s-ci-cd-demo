const API_URL = '/api/todos';

async function fetchTodos() {
    const res = await fetch(API_URL);
    const todos = await res.json();
    renderTodos(todos);
}

function renderTodos(todos) {
    const list = document.getElementById('todo-list');
    list.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function addTodo() {
    const input = document.getElementById('todo-input');
    const text = input.value.trim();
    if (!text) return;

    await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });
    input.value = '';
    fetchTodos();
}

async function deleteTodo(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTodos();
}

// Initial load
fetchTodos();
