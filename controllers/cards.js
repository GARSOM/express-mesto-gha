const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const InvalidReq = require('../errors/InvalidReq');
const NoRights = require('../errors/NoRights');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidReq('Неверные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFound('Нет карточки с таким ID');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new NoRights('Можно удалить только свои карточки');
      } else {
        Card.findByIdAndDelete(req.params.cardId).then(() => res.status(200).send({ message: `deleted card ${card}` }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new InvalidReq('Неверные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user.id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFound(
        'Нет карточки с таким ID(как ты это вообще смог лайкнуть?)',
      );
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new InvalidReq(
        'Неверный ID карточки(хватит магии вне Хогвартса)',
      );
    }
    next(err);
  })
  .catch(next);

module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user.id } },
  { new: true },
)
  .then((card) => {
    if (card === null) {
      throw new NotFound(
        `Карточка с ID ${req.params.cardId} не была найдена`,
      );
    }
    return res.status(200).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new NoRights('Невалидные данные ID');
    }
    next(err);
  })
  .catch(next);
