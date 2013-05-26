define(
	[
		'js/view.js'
	],

	function(view) {

		return view.extend({

			title: "Sine Grid",
			
			theta: 0,
			theta2: 0,

			/*init: function(scene, Spheres){
				this.scene = scene;
				this.Spheres = Spheres;
			},*/
			intro: function(){

				var sq = Math.floor(Math.sqrt(this.Spheres.length));
				var row = 0;
				var col = 0;
				var spacing = 30;

				transitioning = true;

				for ( var i = 0; i < this.Spheres.length; i++ ) {

					var x = col * spacing;
					var z = row * spacing;

					x -= sq / 2 * spacing;
					z -= sq / 2 * spacing;

					var y = Math.sin(x + this.theta) * 10;
						y += Math.sin(z + this.theta2) * 14;

					//this.Spheres[i].collisionSphere.position = {x: x, y: 0, z: z};
					this.startTween(i, this.Spheres[i].collisionSphere.position, {x: x, y: y, z: z});

					col ++;
					if(col > sq){
						col = 0;
						row ++;
					}

				}

			},
			step: function(){
				if(!transitioning){
					for ( var i = 0; i < this.Spheres.length; i++ ) {

						var x = this.Spheres[i].collisionSphere.position.x;
						var z = this.Spheres[i].collisionSphere.position.z;
						var y = Math.sin(x + this.theta) * 10;
						y += Math.sin(z + this.theta2) * 14;

						this.Spheres[i].collisionSphere.position.y = y;

					}

					this.theta += 0.03;
					this.theta2 += 0.02;
				}
			}
		});

	}
);
