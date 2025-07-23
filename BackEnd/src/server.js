const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const os = require('os');
const { format } = require("date-fns");
const app = express();
const port = 3000;

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

// Rota para cadastro de profissional
app.post('/register/profissional', (req, res) => {
  const { nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao } = req.body;

  // Inserir os dados na tabela 'profissionais'
  const query = `INSERT INTO profissionais (nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  pool.query(query, [nome, telefone, email, dataNascimento, objetivo, senha, registro, profissao], (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar profissional.' });
    }
    res.status(200).json({ message: 'Profissional cadastrado com sucesso!' });
  });
});

// Rota de registro de treinos
app.post('/register-training', async (req, res) => {
  const { usuarioId, tipo, inicio, fim, legenda, fotos } = req.body;

  if (!usuarioId || !tipo || !inicio || !fim) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Formatando a data para dd/MM/yyyy HH:mm:ss antes de salvar no banco
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
      'SELECT id, nome, email, fotoPerfil, profissao FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length > 0) {
      console.log('Usuário autenticado:', rows[0]); // Log do usuário encontrado
      res.status(200).json(rows[0]); // Retorna o usuário com o campo profissao
    } else {
      console.log('Credenciais inválidas:', { email, senha }); // Log para credenciais incorretas
      res.status(401).json({ error: 'Email ou senha incorretos.' });
    }
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    res.status(500).json({ error: 'Erro ao autenticar usuário no servidor.' });
  }
});


//Rota curtida
// Rota curtida
app.post('/curtidas', (req, res) => {
  const { usuario_id, treino_id } = req.body;
  console.log('Recebendo dados de curtida:', req.body);

  // Verificando se a curtida já existe
  const checkQuery = 'SELECT * FROM curtidas WHERE usuario_id = ? AND treino_id = ?';
  
  pool.query(checkQuery, [usuario_id, treino_id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Erro ao verificar curtida existente' });
    }
    
    if (results.length > 0) {
      // Curtida já existe, não permitir nova
      return res.status(400).json({ message: 'Você já curtiu este treino!' });
    }

    // Se não existir, adicionar a curtida
    const query = 'INSERT INTO curtidas (usuario_id, treino_id) VALUES (?, ?)';
    pool.query(query, [usuario_id, treino_id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Erro ao adicionar curtida' });
      }
      res.status(201).json({ message: 'Curtida adicionada com sucesso' });
    });
  });
});


app.delete('/curtidas/:usuario_id/:treino_id', (req, res) => {
  const { usuario_id, treino_id } = req.params;
  console.log('Deletando curtida para:', { usuario_id, treino_id });

  // Verificando se a curtida existe
  const checkQuery = 'SELECT * FROM curtidas WHERE usuario_id = ? AND treino_id = ?';
  pool.query(checkQuery, [usuario_id, treino_id], (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Erro ao verificar curtida existente' });
    }

    if (results.length === 0) {
      // Curtida não existe
      return res.status(404).json({ message: 'Curtida não encontrada' });
    }

    // Caso exista, prossegue com a remoção
    const query = 'DELETE FROM curtidas WHERE usuario_id = ? AND treino_id = ?';
    pool.query(query, [usuario_id, treino_id], (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Erro ao remover curtida' });
      }
      res.status(200).json({ message: 'Curtida removida com sucesso' });
    });
  });
});



// Rota para buscar as fichas de treino de um usuário específico
app.get('/fichas-treino/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    // Verifica se o usuário existe
    const [usuario] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
    if (!usuario || usuario.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Busca os treinos do usuário
    const [treinos] = await pool.query(
      'SELECT t.*, u.nome AS usuario_nome, u.fotoPerfil AS usuario_foto FROM treinos t JOIN usuarios u ON t.usuario_id = u.id WHERE t.usuario_id = ? ORDER BY t.inicio DESC',
      [usuarioId]
    );

    // Se não houver treinos para o usuário
    if (treinos.length === 0) {
      return res.status(200).json({ treinos: [], message: 'Nenhum treino registrado para este usuário.' });
    }

    // Formata as fotos e prepara os dados para enviar
    const formattedTreinos = treinos.map((treino) => {
      let fotosArray;
      try {
        fotosArray = treino.fotos ? JSON.parse(treino.fotos) : [];
      } catch (error) {
        console.error(`Erro ao converter fotos para JSON no treino ${treino.id}:`, error);
        fotosArray = []; // Garante que não quebre o app
      }

      return {
        ...treino,
        fotos: fotosArray,
      };
    });

    // Retorna os treinos com sucesso
    res.status(200).json({ treinos: formattedTreinos });
  } catch (error) {
    console.error('Erro ao buscar fichas de treino:', error);
    res.status(500).json({ error: 'Erro ao buscar fichas de treino.' });
  }
});



// Rota para adicionar comentário
app.post('/comentarios', async (req, res) => {
  try {
    const { treino_id, usuario_id, comentario } = req.body;

    if (!comentario || comentario.length < 1) {
      return res.status(400).json({ message: 'Comentário não pode ser vazio.' });
    }

    if (!treino_id || !usuario_id || !comentario) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Salva o comentário no banco de dados
    const result = await pool.query(
      'INSERT INTO comentarios (treino_id, usuario_id, comentario) VALUES (?, ?, ?)',
      [treino_id, usuario_id, comentario]
    );

    res.status(201).json({ 
      message: 'Comentário adicionado com sucesso!',
      comentario: { treino_id, usuario_id, comentario } // Envia o comentário adicionado
    });
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar os comentários de um post
app.get('/comentarios/:treinoId', async (req, res) => {
  const { treinoId } = req.params;

  try {
    // Verifica se o treino existe
    const [treino] = await pool.query('SELECT * FROM treinos WHERE id = ?', [treinoId]);
    if (!treino || treino.length === 0) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }

    // Busca os comentários do treino
    const [comentarios] = await pool.query(
      `SELECT c.id, c.comentario, u.nome AS usuario_nome, u.fotoPerfil AS usuario_foto
      FROM comentarios c
      INNER JOIN usuarios u ON c.usuario_id = u.id
      WHERE c.treino_id = ?`,
      [treinoId]
    );

    if (comentarios.length === 0) {
      return res.status(200).json({ comentarios: [], message: 'Não há comentários para este treino.' });
    }

    res.status(200).json({ comentarios });
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

  // Log para verificar os dados recebidos no backend
  console.log('Dados recebidos no backend:', req.body);

  // Verifique se todos os campos obrigatórios estão presentes
  if (!nome || !email || !senha || !objetivo || !telefone || !dataNascimento) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos!' });
  }

  // Formatação da data de nascimento (caso necessário)
  if (dataNascimento) {
    dataNascimento = dataNascimento.replace(/(\d{2})(\d{2})(\d{4})/, '$3-$2-$1');
    console.log('Data de nascimento formatada:', dataNascimento); // Verificar a data de nascimento formatada
  }

  try {
    // Consulta para atualizar o usuário
    const [result] = await pool.query(
      'UPDATE usuarios SET nome = ?, email = ?, senha = ?, objetivo = ?, telefone = ?, dataNascimento = ?, fotoPerfil = ? WHERE id = ?',
      [nome, email, senha, objetivo, telefone, dataNascimento, fotoPerfil, id]
    );

    // Verificando o resultado da query
    console.log('Resultado da query de atualização:', result);

    if (result.affectedRows > 0) {
      // Se a atualização for bem-sucedida, obtenha o usuário atualizado
      const [updatedUser] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
      res.status(200).json(updatedUser[0]);
    } else {
      // Caso o usuário não seja encontrado (por exemplo, id inválido)
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.use(bodyParser.json());  // Para permitir que o Express entenda os dados no formato JSON

// Rota para salvar treino
app.post('/treino', (req, res) => {
  const { id_ficha, nome_exercicio, series, repeticoes, carga, observacoes } = req.body;

  if (!id_ficha || !nome_exercicio || !series || !repeticoes) {
    return res.status(400).json({ error: 'Dados obrigatórios faltando' });
  }

  // SQL para inserir os dados na tabela exercicios_ficha
  const query = `
    INSERT INTO exercicios_ficha (id_ficha, nome_exercicio, series, repeticoes, carga, observacoes)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  connection.execute(query, [id_ficha, nome_exercicio, series, repeticoes, carga, observacoes], (err, result) => {
    if (err) {
      console.error('Erro ao salvar treino:', err);
      return res.status(500).json({ error: 'Erro ao salvar o treino' });
    }

    console.log('Treino salvo com sucesso!');
    res.status(201).json({ message: 'Treino salvo com sucesso!', id: result.insertId });
  });
});


// Buscar todos os treinos do banco de dados
// Buscar todos os treinos do banco de dados
app.get('/trainings', async (req, res) => {
  try {
    const [trainings] = await pool.query(
      'SELECT t.*, u.nome AS usuario, u.fotoPerfil FROM treinos t JOIN usuarios u ON t.usuario_id = u.id ORDER BY t.inicio DESC'
    );

    const formattedTrainings = trainings.map((training) => {
      let fotosArray;
      try {
        fotosArray = training.fotos ? JSON.parse(training.fotos) : [];
      } catch (error) {
        console.error(`Erro ao converter fotos para JSON no treino ${training.id}:`, error);
        fotosArray = []; // Garante que não quebre o app
      }

      return {
        ...training,
        fotos: fotosArray,
      };
    });

    res.status(200).json(formattedTrainings);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ error: 'Erro ao buscar treinos no banco de dados.' });
  }
});

// Inicia o servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor rodando em http://192.168.0.102:${port}`);


});