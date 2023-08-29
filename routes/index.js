const router = require("express").Router();
const userRouter = require("../routes/users");
const cardRouter = require("../routes/cards");
const notFoundPage = require("../routes/notFoundPage");

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.use("/*", notFoundPage);

module.exports = router;