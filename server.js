
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// بيانات الاتصال بقاعدة بيانات FastComet
const dbConfig = {
    host: 'localhost',
    user: 'fdertnet_m1',
    password: 'Fdert@01395',
    database: 'fdertnet_m1'
};

// دالة تنفيذ الاستعلامات
async function query(sql, params) {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [results] = await connection.execute(sql, params);
        return results;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    } finally {
        if (connection) await connection.end();
    }
}

/** --- API ROUTES --- **/

// جلب المحادثات
app.get('/api/conversations', async (req, res) => {
    try {
        const rows = await query(`
            SELECT c.*, ct.name as contactName, ct.phone as contactPhone 
            FROM conversations c 
            JOIN contacts ct ON c.contact_id = ct.id
            ORDER BY last_message_at DESC
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// جلب رسائل محادثة
app.get('/api/conversations/:id/messages', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC', [req.params.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// إرسال رسالة
app.post('/api/messages', async (req, res) => {
    const { conversationId, text, direction, type = 'text' } = req.body;
    try {
        const result = await query(
            'INSERT INTO messages (conversation_id, direction, text, type) VALUES (?, ?, ?, ?)',
            [conversationId, direction, text, type]
        );
        await query('UPDATE conversations SET last_message = ?, last_message_at = NOW() WHERE id = ?', [text, conversationId]);
        res.json({ id: result.insertId, ...req.body, timestamp: new Date() });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// جهات الاتصال
app.get('/api/contacts', async (req, res) => {
    try {
        const rows = await query('SELECT * FROM contacts ORDER BY name ASC');
        res.json(rows);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/contacts', async (req, res) => {
    const { name, phone } = req.body;
    try {
        const result = await query('INSERT INTO contacts (name, phone) VALUES (?, ?)', [name, phone]);
        res.json({ id: result.insertId, name, phone });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

/** --- SERVING FRONTEND --- **/

// خدمة الملفات الساكنة (Static Files)
app.use(express.static(__dirname));

// نظام التوجيه (Routing) لمتصفحات الويب
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
