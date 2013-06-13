define(
	[
		'js/view.js',
		"js/lib/tween.min.js"
	],

	function(view, TWEEN) {

		return view.extend({

			title: "Random",

			intro: function(){

				var ranScale = 200;

				for ( var i = 0; i < this.Spheres.length; i++ ) {

					var x = (Math.random() * ranScale) - (ranScale * 0.5);
					var y = (Math.random() * ranScale) - (ranScale * 0.5);
					var z = (Math.random() * ranScale) - (ranScale * 0.5);

					//this.Spheres[i].collisionSphere.position = {x: x, y: y, z: z};
					new TWEEN.Tween( this.Spheres[i].collisionSphere.position )
						.delay( 0 )
						.to( { x: x, y: y, z: z }, 1000 )
						.easing( TWEEN.Easing.Quartic.InOut )
						.start();
				}
			}

		});


	}
);
