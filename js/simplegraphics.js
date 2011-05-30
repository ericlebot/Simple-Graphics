/*
 * Simple Graphics
 * HTML5 simple graphic engine
 *
 * Copyright 2011, Eric Le Bot
 *
 * Inspired by Seth Ladd's presentation on HTML5 games
 * http://blog.sethladd.com/2011/05/source-code-slides-and-video-for-html5.html
 */
 
 // Allow ressources (sprites, sounds, data, ...) importation and cache
 RessourceManager() {
	this.cache = {};
	this.loadQueue = [];
	this.successCount = 0;
	this.errorCount = 0;
}

// Load and add images to cache
RessourceManager.prototype.load = function(callback) {
	if(this.loadQueue.length
	for (var i = 0; i < this.loadQueue.length; i++) 
		var ressource = this.loadQueue.[i];
		
		var path = ressource.path;
		var name = ressource.name;
		
		var img = new Image();
		this.cache[name] = { path: path, img: img, loaded: null };
		
		var that = this;
		img.addEventListener('load',function() {
			console.log(path + " is loaded.");
			that.successCount += 1;
			that.cache[name].loaded = true;
			that.finish();
		}, false);
		img.addEventListener('error',function() {
			console.error(path + " is not loaded. An error occured.");
			that.errorCount += 1;
			that.cache[name].loaded = false;
			that.finish();
		}, false);
		
		img.src = path;
	}
}

// Return if whether or not loading is complete
RessoureManager.prototype.done = function() {
	return (this.loadQueue.length == (this.successCount + this.errorCount));
}

// Display loading stats and clear load
RessourceManager.prototype.finish = function() {
	if(this.done()) {
		console.log("Loading finished.\n" + this.successCount + " ressources loaded, " + this.errorCount + " ressources not loaded.");
		this.loadQueue = [];
		this.successCount = 0;
		this.errorCount = 0;
	}
}

// Return a ressource
RessourceManager.prototype.get = function(ressource) {
	return (ressource && this.cache[ressource] && this.cache[ressource].loaded == true) ? this.cache[ressource].img : null;
}

// Base
function SimpleGraphics(context) {
	this.ressourceManager = new RessourceManager();
	this.context = context;
	this.camera = {
        x: 0,
        y: 0,
        width: context.canvas.width,
        height: context.canvas.height
    };
    this.entities = [];
}

// Draw every entity if in the drawing area
SimpleGraphics.prototype.draw = function() {
    var camera = this.camera;
    var entities = this.entities;
    var context = this.context;

    context.clearRect(0, 0, camera.width, camera.height);
    context.save();
    
    for (var i=0; i<entities.length; i++ ) {
        var entity = entities[i];
        if (
           (
                ((entity.x <= camera.x) && (entity.x + entity.width > camera.x))
                ||
                ((entity.x+entity.width >= camera.x+camera.width) && (entity.x < camera.x+camera.width))
                ||
                ((entity.x > camera.x) && (entity.x + entity.width < camera.x + camera.width))
            )
            &&
            (
                ((entity.y <= camera.y) && (entity.y + entity.height > camera.y))
                ||
                ((entity.y + entity.height >= camera.y + camera.height) && (entity.y < camera.y + camera.height))
                ||
                ((entity.y > camera.y) && (entity.y + entity.height < camera.y + camera.height))
            )
        ) {
            var img = this.ressourceManager.get(entity.image);
            if(img) {
                context.drawImage(img, entity.x-camera.x, entity.y-camera.y);
            } else {
                entity.remove = true;
            }
        } else {
            console.log("Entity out of bound.");
        }
    }
}