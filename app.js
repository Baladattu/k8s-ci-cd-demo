const express = require('express');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const urlRoutes = require('./src/routes/urlRoutes');
const urlController = require('./src/controllers/urlController');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

// The Redirector (Short URL handler)
app.get('/:code', urlController.redirect);

// Root serving (Frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all (SPA fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;
