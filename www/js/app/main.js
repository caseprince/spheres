define(
	[
		"jquery",
		"class",
		"sphere",
		"three",
		"js/lib/stats.min.js",
		"js/lib/tween.min.js",
	],

	function($, Class, Sphere, THREE, Stats, TWEEN) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
   // $(function() {
        //$('body').alpha().beta();
       // console.log(Class);

    var Main = {

        camera: null, scene: null, projector: null, raycaster: null, renderer:null, particle: null,
        INTERSECTED: null, 
        FOCUSED: null,

        Spheres : [],
        Views : [],
        currentView : 0,
        activeSphere : 0,
        theta: 0,


		b2_mouseX : 0, b2_mouseY : 0,
		windowHalfX : window.innerWidth / 2,
		windowHalfY : window.innerHeight / 2,
		mouse: {x:0, y:0},
		mouseX: 500, mouseY : 500,

        init: function(scene, Spheres){
	        this.initTHREEjs();

	    	

			var that = this;
			$.getJSON('spheres.json', function(data) {

				data.spheres.sort(function(a,b) { return parseFloat(b.d) - parseFloat(a.d); } );

				$('h1').html(data.spheres.length + " Spheres!");

				$.each(data.spheres, function(key, sphereData) {

					sphereData.id = key;
					sphereData.position = {x: 0, y: 0, z: 0};

					that.addSphere(sphereData);

					

				});

				that.loadViews();
				
				

			});
		},

		addSphere: function(sphereData){
			var s = new Sphere(sphereData, this.scene);
			this.Spheres.push(s);

			//console.log(s);
		},

		loadViews: function() {

			var that = this;
			var amd_modules = ['js/view_random.js', 'js/view_1.js', 'js/view_sine.js', 'js/view_box2d.js', 'js/view_graph.js'];

			require(amd_modules, function() {
				console.log("All modules loaded");
				// arguments should now be an array of your required modules
				// in the same order you required them
				for (i = 0; i < arguments.length; i++) {
					that.Views.push(new arguments[i](that.scene, that.Spheres, that));
				}

				that.Views[that.currentView].intro();
				that.animate();

				that.makeViewMenu();

			});
		},

		makeViewMenu: function() {

			var that = this;			

			//this.Views.push(new View_random(that.scene, that.Spheres, this));
			//this.Views.push(new View_1(that.scene, that.Spheres, this));
			//this.Views.push(new View_sine(that.scene, that.Spheres, this));
			//this.Views.push(new View_box2d(that.scene, that.Spheres, this));
			//this.Views.push(new View_graph(that.scene, that.Spheres, this));

			//console.log(this.scene);

			var ul = [];
			for (i = 0; i < this.Views.length; i++) {
				if(i == this.currentView){
					ul.push('<li><a id="' + i + '" class="active">' + this.Views[i].title + '</a></li>');
				}else{
					ul.push('<li><a id="' + i + '">' + this.Views[i].title + '</a></li>');
				}
				
			}

			$('<ul/>', {
				'class': 'modes',
				html: ul.join('')
			}).appendTo('#ui');

			$("ul.modes li a").click(function() {
				//alert($(this).attr("id"));
				that.showView($(this).attr("id"));
			});

		}, 

		showView: function(id){

			$("ul.modes a.active").removeClass("active");
			$("ul.modes #"+id).addClass("active");
			this.currentView = id;
			this.Views[this.currentView].intro();

			this.clearProps();
		},

		//console.log("class: "+THREE);
		/*new TWEEN.Tween( particle.position )
					.delay( delay )
					.to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
					.start();*/

		initTHREEjs: function() {

			this.container = $("#container");

			this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 5000 );
			//camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
			this.camera.position.z = 360;

			this.scene = new THREE.Scene();
				var ambientLight = new THREE.AmbientLight( 0x555555 );
				this.scene.add( ambientLight );

			this.projector = new THREE.Projector();
			this.raycaster = new THREE.Raycaster();

			this.renderer = new THREE.CanvasRenderer();
			//renderer = new THREE.WebGLRenderer();
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.sortElements = true;
			this.renderer.setClearColor( 0x000000, 0.25 );
			this.container.append( this.renderer.domElement );

			this.stats = new Stats();
			this.stats.domElement.style.position = 'absolute';
			this.stats.domElement.style.bottom = '0px';
			$('body').append( this.stats.domElement );

			//document.addEventListener( 'mousemove', this.onDocumentMouseMove, false );
			document.onmousemove = function(event){
				//alert("Moved! "+event.clientX);
				Main.onDocumentMouseMove(event);
			};

			document.addEventListener( 'touchstart', this.onDocumentTouchStart, false );
			document.addEventListener( 'touchmove', this.onDocumentTouchMove, false );
			window.addEventListener( 'resize', this.onWindowResize, false );

			document.addEventListener( 'click', this.onDocumentClick, false );

			//this.mouse = new THREE.Vector2();

		},

		animate: function() {
			//if(active){
				var that = this;
				window.requestAnimationFrame( Main.animate );

				//updateDragging();
				//box2d();
				//console.log(Main.Views[Main.currentView]);	
				//v1.step();
				//if(this.Views[this.currentView].step()){
					Main.Views[Main.currentView].step();
				//}

				//console.log(this);

				Main.render();
				Main.stats.update();
				//world.DrawDebugData();

			//}
		},

		radius : 300, 
		theta : 0,
		cameraFocus : {x:0, y:0, z:0},

		render: function() {

			TWEEN.update();

			this.theta += 0.4;
			//camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
			//camera.position.y = radius * .5 * Math.sin( THREE.Math.degToRad( theta ) );
			//camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

			//$("#debug").html("x"+this.mouseX);
			if(this.mouseX && this.mouseY){
				this.camera.position.x += ( 0.5 * this.mouseX - this.camera.position.x ) * 0.05;
				this.camera.position.y += ( -0.5 * this.mouseY - this.camera.position.y ) * 0.05;
				}
			//camera.lookAt( scene.position );
			this.camera.lookAt( this.cameraFocus );
			this.hitTest();

			for ( var i = 0; i < this.Spheres.length; i++ ) {

				/*if(i === 10){
					//var projector = new THREE.Projector();
					var p2D = new THREE.Vector3(200, -200, -0.5);

					//p2D = projector.projectVector(p3D, camera);
					var p3D = projector.unprojectVector(p2D, camera);

					p3D.x = (p3D.x + camera.position.x) * 0.5;
					p3D.y = (p3D.y + camera.position.y) * 0.5;
					p3D.z = (p3D.z + camera.position.z) * 0.5;

					//var p3D = camera.matrixWorld.multiplyVector3( p2D );
					//console.log(p3D.x + ", " + p3D.y);
					///Spheres[i].collisionSphere.position.x = -p3D.x;
					//Spheres[i].collisionSphere.position.y = -p3D.y;
					//Spheres[i].collisionSphere.position.z = -p3D.z;
					//Spheres[i].collisionSphere.scale.x = Spheres[i].collisionSphere.scale.y = 10;
				}*/

				this.Spheres[i].particle.position = this.Spheres[i].collisionSphere.position;
				this.Spheres[i].particle.rotation = this.Spheres[i].collisionSphere.rotation;
				//Spheres[i].particle.position.y = Spheres[i].collisionSphere.position.y;
				//Spheres[i].particle.position.z = Spheres[i].collisionSphere.position.z;
				//Spheres[i].particle.scale = Spheres[i].collisionSphere.scale;

			}

			this.renderer.render( this.scene, this.camera );

		},

		hitTest: function(){
			// find intersections
			var vector = new THREE.Vector3( this.mouse.x, this.mouse.y, 1 );
			this.projector.unprojectVector( vector, this.camera );
			this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );

			//var intersects = raycaster.intersectObjects( particles );
			var intersects = this.raycaster.intersectObjects( this.scene.children );

			if ( intersects.length > 0 ) {
				//console.log(intersects[0].object.id);
				if ( this.INTERSECTED != intersects[ 0 ].object ) {
					if(this.INTERSECTED !== null){
						$("ul.spheres a").removeClass("active");
						//INTERSECTED.visible = false;
					}
					this.INTERSECTED = intersects[0].object;

					if ( this.INTERSECTED && this.INTERSECTED.Sphere ){
						//console.log(INTERSECTED.data);
						//INTERSECTED.visible = true;

						$("ul.spheres a#"+this.INTERSECTED.Sphere.id).addClass("active");

						this.showTooltip(this.INTERSECTED);
						this.FOCUSED = this.INTERSECTED;
					}
				}
			} else {

				if(this.INTERSECTED !== null){
					//INTERSECTED.visible = false;
					$("ul.spheres a").removeClass("active");
					this.INTERSECTED = null;
					//console.log("null");
				}
			}

			if(this.FOCUSED){
				this.positionTooltip(this.FOCUSED);
			}
		},

		showTooltip: function(collisionSphere){

			//console.log(collisionSphere);

			$("#tooltip").html(collisionSphere.Sphere.title);
			$("#tooltip").css({"display": "block"});

			this.positionTooltip(collisionSphere);

			/*var x = collisionSphere.position.x;
			var y = collisionSphere.position.y;
			var z = collisionSphere.position.z;
			new TWEEN.Tween( cameraFocus ).to( { x:x, y:y, z:z}, 1000 ).start();*/

		},
		positionTooltip: function(collisionSphere){

			var projector = new THREE.Projector();
			var v3 = new THREE.Vector3().getPositionFromMatrix(collisionSphere.matrixWorld);
			var vector = this.projector.projectVector( v3, this.camera );
			vector.x = ( vector.x * this.windowHalfX ) + this.windowHalfX;
			vector.y = - ( vector.y * this.windowHalfY ) + this.windowHalfY;

			$("#tooltip").css({"left":vector.x, "top":vector.y});
		},

		onDocumentMouseMove: function( event ) {

			this.mouseX = event.clientX - this.windowHalfX;
			this.mouseY = event.clientY - this.windowHalfY;

			this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

			var s = 260;
			this.b2_mouseX = (( this.mouseX / window.innerHeight ) + 0.38) * s;
			this.b2_mouseY = (( this.mouseY / window.innerHeight ) + 0.38) * s;

			//$("#debug").html("mousex: "+b2_mouseX + " mousey: "+b2_mouseY);
		},

		onDocumentTouchStart: function( event ) {

			if ( event.touches.length == 1 ) {
				event.preventDefault();
				mouseX = event.touches[ 0 ].pageX - windowHalfX;
				mouseY = event.touches[ 0 ].pageY - windowHalfY;
			}

		},

		onDocumentTouchMove: function( event ) {

			if ( event.touches.length == 1 ) {
				event.preventDefault();
				mouseX = event.touches[ 0 ].pageX - windowHalfX;
				mouseY = event.touches[ 0 ].pageY - windowHalfY;
			}

		},

		onDocumentClick: function() {

			//if(this.INTERSECTED !== null){
				//console.log("clickec: "+this.INTERSECTED.Sphere.title);
			//}

		},

		onWindowResize: function() {

			Main.windowHalfX = window.innerWidth / 2;
			Main.windowHalfY = window.innerHeight / 2;
			Main.camera.aspect = window.innerWidth / window.innerHeight;
			Main.camera.updateProjectionMatrix();
			Main.renderer.setSize( window.innerWidth, window.innerHeight );

		},

		makeBox2dStaticRect: function(x, y, width, height){

			var material_red = new THREE.MeshLambertMaterial({ color: 0xdd0000, overdraw: true });	
			var floor = new THREE.Mesh( new THREE.PlaneGeometry( width, height ), material_red );
			this.scene.add( floor );
			console.log(floor);

			floor.position.x = x;
			floor.position.y = -y; // position the floor
			return floor;
		},

		props:[],

		box2dStuff:function (){
			console.log("scene");

			this.props.push(this.makeBox2dStaticRect(0, 100, 230, 5));
			this.props.push(this.makeBox2dStaticRect(-100, 0, 5, 230));
			this.props.push(this.makeBox2dStaticRect(100, 0, 5, 230));
		}, 

		clearProps:function (){
			while(this.props.length > 0){
				var p = this.props.pop();
				this.scene.remove(p);
			}
		}


    };

    Main.init();

	//var main = new Main();
	return Main;
});
