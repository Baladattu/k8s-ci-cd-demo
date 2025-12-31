const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Kubernetes CI/CD Demo! v1');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

module.exports = app;
