const User = require('../models/user');
const {
  CREATED,
  SUCCESS,
  INVALID_DATA,
  NOT_FOUND,
  DEFAULT_ERROR,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(SUCCESS).send({ data: users });
    })
    .catch((err) => res.status(DEFAULT_ERROR).send({ message: `Ошибка сервера. ${err.message}` }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
      return res.status(SUCCESS).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(INVALID_DATA).send({ message: 'Неверный ID пользователя' });
      }
      return res.status(DEFAULT_ERROR).send({ message: `Ошибка сервера. ${err.message}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA).send({ message: 'Неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => res.status(SUCCESS).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA).send({ message: 'Неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => res.status(SUCCESS).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(INVALID_DATA).send({ message: 'Неверные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'Ошибка сервера' });
    });
};
