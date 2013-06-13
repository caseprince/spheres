define(
	[
		'js/view.js',
		"js/lib/tween.min.js",
		"js/lib/three.min.js"
	],

	function(view, TWEEN) {

		return view.extend({

			title: "Graph",

			intro: function(){

				var graphScale = 300;

				var minD = 0; maxD = 0;
				var minW = 0; maxW = 0;
				var minV = 0; maxV = 0;

				for ( var i = 0; i < this.Spheres.length; i++ ) {
					if(this.Spheres[i].d > maxD){
						maxD = this.Spheres[i].d;
					}else if(this.Spheres[i].d < minD){
						minD = this.Spheres[i].d;
					}

					if(this.Spheres[i].w > maxW){
						maxW = this.Spheres[i].w;
					}else if(this.Spheres[i].w < minW){
						minW = this.Spheres[i].w;
					}

					if(this.Spheres[i].v > maxV){
						maxV = this.Spheres[i].v;
					}else if(this.Spheres[i].v < minV){
						minV = this.Spheres[i].v;
					}
				}

				var cD = maxD - minD;
				var cW = maxW - minW;
				var cV = maxV - minV;

				for (var i = 0; i < this.Spheres.length; i++ ) {

					var graphX = ((this.Spheres[i].d - minD) / cD) * graphScale;
					graphX -= graphScale * 0.5;

					var graphY = ((this.Spheres[i].v - minV) / cV) * graphScale * 0.5;
					graphY -= graphScale * 0.5 * 0.5;

					var graphZ = ((this.Spheres[i].w - minW) / cW) * graphScale * 0.5;
					graphZ -= graphScale * 0.5 * 0.2;

					var x = graphX;
					var y = graphY;
					var z = graphZ;

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
