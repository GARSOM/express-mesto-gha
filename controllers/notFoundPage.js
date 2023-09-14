const NotFound = require('../errors/NotFound');

const notFoundPage = () => {
  throw new NotFound('Страница не найдена.');
};

module.exports = { notFoundPage };
