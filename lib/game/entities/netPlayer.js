	ig.module(
		'game.entities.netPlayer'
	)
	.requires(
		'impact.entity'
		
	)
	.defines(function(){

	EntitynetPlayer = ig.Entity.extend({
		
		// The players (collision) size is a bit smaller than the animation
		// frames, so we have to move the collision box a bit (offset)
		size: {x: 18, y: 25},
		offset: {x: 5, y: 5},
		
		maxVel: {x: 400, y: 800},
		friction: {x: 800, y: 0},
		
		type: ig.Entity.TYPE.B, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		animSheet: new ig.AnimationSheet( 'media/player.png', 30, 30 ),	
		
		health: 3,

		// These are our own properties. They are not defined in the base
		// ig.Entity class. We just use them internally for the Player
		flip: true,
		accelGround: 300,
		accelAir: 300,
		jump: 300,	
		maxHealth: 3,
		coins: 0,
		netName:"default", //su nombre será cambiado posteriormente en main
		nettimer: 0,
		aceleracion:0,

		moveLeft:function(){
				this.accel.x = -this.aceleracion;
				this.flip = false	;
					
		},

		moveRight:function(){
				this.accel.x = this.aceleracion;
				this.flip = true;
				
		},

		notMoved:function(){

				this.accel.x = 0;
				
				
		},
		
		jumping:function(){

				this.vel.y = -this.jump;
				socket.emit('jumping',this.netName);	
		},
		
		init: function( x, y, nombre ) {
			var positionx=0;
			var positiony;
			this.netName=nombre;
			this.parent( x, y, nombre );
			console.log("Entity netPlayer " + nombre+" Spaw");
			
			this.addAnim( 'idle', 1, [7,6] );
			this.addAnim( 'run', 0.1, [5,4,3,2,1,0] );
				
			// Set a reference to the player on the game instance
			ig.game.player = this;


		},
		

		update: function() {
			
			this.aceleracion = this.standing ? this.accelGround : this.accelAir;
			this.parent();

		},

		
	});


	});

