
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// البيانات التي قمت بتزويدي بها لاستضافتك
const dbConfig = {
    host: 'localhost',
    user: 'fdertnet_m1',
    password: 'Fdert@01395',
    database: 'fdertnet_m1'
};

async function initDb() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        return connection;
    } catch (err) {
        console.error('Database connection error:', err.message);
        throw err;
    }
}

// Routes
app.get('/api/conversations', async (req, res) => {
    try {
        const db = await initDb();
        const [rows] = await db.execute(`
            SELECT c.*, ct.name as contactName, ct.phone as contactPhone 
            FROM conversations c 
            JOIN contacts ct ON c.contact_id = ct.id
            ORDER BY last_message_at DESC
        `);
        await db.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/conversations/:id/messages', async (req, res) => {
    try {
        const db = await initDb();
        const [rows] = await db.execute('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC', [req.params.id]);
        await db.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/messages', async (req, res) => {
    const { conversationId, text, direction } = req.body;
    try {
        const db = await initDb();
        const [result] = await db.execute(
            'INSERT INTO messages (conversation_id, direction, text) VALUES (?, ?, ?)',
            [conversationId, direction, text]
        );
        await db.execute('UPDATE conversations SET last_message = ?, last_message_at = NOW() WHERE id = ?', [text, conversationId]);
        await db.end();
        res.json({ id: result.insertId, conversationId, text, direction, timestamp: new Date() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// المنفذ الخاص بـ FastComet Node.js Selector
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
