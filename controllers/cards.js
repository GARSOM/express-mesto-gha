const Card = require("../models/card");

module.exports.getCards = (req, res) => {
    Card.find({})
        .then((cards) => res.status(200).send({ data: cards }))
        .catch((err) =>
            res.status(500).send({ message: `Ошибка сервера ${err.message}` })
        );
};

module.exports.createCard = (req, res) => {
    const { name, link } = req.body;
    const owner = req.user.id;
    Card.create({ name, link, owner })
        .then((card) => res.status(201).send({ data: card }))
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({ message: `Неверные данные` });
            }
            return res.status(500).send({ message: `Ошибка сервера` });
        });
};

module.exports.deleteCard = (req, res) => {
    console.log(req.params);
    Card.findByIdAndRemove(req.params.cardId)
        .then((card) => {
            if (card === null) {
                return res.status(404).send({ message: `Неверный ID карточки` });
            }
            return res.status(200).send(card);
        })
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(400).send({ message: `Неверный ID карточки` });
            }
            return res.status(500).send({ message: `Ошибка сервера ${err.message}` });
        });
};

module.exports.likeCard = (req, res) =>
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user.id } },
        { new: true }
    )
        .then((card) => {
            if (card === null) {
                return res.status(404).send({ message: `Карточка не найдена` });
            }
            return res.status(200).send(card);
        })
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(400).send({ message: `Неверный ID карточки` });
            }
            return res.status(500).send({ message: `Ошибка сервера ${err.message}` });
        });

module.exports.dislikeCard = (req, res) =>
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user.id } },
        { new: true }
    )
        .then((card) => {
            if (card === null) {
                return res.status(404).send({ message: `Карточка не найдена` });
            }
            return res.status(200).send(card);
        })
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(400).send({ message: `Неверный ID карточки` });
            }
            return res.status(500).send({ message: `Ошибка сервера ${err.message}` });
        });