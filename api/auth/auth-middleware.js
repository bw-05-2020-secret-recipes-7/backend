const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../auth/secrets');
const Users = require('../users/users-model');


const checkForRequiredCredentials = (req, res, next) => {
  const { username, password } = req.body;
  const valid = Boolean(
    req.body.username &&
    req.body.password &&
    username.trim() &&
    password.trim()
  );

  if (valid) {
    req.body.username = username.trim();
    req.body.password = password.trim();
    next();
  } else {
    res.status(422).json({
      message: 'Username and Password required'
    });
  }
}

const validateUsername = (req, res, next) => {

  Users.findUser(req.body.username)
    .then((user) => {
      if (!user) {
        next();
      } else {
        res.status(409).json({
            message: "Username unavailable"
        });
      }
    })
    .catch(err => {
      next(err);
    })
};

const validateLogin = (req, res, next) => {
  let { username, password } = req.body;

  Users.findUser(username)
    .then((user) => {
      if (!user) {
        res.status(401).json({message: 'Invalid Username'})
      } else if (user && bcrypt.compareSync(password, user.password)) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Invalid Password' });
      }
    })
    .catch(next);
}

const tokenBuilder = (req, res, next) => {
  const user = req.user;
  if (!user) {
    res.status(500).json({ message: 'something went wrong at login'});
  } else {

    const payload = {
      sub: user.user_id,
      username: user.username,
    };
    const options = {
      expiresIn: '1h',
      
    };
    const result = jwt.sign(
      payload,
      JWT_SECRET,
      options
      );
    req.token = result;
    next();
  }
}

module.exports = {
  checkForRequiredCredentials,
  validateUsername,
  validateLogin,
  tokenBuilder
};