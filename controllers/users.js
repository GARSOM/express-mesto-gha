const User = require("../models/user");

module.exports.getUsers = (req, res) => {
    User.find({})
        .then((users) => {
            res.status(200).send({ data: users });
        })
        .catch((err) =>
            res.status(500).send({ message: `Server Error. ${err.message}` })
        );
};

module.exports.getUser = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
        .then((user) => {
            if (user === null) {
                return res.status(404).send({ message: `User not found.` });
            }
            return res.status(200).send({ data: user });
        })
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(400).send({ message: `Invalid user ID` });
            }
            return res.status(500).send({ message: `Server Error. ${err.message}` });
        });
};

module.exports.createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
        .then((user) => res.status(201).send({ data: user }))
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({ message: `Invalid Data` });
            }
            return res.status(500).send({ message: `Server Error` });
        });
};

module.exports.updateProfile = (req, res) => {
    const { name, about } = req.body;
    User.findByIdAndUpdate(
        req.user.id,
        { name, about },
        { runValidators: true, new: true }
    )
        .then((user) => res.status(200).send(user))
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({ message: `Invalid Data` });
            }
            return res.status(500).send({ message: `Server Error` });
        });
};

module.exports.updateAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user.id, { avatar }, { new: true })
        .then((user) => {
            res.status(200).send(user.avatar);
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                return res.status(400).send({ message: `Invalid Data` });
            }
            return res.status(500).send({ message: `Server Error` });
        });
};