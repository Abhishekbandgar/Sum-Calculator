const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Abhi@1312', // Replace with your MySQL password
    database: 'sum_calculator'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to calculate sum
const calculateSum = (numbers) => {
    return numbers.split(',').map(Number).reduce((acc, num) => acc + num, 0);
};

// Endpoint to handle sum calculation
app.post('/calculate', (req, res) => {
    const numbers = req.body.numbers;

    // Check if the result already exists in the database
    db.query("SELECT result FROM transactions WHERE numbers = ?", [numbers], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            res.json({ result: results[0].result });
        } else {
            const sum = calculateSum(numbers);

            // Save the transaction and result in the database
            db.query("INSERT INTO transactions (numbers, result) VALUES (?, ?)", [numbers, sum], (err) => {
                if (err) return res.status(500).json({ error: err.message });

                res.json({ result: sum });
            });
        }
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
