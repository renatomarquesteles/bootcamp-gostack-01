const express = require('express');

const server = express();

let numberOfRequests = 0;
const projects = [];

server.use(express.json());

function logRequests(req, res, next) {
  numberOfRequests++;

  console.log(`Quantidade de requisições: ${numberOfRequests}`);

  return next();
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: 'Project does not exists' });
  }

  req.project = project;

  return next();
}

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const newProject = {
    id,
    title,
    tasks: []
  };

  projects.push(newProject);

  return res.json(projects);
});

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(req.project);
});

server.listen(3000);
