var io = require('socket.io'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = io.listen(server),
    path = require('path'),
    twitter = require('ntwitter'),
    excluded = require('./excluded.json');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var twit = new twitter(require('./twitter-config.json'));
   
var term = "sharkweek";

twit.stream('statuses/filter',{ track: term}, function (stream) {
   stream.on('data', function (data) {
      for (var i = 0; i < excluded.length; i++) 
      {
         if (data.text.toLowerCase().indexOf(excluded[i]) > -1) 
            return;
      }

      io.sockets.emit('data', {term: term, data: data});
   });  
});

app.get('/', function (req, res) {
   res.render('index');
});

server.listen(4000);
