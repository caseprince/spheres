define(
	[
		"jquery",
		"class"
	],

	function($) {
       
		var Sphere = Class.extend({
			init: function(data){
				this.title = data.title;
				this.src = data.src;
				this.d = data.d;
				this.w = data.w;

			},
			dance: function(){
				//return this.dancing;
			}
		});

		console.log(Sphere);

		return Sphere;
});
