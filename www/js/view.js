define(
	[
		"jquery",
		"three",
		"js/lib/tween.min.js"
	],

	function($, THREE, TWEEN) {

		var View = Class.extend({

			//var position, material, particle;	
			particle: null,
			title: null,
			scene: null,
			main: null,

			init: function(scene, Spheres, main){
				this.scene = scene;
				//console.log(this.scene);
				this.Spheres = Spheres;
				this.main = main;
			},
			intro: function(){
				console.log("intro: "+this.title);
			},
			step: function(){

			},
			startTween: function(i, target, position){
				var that = this;
				if(i === 0){
					new TWEEN.Tween( target )
					.delay( 0 )
					.to( position, 1000 )
					.easing( TWEEN.Easing.Quartic.InOut )
					.start()
					.onComplete(function(){						
						that.onTransitionComplete();
					});

				}else{
					new TWEEN.Tween( target )
					.delay( 0 )
					.to( position, 1000 )
					.easing( TWEEN.Easing.Quartic.InOut )
					.start()
				}
			},
			onTransitionComplete: function(){
				console.log("view.onTransitionComplete");
				transitioning = false;
			}
		});

		return View;
});
