const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');

app.use((req, res, next) => {
  /* console.log('\n\n\nMY MW OLOL\n\n\n');
  console.log('======================');
  console.log('req.method', req.method);
  console.log('======================');
  if (req.method === 'OPTIONS') {
    console.log('SETTING HEADERS');
    res.set({
      'Access-Control-Allow-Origin': 'http://localhost:3006',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'x-my-header-from-front-ololo',
    });
  } */
  next();
});
// app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.options('/endpoint1', (req, res, next) => {
  console.log('OPTIONS');
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3006',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'x-my-header-from-front-ololo',
  });
  next();
})

app.get('/endpoint1', (req, res, next) => {
  console.log('GET REQUEST 1');
  console.log('=============');
  console.log('req.headers', req.headers);
  console.log('*');
  console.log('req.cookies', req.cookies);
  console.log('=============');
  console.log('\n\n');

  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3006',
    'Access-Control-Allow-Credentials': 'true',
    'Vary': 'Origin',
    'X-My-Header-From-Api-Azazaza': 'asdf1024=768',
  });

  res.send({ message: 'HELOOOO' });
});

async function connect() {
  await mongoose.connect('mongodb://localhost:27017/test')
}

connect().catch(err => console.error(err));

const kittySchema = new mongoose.Schema({
  name: String,
  type: String,
  screenshots: [{
    _id: false,
    description: {type: String},
    url: {
      type: String,
      required: true
    },
    thumbnailUrl: {type: String},
  }],
});

function newMediaFile() {
  const url = `https://www.trustradius.com/file${0}`;
  return {
    url: url,
    description: `Description of file ${0}`,
    thumbnail: `${url}_thum`
  };
}

function resetModifiedPaths(model) {
  // Sort of a hack to use internal function like this, but must do this to make
  // mockProduct.modifiedPaths() behave like the document was saved to the db.
  model.$__reset();
  model.isNew = false;
  return model;
}

const Kitten = mongoose.model('Kitten', kittySchema);

const myKitten = new Kitten({
  name: 'Silence',
  type: 'default',
});

myKitten.screenshots = [ newMediaFile(), newMediaFile() ];

// resetModifiedPaths(myKitten);

const attrs = {
  screenshots: [
    Object.assign({}, myKitten.screenshots[0]),
    Object.assign({}, myKitten.screenshots[1])
  ]
}

attrs.screenshots[1].description = 'Modified description';

myKitten.set(attrs);

async function modelSave() {
  await myKitten.save();
}

modelSave().catch(err => { console.error(err) });

console.log('myKitten.modifiedPaths()', myKitten.modifiedPaths());

app.listen(3007, () => {
  console.log('app listening on port 3007');
});

