var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var allNetNames=[];
var allClients=[];
var fullEntities;
var conexionCounter=true;

app.get('/noderoid', function(req, res){
  console.log('a user try to connect by infront');
});

io.on('connection', function(socket){
  console.log("conexionCounter "+ conexionCounter);
  if(conexionCounter){
    console.log("----------------------------------------------");
    console.log("           x4 socket server enabled           ");
    console.log("----------------------------------------------");
    console.log("--------------------rocks---------------------");
    allNetNames=[];
    allClients=[];
    conexionCounter=false;
  }
  allClients.push(socket);
  console.log("----------------------------------------------");
  console.log('usuario conectado ' + socket.id);
  console.log("numero de usuarios conectados: " + allClients.length);
  
  socket.on('disconnect', function(){
    console.log('usuario desconectado: '+ socket.id);
      var i = allClients.indexOf(socket);
      allClients.splice(i, 1); 
      console.log("numero de usuarios conectados:  " + allClients.length);

      var j = allNetNames.indexOf(socket.id);
      allNetNames.splice(j, 1); 
      
  });

  socket.on('send Entities', function(netName){
     console.log('nuevo netName : ' + netName);
     allNetNames.push(netName);
      console.log("nuermo de NetNames: " + allNetNames.length);
  	 populate();
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function populate(){
	io.emit("populating",allNetNames);

}