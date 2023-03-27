const User = require('../schemas/User');
const Session = require('../schemas/Session');
const md5 = require('md5')
const { v4: uuidV4 } = require('uuid')

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

  const { login: userLogin, _id: id } = user;

  const { 'session-id': sessionId } = req.cookies;

  console.log('\nsessionId', sessionId);
  console.log('\nreq.cookies', req.cookies);

  if (sessionId) {
    const session = await Session.findOne({ id: sessionId });

    if (!session) {
      const newSession = new Session({
        id: sessionId,
        data: {
          id,
          isLoggedIn: true,
          authToken: uuidV4(),
        },
        ttl: 60 * 60 * 24 * 365,
        created: +Date.now()
      });

      console.log('newSession ', newSession);
    }
  }

  res.send({
    user: {
      login: userLogin,
      id
    },
  });
}

module.exports = {
  loginUser,
  createUser
};
