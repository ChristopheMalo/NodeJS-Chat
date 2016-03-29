/**
 * Realtime Chat application
 * 
 * @author: Christophe Malo
 * @version: 0.1.0
 */
var express = require('express'); // Loads Express.js framework

// Loads the module
var http    = require('http');
var ent     = require('ent'); // For sécurity as PHP htmlentities
var fs      = require('fs');

var application = express();
var server      = http.createServer(application);

var socketio    = require('socket.io').listen(server);

// Loads page index - Route with express
application.get('/', function(request, response)
{
    // Debug - simply test if server runs
    // response.setHeader('Content-Type', 'text/plain');
    // response.end('This home page');
    response.sendfile(__dirname + '/index.html');
});

socketio.sockets.on('connection', function(socket, nickname)
{
    /* Receives nickname of vis*itor,
       stores nickname in session variable, inform other users */
    socket.on('newClient', function(nickname)
    {
        nickname = ent.encode(nickname);
        socket.nickname = nickname;
        socket.broadcast.emit('newClient', nickname);
    });
    
    /* Receives message, retrieves the nickname of the author
       sends the message to other users */
    socket.on('message', function(message)
    {
        message = ent.encode(message);
        socket.broadcast.emit('message', { nickename: socket.nickname, message: message });
    });
});

server.listen(8080);
