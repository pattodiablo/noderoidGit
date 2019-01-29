ig.module(
	'game.entities.spikesLow'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntitySpikesLow = ig.Entity.extend({
	size: {x: 28, y: 27},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.NEVER,
	
	animSheet: new ig.AnimationSheet( 'media/spikeLow.png', 28, 27 ),
	sfxCollect: new ig.Sound( 'media/sounds/coin.*' ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 0.05, [0,1] );
		this.addAnim( 'touched', 1, [1] );

	},
	
	
	update: function() {		
		// Do nothing in this update function; don't even call this.parent().
		// The coin just sits there, isn't affected by gravity and doesn't move.

		// We still have to update the animation, though. This is normally done
		// in the .parent() update:
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