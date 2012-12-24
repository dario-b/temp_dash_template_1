// Load the http module to create an http server.
var http = require('http');
var url  = require('url'); 
var fs   = require('fs');
var fullpath = require('path');
var receiver = require('./receiver.js');

var ipaddr = "192.168.1.133";
var port = 8000;



var server = http.createServer(function (request, response) {
var path = url.parse(request.url).pathname;
var fname = fullpath.basename(path);
    
  if(path == '/') {
    index = fs.readFile(__dirname + '/html/index.html',  function(error,data) {
        if (error) {
            response.writeHead(500);
            return response.end("Error: unable to load index.html");
        }
                
        response.writeHead(200,{'Content-Type': 'text/html'});
        response.end(data);
    });

  } else if (request.url.indexOf('.html') != -1) {
      
      fs.readFile(__dirname + "/html/" + fname, function (err, data) {
        if (err) console.log(err);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });

  } else if(request.url.indexOf('.css')!=-1) {

      fs.readFile(__dirname + "/html/css/" + fname, function (err, data) {
        if (err) console.log(err);
//        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });

 
  } else if(request.url.indexOf('.js')!=-1) {
    
      fs.readFile(__dirname + "/html/js/" +  fname, function (err, data) {
        if (err) console.log(err);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });

  } else if(request.url.indexOf('.io')!=-1) {

      fs.readFile(__dirname + "/html/js/" + fname, function (err, data) {
        if (err) console.log(err);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });


  } else if((request.url.indexOf('.png')!=-1) || (request.url.indexOf('.jpg')!=-1) )   {
 
     fs.readFile(__dirname + "/html/images/" + fname, function (err, data) {
        if (err) console.log(err);
//        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write(data);
        response.end();
      });

  } else {
     response.writeHead(404);
     response.end("Error: 404 - File not found.");
  }
});

server.listen(port,ipaddr);

var io = require('socket.io').listen(server);

// Put a friendly message on the terminal
console.log("Server running on " + ipaddr + ":" + port);
console.log(receiver.sensor_value);

//=== WEBSOCKETS==

io.sockets.on('connection', function (socket) {
 
  console.log("Client has connected");
    
  setInterval(function() {
    var num = Math.floor(Math.random() * (100 - 1) + 1);
    socket.emit('sensor',{data: 1112});
    console.log("Sent");
  }, 5000);

  
});

