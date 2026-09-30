const mysql = require('mysql2');
// === Connexion à la base de données ===
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_web'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected');
});

db.query('SELECT 1', (err) => {
  if (err) console.error('Erreur connexion:', err);
  else console.log('✅ Connexion MySQL OK');
});


module.exports = db;
