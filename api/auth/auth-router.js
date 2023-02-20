const router = require("express").Router();
const UserModel = require("../users/users-model");
const { JWT_SECRET } = require("../secrets");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const md = require("./auth-middleware");

router.post(
  "/register",
  md.checkUsername,
  md.checkPayload,
  async (req, res, next) => {
    try {
      const hash = bcrypt.hashSync(req.body.password, 8);

      const newUser = await UserModel.add({
        username: req.body.username,
        password: hash,
      });
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
    /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.
    2^8 HASH TURUNU AŞMAYIN!

    1- Yeni bir hesap kaydetmek için istemci "kullanıcı adı" ve "şifre" sağlamalıdır:
      {
        "username": "Captain Marvel", // `users` tablosunda var olmalıdır
        "password": "foobar"          // kaydedilmeden hashlenmelidir
      }

    2- BAŞARILI kayıtta,
      response body `id`, `username` ve `password` içermelidir:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- Request bodyde `username` ya da `password` yoksa BAŞARISIZ kayıtta,
      response body şunu içermelidir: "username ve şifre gereklidir".

    4- Kullanıcı adı alınmışsa BAŞARISIZ kayıtta,
      şu mesajı içermelidir: "username alınmış".
  */
  }
);

router.post("/login", md.validateUsername, (req, res) => {
  try {
    const { password } = req.body;
    const passwordCheck = bcrypt.compareSync(password, req.user.password);

    if (passwordCheck) {
      const jwtToken = jwt.sign(
        {
          id: req.user.id,
          username: req.user.username,
          password: req.user.password,
        },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        id: req.user.id,
        username: req.user.username,
        password: req.user.password,
      });
    } else {
      next({
        status: 401,
        message: "Geçersiz kriter",
      });
    }
  } catch (err) {
    next(err);
  }
  /*
    EKLEYİN
    Uçnoktanın işlevselliğine yardımcı olmak için middlewarelar yazabilirsiniz.

    1- Var olan bir kullanıcı giriş yapabilmek için bir `username` ve `password` sağlamalıdır:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- BAŞARILI girişte,
      response body `message` ve `token` içermelidir:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- req body de `username` ya da `password` yoksa BAŞARISIZ giriş,
      şu mesajı içermelidir: "username ve password gereklidir".

    4- "username" db de yoksa ya da "password" yanlışsa BAŞARISIZ giriş,
      şu mesajı içermelidir: "geçersiz kriterler".
  */
});

module.exports = router;
