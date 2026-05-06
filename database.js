const mysql = require('mysql2');

// Connect to MySQL database
const pool = mysql.createPool({
    host: 'localhost', // Default XAMPP host
    user: 'root',      // Default XAMPP user
    password: '',      // Default XAMPP password is empty
    database: 'movie_app_db' // The database you created
}).promise(); // We use .promise() to allow async/await just like in the video

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to the MySQL database (XAMPP).');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL:', err.message);
    });

module.exports = pool;
