var ResourceLoader = require("./ResourceLoader");
var Physics = require("./Physics");
var Body = require("./Body");
var levelLoader = require('./Levels');

/*
 * Global variable dependency: _levelLoader
 */

var CONSTANTS = {
	WALL_ID: "wall",
	START_POINT_ID: "startBox",
	LEFT_WALL_ID: "leftWall",
	RIGHT_WALL_ID: "rightWall",
	BALL_R: 15,
	BALL_ID: "egg",
	BUNNY_R: 20
};

//Global Game Constants
var WALL_ID = CONSTANTS.WALL_ID;
var START_POINT_ID = CONSTANTS.START_POINT_ID;
var LEFT_WALL_ID = CONSTANTS.LEFT_WALL_ID;
var RIGHT_WALL_ID = CONSTANTS.RIGHT_WALL_ID;
var BALL_R = CONSTANTS.BALL_R;
var BALL_ID = CONSTANTS.BALL_ID;
var BUNNY_R = CONSTANTS.BUNNY_R;

// Global Game Variables

var __globals = {
	_terrain: null,
	_resources: null,
	_canvasW: null,
	_canvasH: null,
	CONSTANTS: CONSTANTS
};

// var _terrain;
var _resources;
var _levelLoader;
var _levelPos = 0;
var _physics = null, _lastFrame = new Date().getTime();
// var _canvasW, _canvasH;

var resourceList = [{
	name : "ballImg",
	type : "image",
	url : require("../../imgs/angry-bird-30x30.png")
}, {
	name : "bunnyImg",
	type : "image",
	url : require("../../imgs/bunny-40x40.png")
}, {
	name : "snowPattern",
	type : "image",
	url : require("../../imgs/snow-textures-5.jpg")
}];

window.onerror = function(error) {
	alert(error);
};

window.gameLoop = function() {
	var tm = new Date().getTime();
	requestAnimationFrame(gameLoop);
	var dt = (tm - _lastFrame) / 1000;
	if (dt > 1 / 15) {
		dt = 1 / 15;
	}
	_physics.step(dt);
	_lastFrame = tm;
};

function init() {

	var resLoader = new ResourceLoader(resourceList, function(loaded) {

		__globals._resources = loaded;
		_resources = __globals._resources;

		var canvas = document.getElementById("b2dCanvas");
		_physics = new Physics(canvas, null, __globals);

		window._physics = _physics;

		__globals._canvasW = canvas.width;
		__globals._canvasH = canvas.height;
		var _canvasW = __globals._canvasW, _canvasH = __globals._canvasH;
		_levelLoader = new levelLoader(_physics, __globals);

		// physics.debug();
		_physics.collision();

		// ground
		new Body(_physics, {
			id : WALL_ID,
			color : "#e5e5e5",
			type : "static",
			x : _canvasW / 2,
			y : -10,
			height : 40,
			width : _canvasW
		});

		// ceiling
		new Body(_physics, {
			id : WALL_ID,
			color : "#e5e5e5",
			type : "static",
			x : _canvasW / 2,
			y : _canvasH+20,
			height : 40,
			width : _canvasW
		});

		// left wall
		new Body(_physics, {
			id : LEFT_WALL_ID,
			color : "red",
			type : "static",
			x : -10,
			y : _canvasH / 2,
			height : _canvasH * 2,
			width : 20
		});

		// right wall
		new Body(_physics, {
			id : RIGHT_WALL_ID,
			color : "red",
			type : "static",
			x : _canvasW + 10,
			y : _canvasH / 2,
			height : _canvasH * 2,
			width : 20
		});

		_levelLoader.load(_levelPos);

		$('#nextLevel').click(function() {
			nextLevel();
		});

		$('#restartLevel').click(function() {
			restartLevel();
		});

		_physics.rightClickToCreate(function(e) {

      var world = _physics.world;

			var posX = e.offsetX || e.layerX, posY = e.offsetY || e.layerY;
      var startPointBody = _physics.bodyWrapperMap[START_POINT_ID].body;


      var hitBodies = world.hitTest([posX / _physics.scale, (_canvasH - posY) / _physics.scale], [startPointBody]);

      if (hitBodies.length) {
        new Body(_physics, {
          id : BALL_ID,
          image : _resources.ballImg,
          shape : "circle",
          x : posX,
          y : _canvasH - posY,
          radius : BALL_R,
          width : BALL_R * 2,
          height : BALL_R * 2,
          life: 1000
        });
      }

			// if (isPointInBox({
			// x : posX,
			// y : posY
			// }, _box)) {
			// new Body(_physics, {
			// id : BALL_ID,
			// image : _resources.ballImg,
			// shape : "circle",
			// x : posX,
			// y : posY,
			// radius : BALL_R,
			// width : BALL_R * 2,
			// height : BALL_R * 2,
			// density : 1,
			// friction : 0.5,
			// restitution : 0.5
			// });
			// }

			// Prevent the click event to be triggered
			return false;
		});

		$("#level-dialog").dialog({
			autoOpen : false,
			resizable : false,
			height : 200,
			modal : true,
			buttons : {
				"Go to next" : function() {
					nextLevel();
					$(this).dialog("close");
				},
				Cancel : function() {
					$(this).dialog("close");
				}
			}
		});

		_physics.onMouseDown(function(e) {
			_physics.element.addEventListener("mousemove", doExplosion);
		});

		_physics.onMouseUp(function(e) {
			_physics.element.removeEventListener("mousemove", doExplosion);
		});

		if (touchable()) {
			_physics
					.onTouchStart(function(e) {
						if (e.touches.length === 1)
							_physics.element.addEventListener("touchmove",
									doExplosion);
					});

			_physics.onTouchEnd(function(e) {
				if (e.touches.length === 1)
					_physics.element.removeEventListener("touchmove",
							doExplosion);
			});
		}

		_physics.onClick(doExplosion);

		requestAnimationFrame(gameLoop);
	});

	resLoader.load();

}

window.addEventListener("load", init);

function nextLevel() {
	resetWorld();
	_levelLoader.load(++_levelPos % _levelLoader.levels.length);
	$('#levelLabel').html("LEVEL " + (_levelPos % _levelLoader.levels.length + 1));
}

function restartLevel() {
	resetWorld();
	_levelLoader.load(_levelPos % _levelLoader.levels.length);
}

function isPointInBox(point, box) {
	var xMin, xMax, yMin, yMax;

	var pointA = box[0];
	var pointB = box[1];
	var pointC = box[2];

	var p1 = pointA, p2 = pointB, p3 = pointC;
	if (pointA.x !== pointB.x) {
		p2 = pointC;
		p3 = pointB;
	}

	yMin = p1.y;
	yMax = p2.y;
	if (p1.y > p2.y) {
		yMin = p2.y;
		yMax = p1.y;
	}
	xMin = p1.x;
	xMax = p3.x;
	if (p1.x > p3.x) {
		xMin = p3.x;
		xMAx = p1.x;
	}

	return point.x > xMin && point.x < xMax && point.y > yMin && point.y < yMax;
}

function touchable() {
	return 'createTouch' in document;
}

function resetWorld() {
	var bodies = _physics.world.bodies;
  var obj, id;

  for (var i = 0; i < bodies.length; i++) {
    obj = bodies[i].__wrapper;

    id = obj.details.id;
    if (!id
        || (id && !(id === WALL_ID || id === LEFT_WALL_ID || id === RIGHT_WALL_ID))) {
      obj.details.dead = true;
    }

  }
	__globals._terrain = null;

}

/*
 * This is core function for enabling destructible terrain Reference:
 * http://www.emanueleferonato.com/2013/10/17/how-to-create-destructible-terrain-using-box2d-step-2/
 * polygon winding order for clipper (outer == CW; holes == CCW)
 */
function doExplosion(e) {
	e.preventDefault();

	var _terrain = __globals._terrain;

	if (!_terrain)
		return;

	var self = _physics;

	var pos = {
		x : e.offsetX || e.layerX,
		y : e.offsetY || e.layerY
	};

	var explosionPolygon = createCircle(20, {
		x: pos.x,
		y: __globals._canvasH - pos.y
	}, 30);

	var polys = transformKey(_terrain.details.terrainPolys, true)

	for ( var i in polys) {
		var poly = polys[i];
		poly.holes.push(explosionPolygon);
	}

	var tempPolys = [];
	for ( var i in polys) {
		var poly = polys[i];

		var subjPolygons = [poly.outer];

		var clipPolygons = poly.holes;

		var polytree = new ClipperLib.PolyTree();

		var clipType = ClipperLib.ClipType.ctDifference;
		var subjectFillType = ClipperLib.PolyFillType.pftNonZero;
		var clipFillType = ClipperLib.PolyFillType.pftNonZero;

		var cpr = new ClipperLib.Clipper();
		cpr.AddPaths(subjPolygons, ClipperLib.PolyType.ptSubject, true);
		cpr.AddPaths(clipPolygons, ClipperLib.PolyType.ptClip, true);
		var succeeded = cpr.Execute(clipType, polytree,
				subjectFillType, clipFillType);

		// console.log(succeeded);

		if (!succeeded) {
			throw Error("Clipping failed...");
		}

		var solutionPolygons = ClipperLib.JS.PolyTreeToExPolygons(polytree);

		tempPolys = tempPolys.concat(solutionPolygons || []);
	}

	for (var i = 0; i < tempPolys.length; i++) {
		var lightenTolerance = 0.01;
		var cleanTolerance = 0.01;

		// for clipper 6.0 not doing the following steps seems to increase the performance

		// tempPolys[i].outer = ClipperLib.Clipper.CleanPolygon(tempPolys[i].outer,
		// 		cleanTolerance * self.scale);
		// tempPolys[i].outer = ClipperLib.JS.Lighten(tempPolys[i].outer,
		// 		lightenTolerance * self.scale)[0];
		//
		// tempPolys[i].holes = ClipperLib.JS.Lighten(tempPolys[i].holes,
		// 		lightenTolerance * self.scale);
		// tempPolys[i].holes = ClipperLib.Clipper.CleanPolygons(tempPolys[i].holes,
		// 		cleanTolerance * self.scale);
	}

	self.world.removeBody(_terrain.body);
	__globals._terrain = new Body(_physics, {
		type : "static",
		shape : "terrain",
		patternImg : _resources.snowPattern,
		terrainPolys : transformKey(tempPolys)
	});

};

function transformKey(polys, lowerToUpper) {
	return polys.map(function(poly) {
		return {
			outer: transformPoly(poly.outer, lowerToUpper),
			holes: poly.holes.map(function(hole) {
				return transformPoly(hole, lowerToUpper);
			})
		}
	});
}

function transformPoly(poly, lowerToUpper) {
	var resultPoly = [];

	for (var j = 0; j < poly.length; j++) {
		var vertex = poly[j];

		if (lowerToUpper) {
			resultPoly.push({
				X: vertex.x,
				Y: vertex.y
			});
		} else {
			resultPoly.push({
				x: vertex.X,
				y: vertex.Y
			});
		}
	}

	return resultPoly;
}

function createCircle(precision, origin, radius) {
	var angle = 2 * Math.PI / precision;
	var circleArray = [];
	for (var i = 0; i < precision; i++) {
		circleArray.push({
			X: origin.x + radius * Math.cos(angle * i),
			Y: origin.y + radius * Math.sin(angle * i)
		});
	}
	return circleArray.reverse();
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

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
