define(
	[
		'js/view.js',
		"js/lib/tween.min.js"
	],

	function(view, TWEEN) {

		return view.extend({

			title : "Graph",
			graphScale : {x:300, y:150, z:100},

			intro: function(){

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

					var graphX = ((this.Spheres[i].d - minD) / cD) * this.graphScale.x;
					graphX -= this.graphScale.x * 0.5;

					var graphY = ((this.Spheres[i].v - minV) / cV) * this.graphScale.y;
					graphY -= this.graphScale.y * 0.5;

					var graphZ = ((this.Spheres[i].w - minW) / cW) * this.graphScale.z;
					graphZ -= this.graphScale.z * 0.5;

					var x = graphX;
					var y = graphY;
					var z = graphZ;

					//this.Spheres[i].collisionSphere.position = {x: x, y: y, z: z};
					/*new TWEEN.Tween( this.Spheres[i].collisionSphere.position )
						.delay( 0 )
						.to( { x: x, y: y, z: z }, 1000 )
						.easing( TWEEN.Easing.Quartic.InOut )
						.start();*/

					this.startTween(i, this.Spheres[i].collisionSphere.position, {x: x, y: y, z: z});
				}

			


			},

			onTransitionComplete: function(){
				
				console.log("graph.onTransitionComplete");

				this.main.add3dText({
					text: 'Diameter  -------------------->',
					position: {x:this.graphScale.x * -0.5, y:this.graphScale.y * -0.5, z:0}
				});

				this.main.add3dText({
					text: '   Density  ------------->',
					rotation: {x:0, y:0, z:Math.PI/2},
					position: {x:this.graphScale.x * -0.5, y:this.graphScale.y * -0.5, z:0}
					
				});

				this.main.add3dText({
					text: '    Weight  <------------',
					rotation: {x:0, y:Math.PI/2, z:0},
					position: {x:this.graphScale.x * -0.5, y:this.graphScale.y * -0.5, z:0}
					
				});

				this._super();
			}

		});


	}
);
