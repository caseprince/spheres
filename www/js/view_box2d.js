define(
	[
		'js/view.js',
		'js/lib/Box2dWeb-2.1.a.3.js',
		'lib/THREE'
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

				}

				this.buildBox2dScene();

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
						mesh.position.y = position.y;

						// GetAngle() function returns the rotation in radians
						//mesh.rotation.z = object.GetAngle();
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
	
				var gf = this.makeBox2dStaticRect(0, 100, 300, 5);
				ground = gf.m_body
				this.makeBox2dStaticRect(-100, 0, 5, 200);
				this.makeBox2dStaticRect(100, 0, 5, 200);
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

			},

			debugOffset: {x:100, y:100},

			makeBox2dStaticRect: function(x, y, width, height){

				var material_red = new THREE.MeshLambertMaterial({ color: 0xdd0000, overdraw: true });	
				var floor = new THREE.Mesh( new THREE.PlaneGeometry( width, height ), material_red );
				this.scene.add( floor );
				console.log(floor);


				var bodyDef = new Box2D.Dynamics.b2BodyDef();
				bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody; // Objects defined in this function are all static
				bodyDef.position.x = x + this.debugOffset.x;
				bodyDef.position.y = y + this.debugOffset.y;
				floor.position.x = x;
				floor.position.y = -y; // position the floor
				// bodyDef.angle = 0;

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
