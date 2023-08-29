const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mestodb");

app.use((req, res, next) => {
    req.user = {
        _id: '64ee2a29b11e901b7a03539b'
    };

    next();
});

app.use(router);

app.listen(PORT, () => {
    console.log(`Сервер запущен на: http://localhost:${PORT}`);
});