const mysql = require('mysql2');

console.log("⏳ Қосылу әрекеті жасалуда...");

const db = mysql.createConnection({
    host: 'mysql-248f52ce-erjanesenbekov0-f55e.c.aivencloud.com',
    port: 27841,
    user: 'avnadmin',
    password: 'AVNS_ndF_D9I5rCqcK09lZJr',
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false },
    connectTimeout: 10000 // 10 секунд күту
});

db.connect(err => {
    if (err) {
        console.error("❌ ҚАТЕ ШЫҚТЫ:");
        console.error("Код:", err.code);
        console.error("Хабарлама:", err.message);
        process.exit(1);
    }
    
    console.log("🚀 СӘТТІ: Aiven-ге қосылды!");

    const queries = [
        `CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(255))`,
        `CREATE TABLE IF NOT EXISTS products (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), price INT, image VARCHAR(255))`,
        `CREATE TABLE IF NOT EXISTS cart (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, product_id INT, quantity INT DEFAULT 1, FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (product_id) REFERENCES products(id))`,
        `INSERT IGNORE INTO products (id, name, price, image) VALUES (1, 'Монстера', 13800, 'monstera.png'), (2, 'Фикус', 20200, 'fikus.png'), (3, 'Стрелиция', 21600, 'strelicia.png')`
    ];

    queries.forEach((q, i) => {
        db.query(q, (err) => {
            if (err) console.log(`❌ Сұраныс #${i+1} қате:`, err.message);
            else console.log(`✅ Сұраныс #${i+1} сәтті.`);
            if (i === queries.length - 1) {
                console.log("✨ БӘРІ ДАЙЫН!");
                db.end();
            }
        });
    });
});