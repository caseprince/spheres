define(
	[
		"jquery",
		"three"
	],

	function($, THREE) {

		var sphereScale = 0.1;

		var Sphere = Class.extend({

			//var position, material, particle;	
			particle:null,
			scale:1,

			init: function(data, scene){

				//basic data
				this.title = data.title;
				this.src = data.src;
				this.d = parseFloat(data.d);
				this.w = parseFloat(data.w);
				this.position = data.position;

				//THREE particle
				this.material = new THREE.ParticleBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'img/400/'+this.src ) } );
				this.particle = new THREE.Particle( this.material );

				//console.log(this.particle);

				this.particle.position.x = this.position.x;//Math.random() * 200 - 100;
				this.particle.position.y = this.position.y;//Math.random() * 200 - 100;
				this.particle.position.z = this.position.z;//Math.random() * 2000 - 1000;
				//particle.rotation.z = Math.random() * 2000 - 1000;
				this.particle.scale.x = this.particle.scale.y = this.d * 0.04 * sphereScale;
				this.particle.castShadow = true;

				scene.add( this.particle );



				var d = this.particle.scale.x * 200;

				var collisionSphere = new THREE.Mesh(new THREE.SphereGeometry(d, 6, 6), new THREE.MeshBasicMaterial({color:0xffffff}));
				var vector = new THREE.Vector3(this.particle.position.x, this.particle.position.y, this.particle.position.z);
				collisionSphere.position = vector;
				//collisionSphere.rotation.x = Math.PI * .5;
				collisionSphere.visible = false;
				scene.add(collisionSphere);

				console.log(collisionSphere);

				//Sphere.particle = particle;

				collisionSphere.Sphere = this;
				this.collisionSphere = collisionSphere;

			},
			dance: function(){
				//return this.dancing;
			}
		});

		//console.log(Sphere);

		return Sphere;
});
