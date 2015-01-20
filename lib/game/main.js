ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.levels.NivelUno',
	'plugins.camera',
	'plugins.gamepad',
	'impact.debug.debug' // <- Add this

)
.defines(function(){

var UserId="usuario"+Math.round(Math.random(999)*100);
var LocalPLayer;
MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	gravity: 800,
	
	
	init: function() {

		var entidades;	

		// Initialize your game here; bind keys etc.
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );

		ig.input.bind( ig.GAMEPAD.PAD_LEFT, 'left' );
		ig.input.bind( ig.GAMEPAD.PAD_RIGHT, 'right' );
		ig.input.bind( ig.GAMEPAD.FACE_1, 'jump' );
		ig.input.bind( ig.GAMEPAD.FACE_2, 'shoot' );	
		ig.input.bind( ig.GAMEPAD.FACE_3, 'shoot' );	
		
		
	
		this.loadLevel( LevelNivelUno );
		
		
		socket.on(	'populating', function(allEntities){
   	
   			console.log("full entities broadcasted " + allEntities);
   			for(var i in allEntities){
   					
   				if(allEntities[i]!=socket.io.engine.id){
   					ig.game.spawnEntity("EntityPlayer",2,2);
   				}

   			}

  		});

	},
	



	loadLevel: function( data ) {
		// Remember the currently loaded level, so we can reload when
		// the player dies.
		
		this.currentLevel = data;
		
		

		// Call the parent implemenation; this creates the background
		// maps and entities.
		this.parent( data );
	
		
		this.player.netName=socket.io.engine.id;
		
		
		if(this.player.netName!=null){
			socket.emit("send Entities",this.player.netName);

		}else{
			console.log("no se ha asignado netName");

		}
	
		
		
		
		this.setupCamera();
	},



setupCamera: function() {
		// Set up the camera. The camera's center is at a third of the screen
		// size, i.e. somewhat shift left and up. Damping is set to 3px.		
		this.camera = new ig.Camera( ig.system.width/3, ig.system.height/3, 3 );
		
		// The camera's trap (the deadzone in which the player can move with the
		// camera staying fixed) is set to according to the screen size as well.
    	this.camera.trap.size.x = ig.system.width/10;
    	this.camera.trap.size.y = ig.system.height/3;
		
		// The lookahead always shifts the camera in walking position; you can 
		// set it to 0 to disable.
    	this.camera.lookAhead.x = ig.system.width/6;
		
		// Set camera's screen bounds and reposition the trap on the player
    	this.camera.max.x = this.collisionMap.pxWidth - ig.system.width;
    	this.camera.max.y = this.collisionMap.pxHeight - ig.system.height;
    	this.camera.set( this.player );
	},

	update: function() {
		// Update all entities and backgroundMaps
		
		this.parent();
		this.camera.follow( this.player );
		
		// Add your own, additional update code here
	},
	
	

	draw: function(data) {
		// Draw all entities and backgroundMaps
		this.parent();
		var x = 10,
			y = 10;
			
		// Add your own drawing code here

		this.font.draw( 'Digg Master', x, y, ig.Font.ALIGN.CENTER );
	}
});

function showProps(obj, objName) {

  var result = "";
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
        result += objName + "." + i + " = " + obj[i] + "\n";
    }
  }
  console.log(result);
}


function listAllProperties(o){     
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
		result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
	}
	
	console.log(result); 
}

var findObjectByLabel = function(obj, label) {
    if(obj.label === label) { return obj; }
    for(var i in obj) {
        if(obj.hasOwnProperty(i)){
            var foundLabel = findObjectByLabel(obj[i], label);
            if(foundLabel) { return foundLabel; }
        }
    }
    return null;
};

window.addEventListener('resize', function(){
	// If the game hasn't started yet, there's nothing to do here
	if( !ig.system ) { return; }
	
	// Resize the canvas style and tell Impact to resize the canvas itself;
	canvas.style.width = window.innerWidth + 'px';
	canvas.style.height = window.innerHeight + 'px';
	ig.system.resize( window.innerWidth * scale, window.innerHeight * scale );
	
	// Re-center the camera - it's dependend on the screen size.
	if( ig.game && ig.game.setupCamera ) {
		ig.game.setupCamera();
	}
	
	// Also repositon the touch buttons, if we have any
	if( window.myTouchButtons ) {
		window.myTouchButtons.align(); 
	}
}, false);

// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2

ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
