const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/shorten', authMiddleware, urlController.shorten);
router.get('/my-links', authMiddleware, urlController.getMyLinks);

module.exports = router;
