const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFound = require('../errors/NotFound');
const InvalidReq = require('../errors/InvalidReq');
const RepitedData = require('../errors/RepitedData');
const Unauthorized = require('../errors/Unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ data: users });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user === null) {
        throw new NotFound('Пользователь не найден');
      }
      return res.status(200).send({ data: user });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: `Создан пользователь c ID ${user._id}, именем ${user.name} и email ${user.email}`,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidReq('Введены неверные данные');
      }
      if (err.code === 11000) {
        throw new RepitedData(`Данный E-mail ${email} уже есть`);
      }
      next(err);
    })
    .catch(next);
};
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidReq('Введены неверные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.status(200).send(user.avatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InvalidReq('Введены неверные данные');
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByData(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-strong-secret', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.status(200).send(token);
    })
    .catch((err) => {
      throw new Unauthorized(err.message);
    })
    .catch(next);
};
module.exports.getMeUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send({
      ID: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch(() => {
      throw new Unauthorized('Выполните вход');
    })
    .catch(next);
};
