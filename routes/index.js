const router = require("express").Router();
const userRouter = require("./users");
const cardRouter = require("./cards");
const notFoundPage = require("../routes/notFoundPage");

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.use("/*", notFoundPage);

module.exports = router;