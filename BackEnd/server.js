const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const os = require('os');
const { format } = require('date-fns');
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

// Rota de registro de treinos
app.post('/register-training', async (req, res) => {
  const { usuarioId, tipo, inicio, fim, legenda, fotos } = req.body;

  if (!usuarioId || !tipo || !inicio || !fim) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Formatar as datas para o formato aceito pelo MySQL
    const inicioFormatado = format(new Date(inicio), 'yyyy-MM-dd HH:mm:ss');
    const fimFormatado = format(new Date(fim), 'yyyy-MM-dd HH:mm:ss');

    await pool.query(
      'INSERT INTO treinos (usuario_id, tipo, inicio, fim, legenda, fotos) VALUES (?, ?, ?, ?, ?, ?)',
      [usuarioId, tipo, inicioFormatado, fimFormatado, legenda, JSON.stringify(fotos)]
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

  console.log('Recebendo credenciais:', { email, senha }); // Log para depuração

  try {
    const [rows] = await pool.query(
      'SELECT id, nome, email, fotoPerfil FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length > 0) {
      console.log('Usuário autenticado:', rows[0]); // Log do usuário encontrado
      res.status(200).json(rows[0]);
    } else {
      console.log('Credenciais inválidas:', { email, senha }); // Log para credenciais incorretas
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário no servidor.' });
  }
});


// Rota para adicionar comentário
app.post('/comentarios', async (req, res) => {
  try {
    const { treino_id, usuario_id, comentario } = req.body;

    if (!treino_id || !usuario_id || !comentario) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Simule um salvamento no banco de dados
    await database.query(
      'INSERT INTO comentarios (treino_id, usuario_id, comentario) VALUES (?, ?, ?)',
      [treino_id, usuario_id, comentario]
    );

    res.status(201).json({ message: 'Comentário adicionado com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar os comentários de um post
// Rota para listar comentários de um treino específico
app.get('/comentarios/:treinoId', async (req, res) => {
  const { treinoId } = req.params;

  try {
    // Verificar se o treino existe
    const [treino] = await pool.query('SELECT * FROM treinos WHERE id = ?', [treinoId]);
    if (treino.length === 0) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }

    // Buscar comentários do treino
    const [comentarios] = await pool.query(
      `
      SELECT c.id, c.comentario, c.data_criacao, u.nome AS usuario_nome, u.fotoPerfil AS usuario_foto
      FROM comentarios c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.treino_id = ?
      ORDER BY c.data_criacao DESC
      `,
      [treinoId]
    );

    res.status(200).json({ treinoId, comentarios });
  } catch (error) {
    console.error('Erro ao buscar comentários:', error);
    res.status(500).json({ error: 'Erro ao buscar comentários.' });
  }
});





// Middleware de log
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
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Rota para alterar informações do usuario na tela perfil.js
app.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  let { nome, email, senha, objetivo, telefone, dataNascimento, fotoPerfil } = req.body;

  if (dataNascimento) {
    dataNascimento = dataNascimento.replace(/(\d{2})(\d{2})(\d{4})/, '$3-$2-$1');
  }

  try {
    const [result] = await pool.query(
      'UPDATE usuarios SET nome = ?, email = ?, senha = ?, objetivo = ?, telefone = ?, dataNascimento = ?, fotoPerfil = ? WHERE id = ?',
      [nome, email, senha, objetivo, telefone, dataNascimento, fotoPerfil, id]
    );

    if (result.affectedRows > 0) {
      const [updatedUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      res.status(200).json(updatedUser[0]);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// Buscar todos os treinos do banco de dados
app.get('/trainings', async (req, res) => {
  try {
    const [trainings] = await pool.query(
      'SELECT t.*, u.nome AS usuario, u.fotoPerfil FROM treinos t JOIN usuarios u ON t.usuario_id = u.id ORDER BY t.inicio DESC'
    );

    const formattedTrainings = trainings.map((training) => ({
      ...training,
      fotos: training.fotos ? JSON.parse(training.fotos) : [], // Converte JSON para array
    }));

    res.status(200).json(formattedTrainings);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ error: 'Erro ao buscar treinos.' });
  }
});


// Inicia o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://192.168.1.10:${port}`);
});
