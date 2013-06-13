define(
	[
		'js/view.js',
		'js/lib/Box2dWeb-2.1.a.3.js'
	],

	function(view, Box2D, THREE) {

		//

		return view.extend({

			title: "Box2d",
			transitioning: false,

			time_last_run: null,

			delta: 0,
			
			intro: function(){

				var ranScale = 200;

				for ( var i = 0; i < this.Spheres.length; i++ ) {

					var x = (Math.random() * ranScale) - (ranScale * 0.5);
					var y = (Math.random() * ranScale) - (ranScale * 0.5);
					var z = 0;

					//this.Spheres[i].collisionSphere.position = {x: x, y: y, z: z};
					transitioning = true;
					this.startTween(i, this.Spheres[i].collisionSphere.position, {x: x, y: y, z: z});

					//this.main.getScene();

				}
			},
			onTransitionComplete: function(){
				this.buildBox2dScene();
				this._super();
			},
			step: function(){
				if(!transitioning){
					this.box2d();
				}
			},

			box2d: function(){

				//if ( !state ) return;

				var delta, now = (new Date()).getTime();

				if ( this.time_last_run ) {
					delta = ( now - this.time_last_run ) / 1000;
				} else {
					delta = 1 / 60;
				}
				this.time_last_run = now;

				// delta += 1;//.01;
				//$("#debug").html("delta: "+delta);
				if(delta > 0.02){
					delta = 0.02;
				}

				

				this.world.Step(
					delta, // double the speed of the simulation
					3,        // velocity iterations
					3        // position iterations
				);
				this.world.ClearForces();

				// Update the scene objects
				var object = this.world.GetBodyList(), mesh, position;
				while ( object ) {
					mesh = object.GetUserData();

					if ( mesh ) {
						// Nice and simple, we only need to work with 2 dimensions
						position = object.GetPosition();
						mesh.position.x = position.x;
						mesh.position.y = -position.y;

						//console.log(mesh);

						// GetAngle() function returns the rotation in radians
						mesh.rotation.z = object.GetAngle();
					}

					object = object.GetNext(); // Get the next object in the scene
				}
/*
				*/
			},

			world: null,

			buildBox2dScene: function(){

				console.log(Box2D);

				// Create the physics world
				this.world = new Box2D.Dynamics.b2World(
					new Box2D.Common.Math.b2Vec2( 0, 100 ), // Gravity
					true                  // Allow objects to sleep
				);
	
				var gf = this.makeBox2dStaticRect(0, 100, 230, 5);
				ground = gf.m_body
				this.makeBox2dStaticRect(-100, 0, 5, 230);
				this.makeBox2dStaticRect(100, 0, 5, 230);

				this.main.box2dStuff();
/*
				//setup debug draw
				var debugDraw = new b2DebugDraw();
				debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
				debugDraw.SetDrawScale(2);
				debugDraw.SetFillAlpha(0.5);
				debugDraw.SetLineThickness(10.0);
				debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
				console.log(debugDraw);
				world.SetDebugDraw(debugDraw);

				//plane = new THREE.Plane().setFromNormalAndCoplanarPoint( new THREE.Vector3(0, 0, -1 ), pos );

				var ambientLight = new THREE.AmbientLight( 0x555555 );
				scene.add( ambientLight );*/

				for ( var i = 0; i < this.Spheres.length; i++ ) {
					//box 2d:
					// Create a fixture definition
					//  `density` represents kilograms per meter squared.
					//        a denser object will have greater mass
					//    `friction` describes the friction between two objects
					//    `restitution` is how much "bounce" an object will have
					//        "0.0" is no restitution, "1.0" means the object won't lose velocity

					var Sphere = this.Spheres[i];

					fixDef = new Box2D.Dynamics.b2FixtureDef();
					var den = Math.round(Sphere.w / ((Sphere.d/2) * (Sphere.d/2) * Math.PI / 1000));
					fixDef.density = den / 10;
					//console.log(fixDef.density);

					fixDef.friction = 0.5;
					fixDef.restitution = 0.55;
					fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape();

					var d = Sphere.particle.scale.x * 200;
					fixDef.shape.SetRadius( d );

					var bodyDef = new Box2D.Dynamics.b2BodyDef(); // `bodyDef` will describe the type of bodies we're creating
					bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody; // balls can move
					bodyDef.position.y = -Sphere.collisionSphere.position.y + this.debugOffset.y;
					bodyDef.position.x = Sphere.collisionSphere.position.x + this.debugOffset.x; // Random positon between -20 and 20
					bodyDef.userData = Sphere.collisionSphere;//collisionSphere; // Keep a reference to `ball`
					var body = this.world.CreateBody( bodyDef ).CreateFixture( fixDef ); // Add this physics body to the world
				}

			},

			debugOffset: {x:0, y:0},

			makeBox2dStaticRect: function(x, y, width, height){

				//var material_red = new THREE.MeshLambertMaterial({ color: 0xdd0000, overdraw: true });	
				//var floor = new THREE.Mesh( new THREE.PlaneGeometry( width, height ), material_red );
				//this.main.scene.add( floor );
				//console.log(floor);

				//floor.position.x = x;
				//floor.position.y = -y; // position the floor



				


				var bodyDef = new Box2D.Dynamics.b2BodyDef();
				bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody; // Objects defined in this function are all static
				bodyDef.position.x = x + this.debugOffset.x;
				bodyDef.position.y = y + this.debugOffset.y;
				

				var fixDef = new Box2D.Dynamics.b2FixtureDef;
				fixDef.friction = 1;
				fixDef.restitution = 0;
				fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
				fixDef.shape.SetAsBox( width * 0.5, height * 0.5 ); // "50" = half width of the floor, ".1" = half height
				//bodyDef.userData = floor; // Keep a reference to `floor`
				var b = this.world.CreateBody( bodyDef ).CreateFixture( fixDef ); // Add this physics body to the world
				return b;

			}

		});

		//});


	}
);
