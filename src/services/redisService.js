const redis = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://redis-service:6379';
const client = redis.createClient({ url: redisUrl });

client.on('error', (err) => console.log('Redis Client Error', err));

async function connect() {
    if (!client.isOpen) {
        await client.connect();
        console.log('Connected to Redis via Service');
    }
}

connect();

const TODOS_KEY = 'todos';

async function getTodos() {
    const data = await client.get(TODOS_KEY);
    return data ? JSON.parse(data) : [];
}

async function addTodo(todo) {
    const todos = await getTodos();
    todos.push(todo);
    await client.set(TODOS_KEY, JSON.stringify(todos));
    return todo;
}

async function deleteTodo(id) {
    const todos = await getTodos();
    const newTodos = todos.filter(t => t.id !== id);
    await client.set(TODOS_KEY, JSON.stringify(newTodos));
    return newTodos;
}

module.exports = {
    getTodos,
    addTodo,
    deleteTodo
};
