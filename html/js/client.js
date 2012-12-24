var socket = io.connect('http://192.168.1.169:8000');

socket.on('sensor',function(data2) {
     value = data2.data[1];

     if(data2.data[0] == "Dnevni_Boravak")
     {
     	$('#ts1').text(value);
     	
     } 
     else if(data2.data[0] == "Spavaca_Soba")
     {
     	$('#ts2').text(value);
     }
});




