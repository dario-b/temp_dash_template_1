/*  receiver.js
 *  spawns NRF24l01+ receiver written in C++ as a child process
 *  Reads stdout from child process and parse string as sensor_reading
 *  Verify that in child process stdout is unbuffered (not by default)
*/
var spawn = require('child_process').spawn;
var child = spawn('python' ,['-u', './loop.py'],{
	stdio		: ['pipe', 'pipe', 'pipe']
});

//Define log file
var logfile = "./node_recv.log";
var fs    = require('fs');
var out = fs.createWriteStream(logfile);
var currentdate = new Date();

//Define Sensors and addresses
var sensors = {"AABBCCDDEE":"Dnevni Boravak","FFGGHHIIJJ":"Spavaca_Soba"};


//Process Messages from receivers by parsing stdout from child process
child.stdout.on('data', function (data) {
	
	var recv_string = data.toString(); //string received via stdout
	recv_string = recv_string.trim();  //remove whitespaces from beginning and end
	
	if(recv_string.substring(0,5) == "Recv:")  //check if string beginns with: "Recv:"
	{  
		var sensor_reading_string = recv_string.replace('Recv:',''); //Remove "Recv from string"
		var sensor_reading = sensor_reading_string.split(",");				 //Extract string values to array
		
		//sensor address and name
		var sensor_address = sensor_reading[0];	 //sensor_address
		for(key in sensors)
		{
			if(key == sensor_address)
			{
  				var sensor_name = sensors[key];  		 //sensor_name
			
			}
		}
		var sensor_time = sensor_reading[1];
		var sensor_counter = sensor_reading[2];
		var sensor_value = sensor_reading[3];	//sensor_value;

		socket.emit('sensor',{data: sensor_value});
		//Write to logfile
		time_now = currentdate.getDay() + "/"+currentdate.getMonth() + "/" + currentdate.getFullYear() + " @ " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
		out.write(time_now + " >> " + sensor_reading.toString() + '\n');
		console.log("Sensor Node: " + sensor_name + ", Sensor Address: " + sensor_address + ", Sensor Value: " + sensor_value);	
	} 
	else 
	{
		//some code
	}
	
})

child.on('exit', function(){
	
	console.log("Exit from child");
})

//close file
out.end;


