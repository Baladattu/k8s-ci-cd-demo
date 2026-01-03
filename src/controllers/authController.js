const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const redisService = require('../services/redisService');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

async function register(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        const existingUser = await redisService.getUser(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await redisService.saveUser(username, { username, password: hashedPassword });
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await redisService.getUser(username);
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { register, login };
