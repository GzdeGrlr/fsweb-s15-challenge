const router = require("express").Router();
const Users = require("./users-model");

router.get("/", (req, res, next) => {
  Users.find()
    .then((users) => {
      res.json(users);
    })
    .catch(next);
});

module.exports = router;
