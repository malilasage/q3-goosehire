"use strict";

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const request = require('request');
const rpn = require('request-promise-native');
const cheerio = require('cheerio');

require('dotenv').config();

const port = 3007;

if (process.env.NODE_ENV !== 'test') {
  const logger = require('morgan');
  app.use(logger('dev'));
}

mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://127.0.0.1:31109/heroku_f95771rw');

mongoose.connection.on('error', () => {console.log('mongo connection failed')})
  .once('open', () => {console.log('mongo is lit')});

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
app.use('/skillsets', require('./routes/skillsets'));
app.use('/searches', require('./routes/searches'));

app.use(express.static(path.join(__dirname, '/../', 'node_modules')))

//these need to be modified
// app.use('/api/posts', require('./routes/searches'));
// app.use('/api/posts', require('./routes/skillsets'));
// app.use('/api/posts', require('./routes/users'));


app.get('/indeed', (req, res) => {
  let searchInfo = {
    skills: encodeURIComponent(req.query.skills),
    location: encodeURIComponent(req.query.location),
    title: encodeURIComponent(req.query.title)
  };

  //TODO: Do we need to get the useragent dynamically from the browser for the search string below? -- CDH

  const newUrl = `http://api.indeed.com/ads/apisearch?publisher=331559334344654&q=${searchInfo.skills}&l=${searchInfo.location}&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=localhost:3000&useragent=Mozilla%2F5.0+(Macintosh%3B+Intel+Mac+OS+X+10_11_6)+AppleWebKit%2F537.36+(KHTML%2C+like+Gecko)+Chrome%2F55.0.2883.95+Safari%2F537.36&v=2&format=json`;

  return request(newUrl).pipe(res);
});

app.get('/indeedSingleJob', (req, res) => {
  return request(req.query.url, (error, response, html) => {
    let $ = cheerio.load(html);
    let jobDeets = $('#job_summary').html();

    res.send(jobDeets);
  })
})

app.get('/', (req, res) => {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.use('*', function(req, res, next) {
  res.sendFile('index.html', {root: path.join(__dirname, 'public')});
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
