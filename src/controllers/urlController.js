const { nanoid } = require('nanoid');
const redisService = require('../services/redisService');

async function shorten(req, res) {
    try {
        const { originalUrl, customCode } = req.body;
        const userId = req.user.username;

        if (!originalUrl) {
            return res.status(400).json({ error: 'Original URL is required' });
        }

        const code = customCode || nanoid(6);
        const existing = await redisService.getUrl(code);
        
        if (existing) {
            return res.status(400).json({ error: 'Code already in use' });
        }

        const urlData = {
            originalUrl,
            userId,
            createdAt: new Date().toISOString()
        };

        await redisService.saveUrl(code, urlData);
        res.status(201).json({ code, ...urlData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function redirect(req, res) {
    try {
        const { code } = req.params;
        const urlData = await redisService.getUrl(code);

        if (!urlData) {
            return res.status(404).send('URL not found');
        }

        await redisService.trackClick(code);
        res.redirect(urlData.originalUrl);
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
}

async function getMyLinks(req, res) {
    try {
        const userId = req.user.username;
        const urls = await redisService.getUserUrls(userId);
        
        const enrichedUrls = await Promise.all(urls.map(async (url) => {
            const stats = await redisService.getStats(url.code);
            return { ...url, clicks: stats.clicks };
        }));

        res.json(enrichedUrls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { shorten, redirect, getMyLinks };
