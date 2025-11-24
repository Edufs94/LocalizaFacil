const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// Inicializa banco (em arquivo local ou memória)
const db = new sqlite3.Database(process.env.SQLITE_FILE || './data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS establishments (
    id INTEGER PRIMARY KEY,
    name TEXT,
    type TEXT,
    address TEXT,
    lat REAL,
    lng REAL
  )`);

  // Insere dados de exemplo (só na primeira vez)
  db.get("SELECT COUNT(*) as count FROM establishments", (err, row) => {
    if (row && row.count === 0) {
      const places = [
        ["Padaria Central", "mercado", "Rua A, 123", -23.5505, -46.6333],
        ["Farmácia São João", "farmacia", "Av. B, 456", -23.5510, -46.6340],
        ["Restaurante Sabor Bom", "restaurante", "Rua C, 789", -23.5520, -46.6350]
      ];
      places.forEach(p =>
        db.run("INSERT INTO establishments (name, type, address, lat, lng) VALUES (?, ?, ?, ?, ?)", p)
      );
    }
  });
});

// Rota para listar estabelecimentos
app.get('/api/places', (req, res) => {
  const { type } = req.query;
  let query = 'SELECT * FROM establishments';
  const params = [];
  if (type) {
    query += ' WHERE type = ?';
    params.push(type);
  }
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Porta dinâmica para Render (ou Railway)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend rodando na porta ${PORT}`);
});
