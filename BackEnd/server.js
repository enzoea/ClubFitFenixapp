const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// Configuração da conexão com o PostgreSQL
const pool = mysql.createPool({
    host: '127.0.0.1', 
    port: 3306,  
    user: 'root', 
    password: 'enzo321', 
    database: 'clubfit',
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota de cadastro
app.post('/register', async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senha]
      );
      res.status(201).json({ id: result.insertId, nome, email });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  });
  

// Rota de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
      const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha]
      );
  
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(401).json({ error: 'Credenciais inválidas.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao autenticar usuário.' });
    }
  });
  

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
