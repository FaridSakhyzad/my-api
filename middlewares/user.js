const User = require('../schemas/User');
const Session = require('../schemas/Session');
const md5 = require('md5')
const { v4: uuidV4 } = require('uuid')

const checkIfUserExist = async (email) => {
  const result = await User.findOne({ email });

  return result !== null;
}

const createUser = async (req, res, next) => {
  const { email, password } = req.body;

  const isUserExist = await checkIfUserExist(email);

  if (isUserExist) {
    res.send({ errors: [
        { message: 'ERROR, USER ALREADY EXIST' }
      ]
    });

    return;
  }

  const newUser = new User({
    email,
    password: md5(password),
  });

  const result = await newUser.save().catch((error) => { console.error(error) });

  res.send({
    message: 'User Created',
    user: {
      id: result._id,
    },
  });
};

const loginUser = async (req, res, next) => {
  const { email, password, remember } = req.body;

  const user = await User.findOne({ email, password: md5(password) })

  if (!user) {
    res.send({ errors: [
        { message: 'USERNAME OR PASSWORD IS INCORRECT' }
      ]
    });

    return;
  }

  const { email: userEmail, _id: id } = user;

  const { 'session-id': sessionId } = req.cookies;

  let authToken;

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

    const saveSessionResult = await newSession.save().catch((error) => { console.error(error) });

    console.log('newSession ', newSession);
    console.log('\n');
    console.log('saveSessionResult ', saveSessionResult);

    authToken = saveSessionResult.data.authToken;
  } else {
    console.log('exising session ', session);
    authToken = session.data.authToken;
  }

  res.send({
    user: {
      email: userEmail,
      id,
      authToken
    },
  });
}

const getUserProfile = async (req, res, next) => {
  const { authToken, 'session-id': sessionId } = req.cookies;

  const session = await Session.findOne({ id: sessionId });

  if (!session || !session.data || session.data.authToken !== authToken) {
    res.send({ user: null });
    return;
  }

  console.log('session.data.id', session.data.id);

  const user = await User.findOne({ _id: session.data.id });

  console.log('user', user);

  if (user) {
    const { email, _id: id } = user;

    res.send({ user: { email, id } });
  } else {
    res.send({ user: null });
  }
}

module.exports = {
  loginUser,
  createUser,
  getUserProfile
};
