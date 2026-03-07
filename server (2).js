const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors'); // CORS қосылды
const app = express();

// Баптаулар
app.use(cors()); // Барлық сұраныстарға рұқсат беру
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

// Дерекқорға қосылу
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'planty_db'
});

db.connect(err => {
    if (err) {
        console.error("Дерекқорға қосылу қатесі! XAMPP қосылып тұрғанын тексеріңіз:", err.message);
        return;
    }
    console.log('MySQL дерекқорына сәтті қосылды! ✅');
});

// ==========================================
// 1. АВТОРИЗАЦИЯ ЖӘНЕ ТІРКЕЛУ API
// ==========================================

// ТІРКЕЛУ (Осы бөлім сенде болмаған!)
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Барлық өрістерді толтырыңыз" });
    }

    const query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            console.error("Тіркелу қатесі:", err.message);
            return res.status(500).json({ message: "Бұл email тіркелген болуы мүмкін" });
        }
        res.status(201).json({ message: "Тіркелу сәтті аяқталды!" });
    });
});

// КІРУ
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Бос өрістерді толтырыңыз" });

    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: "Сервер қатесі" });
        if (results.length > 0) {
            res.json({ message: "Сәтті!", username: results[0].username, email: results[0].email });
        } else {
            res.status(401).json({ message: "Email немесе құпия сөз қате" });
        }
    });
});

// ==========================================
// 2. СЕБЕТ API (CRUD)
// ==========================================

app.get('/api/cart', (req, res) => {
    const { email } = req.query;
    if (!email) return res.json([]);

    const query = `
        SELECT cart.id AS cart_id, products.name, products.price 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.user_email = ?
    `;
    
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: "Деректерді алу мүмкін емес" });
        res.json(results);
    });
});

app.get('/api/cart/count', (req, res) => {
    const { email } = req.query;
    if (!email) return res.json({ count: 0 });

    db.query("SELECT COUNT(*) AS total FROM cart WHERE user_email = ?", [email], (err, results) => {
        if (err) return res.json({ count: 0 });
        res.json({ count: results[0].total });
    });
});

app.post('/api/cart', (req, res) => {
    const { user_email, product_id } = req.body;
    if (!user_email || !product_id) return res.status(400).json({ message: "Деректер жеткіліксіз" });

    db.query("INSERT INTO cart (user_email, product_id) VALUES (?, ?)", [user_email, product_id], (err) => {
        if (err) return res.status(500).json({ message: "Себетке қосу кезінде қате кетті" });
        res.status(201).json({ message: "Тауар сәтті қосылды! 🌿" });
    });
});

app.delete('/api/cart/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Сәтті өшірілді" });
    });
});

// ==========================================
// 3. 404 ҚАТЕСІ
// ==========================================
app.use((req, res) => {
    res.status(404).send(`
        <div style="text-align:center; padding:50px; font-family:sans-serif;">
            <h1 style="color:#2D4035; font-size:50px;">404</h1>
            <h2>Бет табылмады 🌿</h2>
            <a href="/index.html" style="color:#3e5c4a; text-decoration:none; border:1px solid #3e5c4a; padding:10px 20px; border-radius:5px;">Басты бетке қайту</a>
        </div>
    `);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Сервер іске қосылды: http://localhost:${PORT}`));