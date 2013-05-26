// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js",
    "paths": {
      "app": "app",
      "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
      "three": "lib/three",
      "class": "lib/class",
      "sphere": "sphere"
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);
