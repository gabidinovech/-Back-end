require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { 
        rejectUnauthorized: false 
    },
    connectTimeout: 10000
});

db.connect(err => {
    if (err) {
        console.error("❌ Дерекқорға қосылу қатесі:", err.message);
        return;
    }
    console.log('🚀 Aiven MySQL дерекқорына СӘТТІ қосылды!');
});




app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, password], (err) => {
        if (err) {
            console.error("Тіркелу қатесі:", err.message);
            return res.status(500).json({ message: "Тіркелу кезінде қате кетті" });
        }
        res.status(201).json({ message: "Тіркелу сәтті!" });
    });
});


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Сервер қатесі" });
        if (results.length > 0) {
            res.json({ 
                message: "Сәтті!", 
                username: results[0].username, 
                email: results[0].email 
            });
        } else {
            res.status(401).json({ message: "Email немесе құпия сөз қате" });
        }
    });
});


app.get('/api/cart', (req, res) => {
    const { email } = req.query;
    if (!email) return res.json([]);

    const query = `
        SELECT cart.id AS cart_id, products.name, products.price 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        JOIN users ON cart.user_id = users.id
        WHERE users.email = ?
    `;
    
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Деректерді алу мүмкін емес" });
        res.json(results);
    });
});

app.post('/api/cart', (req, res) => {
    const { user_email, product_id } = req.body;

    db.query("SELECT id FROM users WHERE email = ?", [user_email], (err, results) => {
        if (err || results.length === 0) return res.status(400).json({ message: "Пайдаланушы табылмады" });
        
        const userId = results[0].id;
        db.query("INSERT INTO cart (user_id, product_id) VALUES (?, ?)", [userId, product_id], (err) => {
            if (err) return res.status(500).json({ message: "Себетке қосу қатесі" });
            res.status(201).json({ message: "Тауар сәтті қосылды! 🌿" });
        });
    });
});


app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM cart WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Сәтті өшірілді" });
    });
});


app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h1 style="color:#2D4035; font-size:50px;">404</h1>
            <h2>Бет табылмады 🌿</h2>
            <a href="/index.html" style="color:#3e5c4a; text-decoration:none; border:1px solid #3e5c4a; padding:10px 20px; border-radius:5px;">Басты бетке қайту</a>
        </div>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер іске қосылды: Порт ${PORT} 🚀`));
