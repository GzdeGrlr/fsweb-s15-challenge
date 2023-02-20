const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const restrict = require("./middleware/restricted.js");

const authRouter = require("./auth/auth-router.js");
const bilmecelerRouter = require("./bilmeceler/bilmeceler-router.js");
const usersRouter = require("./users/users-router");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/api/auth", authRouter);
server.use("/api/bilmeceler", restrict, bilmecelerRouter); // sadece giriş yapan kullanıcılar erişebilir!
server.use("/api/users", restrict, usersRouter);

server.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

server.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found" });
});

module.exports = server;
