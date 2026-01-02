const redisService = require('../services/redisService');
const { v4: uuidv4 } = require('uuid');

async function getTodos(req, res) {
    try {
        const todos = await redisService.getTodos();
        res.json(todos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function createTodo(req, res) {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }
        const todo = { id: uuidv4(), text, completed: false };
        await redisService.addTodo(todo);
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function deleteTodo(req, res) {
    try {
        const { id } = req.params;
        await redisService.deleteTodo(id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getTodos,
    createTodo,
    deleteTodo
};
