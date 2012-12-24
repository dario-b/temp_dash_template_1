// Load the http module to create an http server.
var http = require('http');
var url  = require('url'); 
var fs   = require('fs');
var fullpath = require('path');


var ipaddr = "192.168.1.133";
var port = 8000;


/*  receiver.js
 *  spawns NRF24l01+ receiver written in C++ as a child process
 *  Reads stdout from child process and parse string as sensor_reading
 *  Verify that in child process stdout is unbuffered (not by default)
*/
var spawn = require('child_process').spawn;
var child = spawn('python' ,['-u', './loop.py'],{
  stdio   : ['pipe', 'pipe', 'pipe']
});

//Define log file
var logfile = "./node_recv.log";
var fs    = require('fs');
var out = fs.createWriteStream(logfile);
var currentdate = new Date();

//Define Sensors and addresses
var sensors = {"AABBCCDDEE":"Dnevni_Boravak","FFGGHHIIJJ":"Spavaca_Soba"};




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


//=== WEBSOCKETS==

io.sockets.on('connection', function (socket)
{
 
  console.log("Client has connected");
    
  //Process Messages from receivers by parsing stdout from child process
  child.stdout.on('data', function (data) 
  {
    
    var recv_string = data.toString(); //string received via stdout
    recv_string = recv_string.trim();  //remove whitespaces from beginning and end
    
    if(recv_string.substring(0,5) == "Recv:")  //check if string beginns with: "Recv:"
    {  
      var sensor_reading_string = recv_string.replace('Recv:',''); //Remove "Recv from string"
      var sensor_reading = sensor_reading_string.split(",");         //Extract string values to array
      
      //sensor address and name
      var sensor_address = sensor_reading[0];  //sensor_address
      for(key in sensors)
      {
        if(key == sensor_address)
        {
            var sensor_name = sensors[key];      //sensor_name
        
        }
      }
      var sensor_counter = sensor_reading[1];
      var sensor_value = sensor_reading[2]; //sensor_value;

      sensor_data = [sensor_name,sensor_value];

      socket.emit('sensor',{data: sensor_data});
      //Write to logfile
      time_now = currentdate.getDay() + "/"+currentdate.getMonth() + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
      out.write(time_now + " >> " + sensor_reading.toString() + '\n');
      console.log("Sensor Node: " + sensor_name + ", Sensor Address: " + sensor_address + ", Sensor Value: " + sensor_value); 
    

      //close file
      out.end;
    
    }
   
  });
  
  socket.on('disconnect', function()
  {
    //Client has disconnected
    console.log("Client exiting..");
     delete io;
  });

});












