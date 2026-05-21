const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// 1. POST /auth/register - Register User
router.post('/register', async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

// 2. POST /auth/login - Login User
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required' });
        }

        const result = await authService.login(email, password);
        res.status(200).json({
            status: 'success',
            message: result.message,
            data: result
        });
    } catch (err) {
        // Return 401 Unauthorized for login failures
        res.status(401).json({ status: 'error', message: err.message });
    }
});

// 3. GET /auth/verifikasi-email/:token - Verify Email
router.get('/verifikasi-email/:token', async (req, res) => {
    try {
        const result = await authService.verifyEmail(req.params.token);
        res.status(200).json({
            status: 'success',
            message: result.message
        });
    } catch (err) {
        res.status(400).json({ status: 'error', message: err.message });
    }
});

module.exports = router;
