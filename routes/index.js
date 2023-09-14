const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('../routes/users');
const cardRouter = require('../routes/cards');
const notFoundPage = require('../routes/NotFoundPage');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  }),
  login,
);
router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email(),
      password: Joi.string(),
    }),
  }),
  createUser,
);
router.use(auth);
router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use('/*', notFoundPage);

module.exports = router;
