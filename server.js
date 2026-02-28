const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json()); 


const db = new sqlite3.Database('./plants.db', (err) => {
    if (err) console.error(err.message);
    console.log('Дерекқорға сәтті қосылды.');
});


db.run(`CREATE TABLE IF NOT EXISTS plants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image_url TEXT
)`);


app.get('/api/plants', (req, res) => {
    db.all("SELECT * FROM plants", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});


app.post('/api/plants', (req, res) => {
    const { name, price, image_url } = req.body;
    

    if (!name || !price) {
        return res.status(400).json({ error: "Атауы мен бағасы міндетті түрде болуы керек!" });
    }

    const query = "INSERT INTO plants (name, price, image_url) VALUES (?, ?, ?)";
    db.run(query, [name, price, image_url], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, name, price });
    });
});



app.put('/api/plants/:id', (req, res) => {
    const { name, price, image_url } = req.body;
    const query = "UPDATE plants SET name = ?, price = ?, image_url = ? WHERE id = ?";
    
    db.run(query, [name, price, image_url, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Өсімдік табылмады" });
        res.json({ message: "Сәтті жаңартылды" });
    });
});

app.delete('/api/plants/:id', (req, res) => {
    const query = "DELETE FROM plants WHERE id = ?";
    db.run(query, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Өсімдік табылмады" });
        res.json({ message: "Сәтті өшірілді" });
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер http://localhost:${PORT} портында іске қосылды 🚀`);
});