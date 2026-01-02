const express = require('express');
const path = require('path');
const todoRoutes = require('./src/routes/todoRoutes');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/todos', todoRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
