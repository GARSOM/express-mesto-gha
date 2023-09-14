const router = require('express').Router();
const { notFoundPage } = require('../controllers/NotFoundPage');

router.use('/', notFoundPage);

module.exports = router;
