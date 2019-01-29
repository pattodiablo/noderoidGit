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
    console.log("                                              ");
    conexionCounter=false;
    
    while(allClients.length > 0) {
    allClients.pop();
}
  }
  allClients.push(socket);
  console.log("-----------------conexion----------------------");
  console.log("                                              ");
  console.log('usuario conectado ' + socket.id);
  console.log("numero de usuarios conectados: " + allClients.length);
  
  

    socket.on('disconnect', function(){
    console.log("---------------desconeccion-------------------");
    console.log("                                              ");
    var i = allClients.indexOf(socket);
    allClients.splice(i, 1); 
    console.log('usuario desconectado: '+ socket.id);
    console.log("numero de usuarios conectados:  " + allClients.length);
    console.log("numero de NetNames:  " + allNetNames.length);
    io.emit("deletePlayer",socket.id);
    
      
  });

  socket.on('send Entities', function(netName){

        for(var i in allClients){ //verifica si esta conectado 
          if(allClients[i].id==netName){
             console.log('nuevo netName : ' + netName);
             allNetNames.push(netName);
             console.log("numero de NetNames: " + allNetNames.length);
             populateNewPlayer(netName);
          }

        };
    
  });


      socket.on('playerMove', function(x,y,nombre,flip){

          socket.broadcast.emit("entityMoved",x,y,nombre,flip);
         
      });
    
  socket.on('moveLeft', function(nombre,animacion){
    
         socket.broadcast.emit("entityPressed",1,nombre,animacion);
      });

  socket.on('moveRight', function(nombre,animacion){
         
         socket.broadcast.emit("entityPressed",2,nombre,animacion);
      });

socket.on('notMoved', function(nombre,animacion){
       
         socket.broadcast.emit("entityPressed",0,nombre,animacion);
      });

socket.on('jumping', function(nombre,animacion){
         
         socket.broadcast.emit("entityPressed",3,nombre,animacion);
      });

   socket.on('ask forPlayers', function(netName){
     console.log("----------------------------------------------");
     console.log('asking for players ');
     populate(netName);
  });


});

http.listen(8080, function(){
  console.log('listening on *:8080');
});

function populate(netName){
  for(var i in allClients){
    if(allClients[i]!=netName){
       populateNewPlayer(allClients[i].id);
    }
   
  }
	 io.emit("populating",allNetNames);
  
}

function populateNewPlayer(singlePlayer){
    io.emit("addSinglePlayer",singlePlayer);  
}