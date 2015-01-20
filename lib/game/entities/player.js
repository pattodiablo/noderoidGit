	ig.module(
		'game.entities.player'
	)
	.requires(
		'impact.entity'
		
	)
	.defines(function(){

	EntityPlayer = ig.Entity.extend({
		
		// The players (collision) size is a bit smaller than the animation
		// frames, so we have to move the collision box a bit (offset)
		size: {x: 18, y: 25},
		offset: {x: 5, y: 5},
		
		maxVel: {x: 400, y: 800},
		friction: {x: 800, y: 0},
		
		type: ig.Entity.TYPE.A, // Player friendly group
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


		
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			console.log("EntityPlayerSpaw");
			// Add the animations
			this.addAnim( 'idle', 1, [7,6] );
			this.addAnim( 'run', 0.1, [5,4,3,2,1,0] );
				
			// Set a reference to the player on the game instance
			ig.game.player = this;
		},
		
		
		update: function() {
			
			var accel = this.standing ? this.accelGround : this.accelAir;
			
			if( ig.input.state('left') ) {
				this.accel.x = -accel;
				this.flip = false;
			}
			else if( ig.input.state('right') ) {
				this.accel.x = accel;
				this.flip = true;
			}
			else {
				this.accel.x = 0;
			}

	// jump
			if( this.standing && ig.input.pressed('jump') ) {
				this.vel.y = -this.jump;
				
			}

			if( this.vel.x != 0 ) {
				this.currentAnim = this.anims.run;
			}
			else {
				this.currentAnim = this.anims.idle;
			}

			this.currentAnim.flip.x = this.flip;
			this.parent();

		},

		kill: function() {
			this.parent();

			// Reload this level
			ig.game.reloadLevel();
		},

		giveCoins: function( amount ) {
			// Custom function, called from the EntityCoin
			this.coins += amount;
		},

		handleMovementTrace: function( res ) {

			

			this.standing = false;
			
			if( res.collision.y ) {
				if( this.bounciness > 0 && Math.abs(this.vel.y) > this.minBounceVelocity ) {
					this.vel.y *= -this.bounciness;			
				}
				else {
					if( this.vel.y > 0 ) {
						this.standing = true;
					}
					this.vel.y = 0;
				}
			}
			if( res.collision.x ) {
				if( this.bounciness > 0 && Math.abs(this.vel.x) > this.minBounceVelocity ) {
					this.vel.x *= -this.bounciness;				
				}
				else {
					this.vel.x = 0;
				}
			}
			if( res.collision.slope ) {
				var s = res.collision.slope;
				
				if( this.bounciness > 0 ) {
					var proj = this.vel.x * s.nx + this.vel.y * s.ny;
					
					this.vel.x = (this.vel.x - s.nx * proj * 2) * this.bounciness;
					this.vel.y = (this.vel.y - s.ny * proj * 2) * this.bounciness;
				}
				else {
					var lengthSquared = s.x * s.x + s.y * s.y;
					var dot = (this.vel.x * s.x + this.vel.y * s.y)/lengthSquared;
					
					this.vel.x = s.x * dot;
					this.vel.y = s.y * dot;
					
					var angle = Math.atan2( s.x, s.y );
					if( angle > this.slopeStanding.min && angle < this.slopeStanding.max ) {
						this.standing = true;
					}
				}
			}
			
			this.pos = res.pos;
			


		},
	});


	});

