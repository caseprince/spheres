define(
	[
		'js/view.js',
		"js/lib/tween.min.js"
	],

	function(view, TWEEN) {

		return view.extend({

			title: "Orrery",

			intro: function(){

				var angle = 0;
				var totalDiameter = 0;
				var prevDiameter = 0;

				transitioning = true;

				for ( var i = 0; i < this.Spheres.length; i++ ) {
					//console.log(this.Spheres[i].d);

					if(this.Spheres[i].d > 13.5){
						if(prevDiameter > 0){
							totalDiameter += prevDiameter;// * 0.5;
						}
						
						if(i > 0){
							totalDiameter += this.Spheres[i].d * 0.5;
						}
						angle -= 1.5;
					}else{
						totalDiameter += 1.7;
					}

					var x = totalDiameter;
					var z = 0;

					var cosRY = Math.cos(angle);
					var sinRY = Math.sin(angle);
					var tempz = z;
					var tempx = x;

					x = (tempx * cosRY) + (tempz * sinRY);
					z = (tempx * -sinRY) + (tempz * cosRY);
					y = 0;

					//this.Spheres[i].collisionSphere.position = {x: x, y: 0, z: z};
					this.startTween(i, this.Spheres[i].collisionSphere.position, {x: x, y: 0, z: z});

					//console.log(this.Spheres[i]);
					prevDiameter = this.Spheres[i].d;
					angle -= 1.3;

				}
			},
			step: function(){
				if(!transitioning){
					for ( var i = 0; i < this.Spheres.length; i++ ) {
						var angle = (this.Spheres[i].w) / 1000000;
						angle += 0.001;
						rotatePointAroundY(this.Spheres[i].collisionSphere, angle);
					}
				}
			}
		});

		function rotatePointAroundY(object, angle) {
			var x = object.position.x;
			var z = object.position.z;

			var cosRY = Math.cos(angle);
			var sinRY = Math.sin(angle);
			var tempz = z;
			var tempx = x;

			x = (tempx * cosRY) + (tempz * sinRY);
			z = (tempx * -sinRY) + (tempz * cosRY);
			object.position.x = x;
			object.position.z = z;
		}

	}
);
