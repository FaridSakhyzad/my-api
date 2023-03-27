const express = require('express');
const bodyParser = require('body-parser')

const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { loginUser, createUser } = require('./middlewares/user');

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

app.get('/user', (req, res, next) => {
  console.log(req);

  res.send({ message: 'HELOOOO' });
});

app.all('/', (req, res, next) => {
  console.log('ALL REQ *');
  // console.log('=============');
  // console.log('\nreq.headers', req.headers);
  // console.log('\nreq.cookies', req.cookies);
  // console.log('\nsession-id', req.cookies['session-id']);
  // console.log('=============');

  next();
})

const kittySchema = new mongoose.Schema({
  name: String,
  type: String,
});

const Kitten = mongoose.model('Kitten', kittySchema);
/*
const sessionSchema = new mongoose.Schema({
  id: String,
  data: Object,
  ttl: Number,
  created: Date
});

const Session = mongoose.model('Session', sessionSchema);

app.get('/getSessionInfo', (req, res, next) => {
  console.log('\n\n\nGET REQ getSessionInfo\n\n\n');
  const sessionId = req.cookies['session-id'];

  console.log('sessionId', sessionId);

  Session.find({ id: sessionId }).exec((error, documents) => {
    if (!documents.length) {
      const userSession = new Session({
        id: sessionId,
        data: {},
        ttl: 60 * 60 * 24,
        created: +Date.now()
      });

      return userSession.save().then((data) => {
        console.log('saved data', data);
        return res.send({
          message: 'HELLO. GET REQ getSessionInfo',
          data,
        });
      })
    }

    console.log('documents', documents);

    res.send({
      message: 'HELLO. GET REQ getSessionInfo',
      data: documents[0],
    });
  });
});
*/

app.get('/endpoint1', (req, res, next) => {
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3006',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    'X-My-Header-From-Api-Azazaza': 'asdf1024=768',
  });

  res.send({ message: 'HELOOOO' });
});

const myKitten = new Kitten({
  name: 'Quiet',
  type: 'default',
});

async function modelSave() {
  await myKitten.save();
}

//modelSave().catch(err => { console.error(err) });

app.listen(3007, () => {
  console.log('app listening on port 3007');
});
