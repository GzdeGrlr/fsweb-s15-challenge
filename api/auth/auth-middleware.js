const Users = require("../users/users-model");

async function checkUsername(req, res, next) {
  try {
    const presentUser = await Users.findByFilter({
      username: req.body.username,
    });

    if (presentUser.length > 0) {
      next({ status: 422, message: "username alınmış" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}

function checkPayload(req, res, next) {
  try {
    const requiredFields = ["username", "password"];
    const missingField = requiredFields.find((field) => !req.body[field]);

    if (missingField) {
      next({ status: 400, message: "username ve şifre gereklidir" });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
const validateUsername = async (req, res, next) => {
  try {
    const presentUser = await Users.findByFilter({
      username: req.body.username,
    });

    if (!presentUser.length) {
      next({
        status: 401,
        message: "geçersiz kriterler",
      });
    } else {
      req.user = presentUser[0];
      next();
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkUsername,
  checkPayload,
  validateUsername,
};
