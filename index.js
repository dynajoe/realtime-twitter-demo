var io = require('socket.io'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = io.listen(server, { log: false }),
    path = require('path'),
    twitter = require('twit'),
    excluded = require('./data/excluded.json'),
    _ = require('lodash');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var T = new twitter(require('./twitter-config.json'));

var currentStream = null;

io.on('connection', function (socket) {
  socket.on('term', function (newTerm) {
    startStream(newTerm);
  });
});

var startStream = function (term) {
  if (currentStream) {
    currentStream.stop();
  }

  currentStream = T.stream('statuses/filter', { track: term });

  currentStream.on('tweet', function (data) {
    var loweredText = data.text.toLowerCase();

    var containsFilteredWord = _.any(excluded, function (w) {
      return loweredText.indexOf(w) > -1;
    });

    if (containsFilteredWord) {
      return;
    }

    io.sockets.emit('data', { term: term, data: data });
  });
};

app.get('/', function (req, res) {
   res.render('index');
});

server.listen(4000);
