/**
 * Real-time Tchat application JS
 *
 * @author: Christophe Malo   
 */
// Connect to socket.io
var socket = io.connect('http://localhost:8080');

// Asks nickname, sends to the server and displays on page title
var nickname = prompt('What is your nickname?');
socket.emit('newClient', nickname);
document.title = nickname + ' - ' + document.title;

// When receives messge, insert the mesasge in the page
socket.on('message', function(data) {
    insertMessage(data.nickname, data.message);
});

// When new client connects, displays the information
socket.on('newClient', function(nickname) {
    $('#tchat').prepend('<p><em>' + nickname + ' joins tchat !</em></p>');
});

// When the form is submitted, the message is transmitted and is displayed on the page
$('#form-tchat').submit(function () {
    var message = $('#message').val();
    socket.emit('message', message); // sends message to all other clients connected
    insertMessage(nickname, message); // Displays the message of the sender (in his tchat area)
    $('#message').val('').focus(); // Empty the tchat area and put the focus on it
    return false; // Blocks the classic sending of the form
});

// Add message in the page
function insertMessage(nickname, message) {
    $('#tchat').prepend('<p><strong>' + nickname + '</strong> ' + message + '</p>');
}
