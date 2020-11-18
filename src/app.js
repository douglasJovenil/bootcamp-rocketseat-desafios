const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndexByID(id) {
  return repositories.findIndex(repository => repository.id === id);
}

function middlewareRepositoryExists(request, response, next) {
  const { id } = request.params;
  const repositoryIndex = getRepositoryIndexByID(id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository does not exists!' });
  }
  
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", middlewareRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = getRepositoryIndexByID(id);

  const currRepository = repositories[repositoryIndex];
  const updatedRepository = {
    id,
    title: title ? title : currRepository.title,
    url: url ? url : currRepository.url,
    techs: techs ? techs : currRepository.techs,
    likes: currRepository.likes
  }

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", middlewareRepositoryExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getRepositoryIndexByID(id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", middlewareRepositoryExists, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = getRepositoryIndexByID(id);

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
