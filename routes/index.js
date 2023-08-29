const router = require("express").Router();
const userRouter = require("../routes/users");

router.use("/users", userRouter);

module.exports = router;