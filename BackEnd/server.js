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
    password: 'aluno', 
    database: 'clubfit',
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota de cadastro
// Rota de cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha, objetivo, telefone, dataNascimento } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, objetivo, telefone, dataNascimento) VALUES (?, ?, ?, ?, ?, ?)',
      [nome, email, senha, objetivo, telefone, dataNascimento]
    );
    res.status(201).json({ id: result.insertId, nome, email });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ error: 'Email já registrado.' });
    } else {
      res.status(500).json({ error: 'Erro ao registrar usuário.' });
    }
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

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
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário.' });
  }
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Rota para buscar dados do usuário logado
app.get('/user/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
