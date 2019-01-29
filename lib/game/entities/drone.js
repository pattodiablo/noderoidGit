ig.module(
	'game.entities.drone'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityDrone = ig.Entity.extend({
	size: {x: 62, y: 31},
	
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,
	
	animSheet: new ig.AnimationSheet( 'media/drones.png', 62, 31 ),
	sfxCollect: new ig.Sound( 'media/sounds/coin.*' ),
	oscilacion: 0.2,
	
	

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.02, [0,1,2] );
		this.addAnim( 'touched', 1, [1] );
		
		myVar = setInterval(this.changeFlight, 300);
		executer=1;
		
	},
	
	changeFlight: function(){
			console.log("entro a change");
			executer*=-1;

			console.log(executer);
			
	},
	update: function() {		
		// Do nothing in this update function; don't even call this.parent().
		// The coin just sits there, isn't affected by gravity and doesn't move.

		// We still have to update the animation, though. This is normally done
		// in the .parent() update:
			
		this.pos.y-=executer*this.oscilacion;
		this.currentAnim.update();
		this.check();

	},
	
	
	check: function( other ) {
		// The instanceof should always be true, since the player is
		// the only entity with TYPE.A - and we only check against A.
		
     

		if( other instanceof EntityPlayer ) {
			
		}else{
			this.currentAnim = this.anims.idle
		}
	}
});

});