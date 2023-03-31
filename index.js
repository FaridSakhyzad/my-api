const express = require('express');
const bodyParser = require('body-parser')

const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { loginUser, createUser, getUserProfile } = require('./middlewares/user');

const app = express();

app.use(bodyParser.json())
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/test').catch(err => {
  console.error('MONGO CONNECT ERROR');
  console.error(err);
});

app.post('/createUser', createUser);
app.post('/loginUser', loginUser);
app.get('/userProfile', getUserProfile);

app.listen(3007, () => {
  console.log('app listening on port 3007');
});
