const db = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const sendEmail = require('../utils/sendEmail');

const SECRET_KEY = 'YOUR_SECRET_KEY_HERE'; // In production, use environment variables

const authService = {
    register: async (data) => {
        const { fullname, username, email, password } = data;

        // 1. Check if email or username already exists
        const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
        const [existingUsers] = await db.query(checkQuery, [email, username]);
        if (existingUsers.length > 0) {
            throw new Error('Email or Username already exists');
        }

        // 2. Hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Generate verification token using uuid
        const verificationToken = uuidv4();

        // 4. Insert new user into database
        const insertQuery = `
            INSERT INTO users (fullname, username, email, password, verification_token, is_verified) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(insertQuery, [fullname, username, email, hashedPassword, verificationToken, false]);

        // 5. Send Verification Email
        const emailPreviewUrl = await sendEmail(email, verificationToken);

        return { 
            id: result.insertId, 
            fullname, 
            username, 
            email, 
            message: 'User registered successfully. Please check your email to verify.',
            emailPreviewUrl // We return this so you can easily click the link in Postman for testing
        };
    },

    login: async (email, password) => {
        // 1. Check if user exists by email
        const query = 'SELECT * FROM users WHERE email = ?';
        const [users] = await db.query(query, [email]);

        if (users.length === 0) {
            throw new Error('User not found or Invalid credentials');
        }

        const user = users[0];

        // 2. Check if password matches using bcrypt.compare
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        // 3. (Optional but good practice) Check if email is verified
        if (!user.is_verified) {
            throw new Error('Please verify your email first before logging in');
        }

        // 4. Create JWT Token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        return {
            message: 'Login successful',
            token: token,
            user: {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                email: user.email
            }
        };
    },

    verifyEmail: async (token) => {
        // 1. Find user by verification token
        const query = 'SELECT * FROM users WHERE verification_token = ?';
        const [users] = await db.query(query, [token]);

        if (users.length === 0) {
            throw new Error('Invalid Verification Token');
        }

        const user = users[0];

        // 2. Update is_verified to true and clear the token
        const updateQuery = 'UPDATE users SET is_verified = true, verification_token = NULL WHERE id = ?';
        await db.query(updateQuery, [user.id]);

        return { message: 'Email Verified Successfully' };
    }
};

module.exports = authService;
