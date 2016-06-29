/*
 * Global variable dependency: _levelLoader
 */

//Import Box2D constructors
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
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

//Global Game Constants
var WALL_ID = "wall";
var START_POINT_ID = "startBox";
var LEFT_WALL_ID = "leftWall";
var RIGHT_WALL_ID = "rightWall";
var BALL_R = 15;
var BALL_ID = "egg";
var BUNNY_R = 20;

// Global Game Variables
var _terrain;
var _resources;
var _levelPos = 0;
var _physics, _lastFrame = new Date().getTime();
var _canvasW, _canvasH;

var resourceList = [{
	name : "ballImg",
	type : "image",
	url : "imgs/angry-bird-30x30.png"
}, {
	name : "bunnyImg",
	type : "image",
	url : "imgs/bunny-40x40.png"
}, {
	name : "snowPattern",
	type : "image",
	url : "imgs/snow-textures-5.jpg"
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

		_resources = loaded;

		var canvas = document.getElementById("b2dCanvas");
		_physics = new Physics(canvas);
		_canvasW = canvas.width;
		_canvasH = canvas.height;

		// physics.debug();
		_physics.collision();

		// ground
		new Body(_physics, {
			id : WALL_ID,
			color : "#e5e5e5",
			type : "static",
			x : _canvasW / 2,
			y : _canvasH + 10,
			height : 40,
			width : _canvasW
		});

		// ceiling
		new Body(_physics, {
			id : WALL_ID,
			color : "#e5e5e5",
			type : "static",
			x : _canvasW / 2,
			y : -20,
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
			var posX = e.offsetX || e.layerX, posY = e.offsetY || e.layerY;

			_physics.world.QueryPoint(function(fixture) {
				var obj = fixture.GetBody().GetUserData();
				if (obj && obj.details.id === START_POINT_ID) {
					new Body(_physics, {
						id : BALL_ID,
						image : _resources.ballImg,
						shape : "circle",
						x : posX,
						y : posY,
						radius : BALL_R,
						width : BALL_R * 2,
						height : BALL_R * 2,
						density : 1,
						friction : 0.5,
						restitution : 0.5,
						life: 1000
					});
				}
			}, {
				x : posX / _physics.scale,
				y : posY / _physics.scale
			});

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
	var body = _physics.world.GetBodyList();

	while (body) {
		var obj = body.GetUserData();

		if (obj) {
			var id = obj.details.id;
			if (!id
					|| (id && !(id === WALL_ID || id === LEFT_WALL_ID || id === RIGHT_WALL_ID))) {
				obj.details.dead = true;
			}

		}
		body = body.GetNext();

	}

	_terrain = null;

}

/*
 * This is core function for enabling destructible terrain Reference:
 * http://www.emanueleferonato.com/2013/10/17/how-to-create-destructible-terrain-using-box2d-step-2/
 * polygon winding order for clipper (outer == CW; holes == CCW)
 */
function doExplosion(e) {
	e.preventDefault();

	if (!_terrain)
		return;

	var self = _physics;

	var pos = {
		x : e.offsetX || e.layerX,
		y : e.offsetY || e.layerY
	};

	var explosionPolygon = createCircle(20, pos, 30);
	for ( var i in _terrain.details.terrainPolys) {
		var poly = _terrain.details.terrainPolys[i];
		poly.holes.push(explosionPolygon);
	}

	var tempPolys = [];
	for ( var i in _terrain.details.terrainPolys) {
		var poly = _terrain.details.terrainPolys[i];

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
		var lightenTolerance = 0.02;
		var cleanTolerance = 0.02;

		tempPolys[i].outer = ClipperLib.Clean(tempPolys[i].outer,
				cleanTolerance * self.scale);
		tempPolys[i].outer = ClipperLib.Lighten(tempPolys[i].outer,
				lightenTolerance * self.scale)[0];

		tempPolys[i].holes = ClipperLib.Lighten(tempPolys[i].holes,
				lightenTolerance * self.scale);
		tempPolys[i].holes = ClipperLib.Clean(tempPolys[i].holes,
				cleanTolerance * self.scale);
	}

	self.world.DestroyBody(_terrain.body);
	_terrain = new Body(_physics, {
		type : "static",
		shape : "terrain",
		patternImg : _resources.snowPattern,
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
