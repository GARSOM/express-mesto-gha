const Card = require('../models/card');
const {
  SUCCESS,
  INVALID_DATA,
  NOT_FOUND,
  DEFAULT_ERROR,
  CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS).send({ data: cards }))
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: `Ошибка сервера ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA).send({ message: 'Неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        return res.status(NOT_FOUND).send({ message: 'Неверный ID карточки' });
      }
      return res.status(SUCCESS).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA).send({ message: 'Неверный ID карточки' });
      }
      return res.status(DEFAULT_ERROR).send({ message: `Ошибка сервера ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user.id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.status(SUCCESS).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(INVALID_DATA).send({ message: 'Неверный ID карточки' });
    }
    return res.status(DEFAULT_ERROR).send({ message: `Ошибка сервера ${err.message}` });
  });

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }
    return res.status(SUCCESS).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(INVALID_DATA).send({ message: 'Неверный ID карточки' });
    }
    return res.status(DEFAULT_ERROR).send({ message: `Ошибка сервера ${err.message}` });
  });
