const mongoose = require('mongoose');
const User = require('../schemas/User');
const md5 = require('md5')

const checkIfUserExist = async (login) => {
  const result = await User.findOne({ login });

  return result !== null;
}

const createUser = async (req, res, next) => {
  const { login, password } = req.body;

  const isUserExist = await checkIfUserExist(login);

  if (isUserExist) {
    res.send({ errors: [
        { message: 'ERROR, USER ALREADY EXIST' }
      ]
    });

    return;
  }

  const newUser = new User({
    login,
    password: md5(password),
  });

  const result = await newUser.save().catch((error) => { console.error(error) })

  res.send({
    message: 'User Created',
    user: {
      id: result._id,
    },
  });
};

const loginUser = async (req, res, next) => {
  console.log('\nloginUser');

  const { login, password, remember } = req.body;

  const user = await User.findOne({ login, password: md5(password) })

  if (!user) {
    res.send({ errors: [
        { message: 'USERNAME OR PASSWORD IS INCORRECT' }
      ]
    });

    return;
  }

  console.log('user', user);

  res.send({
    user: {
      id: user._id,
    },
  });
}

module.exports = {
  loginUser,
  createUser
};
