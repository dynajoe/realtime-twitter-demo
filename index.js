var io = require('socket.io'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = io.listen(server),
    path = require('path');

var twitter = require('ntwitter');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var twit = new twitter({
   consumer_key        : 'c3NNk6syXwUqbgwKirtK1w',
   consumer_secret     : 'PBR0IHNxp75W2LV2ThRqy1NeJCepJRMhlWJgQBEgk',
   access_token_key    : '237468953-QaRypb0kOJ0wG3a9f1kHuyVvmIbbawU2axOPJW7S',
   access_token_secret : 'tAAYDfR7EWDD6FVE5mvVedcISThv5LB3t6RTkBwt0'
});
   
var term = "kansas city";

twit.stream('statuses/filter',{ track: term}, function (stream) {
   stream.on('data', function (data) {
      io.sockets.emit('data', {term: term, data: data});
   });  
});

app.get('/', function (req, res) {
   res.render('index');
});

server.listen(3000);
