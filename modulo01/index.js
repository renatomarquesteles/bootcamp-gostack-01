// Importa o express
const express = require('express');
// Chamando a função do express
const server = express();

// Definir que o express deve ler JSON
server.use(express.json());

const users = ['Renato', 'Cláudio', 'Maria'];

// Middleware global
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url};`);

  // Continua para o próximo middleware
  next();

  console.timeEnd('Request');
});

function checkUserExists(req, res, next) {
  // Verifica se o nome do usuário está sendo enviado no body da requisição
  if (!req.body.name) {
    // Retorna erro 400
    return res.status(400).json({ error: 'User name is required' });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User does not exists' });
  }

  req.user = user;

  return next();
}

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name": "Renato", "idade": "23" }

// Método http GET, rota /users
// req = dados da requisição
// res = informações para retornar resposta ao cliente
server.get('/users', (req, res) => {
  return res.json(users);
});

// CRUD - Create, Read, Update, Delete
// Busca usuário
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Insere usuário
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

// Edita usuário
server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

// Remove usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

// Definir porta do servidor
server.listen(3000);
