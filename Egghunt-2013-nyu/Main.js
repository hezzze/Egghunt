//TODO comment to polygon winding order for clipper (outer == CW; holes == CCW)

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2Transform = Box2D.Common.Math.b2Transform;
var b2Mat22 = Box2D.Common.Math.b2Mat22;

var physics, lastFrame = new Date().getTime();
var terrain;
var DIRT_SIZE = 50;
var EGG_R = 12.5;
var DIRT_ID = "dirt";
var EGG_ID = "egg";

function levelOne() {
	// Create the terrain
	terrain = new Body(physics, {
		id : DIRT_ID,
		type : "static",
		shape : "terrain",
		color : "#996633",
		terrainPolys : [{
			outer : translateShape([{
				"x" : 0,
				"y" : 0.5250000357627869
			}, {
				"x" : 0.32500001788139343,
				"y" : 0.42500001192092896
			}, {
				"x" : 0.4749999940395355,
				"y" : 0.4000000059604645
			}, {
				"x" : 0.574999988079071,
				"y" : 0.3499999940395355
			}, {
				"x" : 0.6500000357627869,
				"y" : 0.4000000059604645
			}, {
				"x" : 1,
				"y" : 0.5
			}, {
				"x" : 1,
				"y" : 0
			}, {
				"x" : 0,
				"y" : 0
			}], 800, 0, 500),
			holes : []
		}]
	});

	var sensor = new Body(physics, {
		type : "static",
		shape : "circle",
		x : 400,
		y : 300,
		radius : 17.5,
		isSensor : true,
		color : "red",
	});

	sensor.beginContact = function(body) {
		if (body.details.id === EGG_ID) {
			this.details.dead = true;
		}
	};

	var finishingPoint = new Body(physics, {
		type : "static",
		x : 400,
		y : 590,
		isSensor : true,
		height : 20,
		width : 100,
		color : "green",
	});

	finishingPoint.beginContact = function(body) {
		physics.isWorldEnd = true;
	};
}

function levelTwo() {
}

function levelThree() {
}
function levelFour() {
}
function levelFive() {
}

var levelPos = 0;
var levels = [levelOne, levelTwo, levelThree, levelFour, levelFive];

function resetWorld() {
	var bodies = physics.world.GetBodyList();
	for (var i = 0; i < bodies.length; i++) {
		physics.world.DestroyBody(bodies[i]);
	}
}

window.onerror = function(error) {
	alert(error);
};

window.gameLoop = function() {
	var tm = new Date().getTime();
	requestAnimationFrame(gameLoop);
	var dt = (tm - lastFrame) / 1000;
	if (dt > 1 / 15) {
		dt = 1 / 15;
	}
	physics.step(dt);
	lastFrame = tm;
};

function init() {
	var egg = new Image();

	// Wait for the image to load
	egg.addEventListener("load", function() {

		var canvas = document.getElementById("b2dCanvas");
		physics = new Physics(canvas);
		var canvasW = canvas.width;
		var canvasH = canvas.height;

		// physics.debug();
		physics.collision();

		// ground
		new Body(physics, {
			color : "red",
			type : "static",
			x : canvasW / 2,
			y : canvasH + 10,
			height : 40,
			width : canvasW
		});

		// left wall
		new Body(physics, {
			color : "red",
			type : "static",
			x : -10,
			y : canvasH / 2,
			height : canvasH * 2,
			width : 20
		});

		// right wall
		new Body(physics, {
			color : "red",
			type : "static",
			x : canvasW + 10,
			y : canvasH / 2,
			height : canvasH * 2,
			width : 20
		});

		levelOne();

		physics.rightClickToCreate(function(e) {
			var posX = e.offsetX || e.layerX, posY = e.offsetY || e.layerY;

			new Body(physics, {
				id : EGG_ID,
				image : egg,
				shape : "circle",
				x : posX,
				y : posY,
				radius : EGG_R,
				width : EGG_R * 2,
				height : EGG_R * 2,
				density : 1,
				friction : 0.5,
				restitution : 0.5
			});
			
			//Prevent the click event to be triggered
			return false;
		});

		physics.onMouseDown(function(e) {
			physics.element.addEventListener("mousemove", doExplosion);
		});

		physics.onMouseUp(function(e) {
			physics.element.removeEventListener("mousemove", doExplosion);
		});

		if (touchable()) {
			physics.onTouchStart(function(e) {
				if (e.touches.length === 1)
					physics.element.addEventListener("touchmove", doExplosion);
			});

			physics.onTouchEnd(function(e) {
				if (e.touches.length === 1)
					physics.element.removeEventListener("touchmove",
							doExplosion);
			});
		}

		physics.onClick(doExplosion);

		requestAnimationFrame(gameLoop);
	});

	egg.src = "imgs/soccer-ball-25x25.png";
}

window.addEventListener("load", init);

function translateShape(vertices, scale, posX, posY) {
	var scaled = [];
	for ( var i in vertices) {
		scaled.push({
			x : vertices[i].x * scale + posX,
			y : posY - vertices[i].y * scale
		});
	}
	return scaled;
}

function touchable() {
	return 'createTouch' in document;
}

/*
 * This is core function for enabling destructible terrain Reference:
 * http://www.emanueleferonato.com/2013/10/17/how-to-create-destructible-terrain-using-box2d-step-2/
 */
function doExplosion(e) {
	e.preventDefault();

	var self = physics;

	var pos = {
		x : e.offsetX || e.layerX,
		y : e.offsetY || e.layerY
	};

	var explosionPolygon = createCircle(20, pos, 30);
	for ( var i in terrain.details.terrainPolys) {
		var poly = terrain.details.terrainPolys[i];
		poly.holes.push(explosionPolygon);
	}

	var tempPolys = [];
	for ( var i in terrain.details.terrainPolys) {
		var poly = terrain.details.terrainPolys[i];

		var subjPolygons = [poly.outer];
		var clipPolygons = poly.holes;
		var solutionPolygons = ClipperLib.ExPolygons();
		var clipType = ClipperLib.ClipType.ctDifference;
		var subjectFillType = ClipperLib.PolyFillType.pftNonZero;
		var clipFillType = ClipperLib.PolyFillType.pftNonZero;

		var cpr = new ClipperLib.Clipper();
		cpr.AddPolygons(subjPolygons, ClipperLib.PolyType.ptSubject);
		cpr.AddPolygons(clipPolygons, ClipperLib.PolyType.ptClip);
		var succeeded = cpr.Execute(clipType, solutionPolygons,
				subjectFillType, clipFillType);
		if (!succeeded) {
			throw Error("Clipping failed...");
		}

		tempPolys = tempPolys.concat(solutionPolygons || []);
	}

	for (var i = 0; i < tempPolys.length; i++) {
		var tolerance = 0.02;

		var temp = ClipperLib.Lighten(tempPolys[i].outer, tolerance
				* self.scale);
		temp = temp[0];
		for ( var j in tempPolys[i].holes) {
			var temp = ClipperLib.Lighten(tempPolys[i].holes[j], tolerance
					* self.scale);
			tempPolys[i].holes[j] = temp[0];
		}
	}

	self.world.DestroyBody(terrain.body);
	terrain = new Body(physics, {
		id : DIRT_ID,
		type : "static",
		shape : "terrain",
		color : "#996633",
		terrainPolys : tempPolys
	});

};

function createCircle(precision, origin, radius) {
	var angle = 2 * Math.PI / precision;
	var circleArray = [];
	for (var i = 0; i < precision; i++) {
		circleArray.push({
			x : origin.x + radius * Math.cos(angle * i),
			y : origin.y + radius * Math.sin(angle * i)
		});
	}
	return circleArray.reverse();
}

//
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]
				+ 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]
				+ 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};
	}

	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
	}
}());
