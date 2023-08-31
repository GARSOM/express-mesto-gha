const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    id: '64ee3353b11e901b7a0353a0',
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на: http://localhost:${PORT}`);
});
