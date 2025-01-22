const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const os = require('os');

const app = express();
const port = 3000;

// Configuração da conexão com o PostgreSQL
const pool = mysql.createPool({
    host: '127.0.0.1', 
    port: 3306,  
    user: 'root', 
    password: 'enzo123', 
    database: 'clubfit',
  });

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Função para obter o IP local
const getLocalIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Retorna localhost como fallback
};
// Rota para obter o IP local
app.get('/api/ip', (req, res) => {
  const ipAddress = getLocalIPAddress();
  res.json({ ip: ipAddress });
});

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha, objetivo, telefone, dataNascimento } = req.body;

  if (!nome || !email || !senha || !objetivo || !telefone || !dataNascimento) {
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

//Rota de registro de treinos
app.post('/register-training', async (req, res) => {
  const { usuarioId, tipo, inicio, fim } = req.body;

  console.log('Dados Recebidos no Backend:', req.body); // Log para depuração

  if (!usuarioId || !tipo || !inicio || !fim) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verificar se o usuário existe
    const [user] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Inserir o novo treino
    await pool.query(
      'INSERT INTO treinos (usuario_id, tipo, inicio, fim) VALUES (?, ?, ?, ?)',
      [usuarioId, tipo, new Date(inicio), new Date(fim)]
    );

    res.status(201).json({ message: 'Treino registrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao registrar treino:', error);
    res.status(500).json({ error: 'Erro ao registrar treino.' });
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

// Buscar todos os treinos do banco de dados
// Buscar todos os treinos do banco de dados
app.get('/trainings', async (req, res) => {
  try {
    const [trainings] = await pool.query(`
      SELECT t.*, u.nome AS usuario
      FROM treinos t
      JOIN usuarios u ON t.usuario_id = u.id
      ORDER BY t.inicio DESC
    `);
    res.status(200).json(trainings);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ error: 'Erro ao buscar treinos.' });
  }
});



// Inicia o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://192.168.1.6:${port}`);
});