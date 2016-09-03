/*
 *
 * Constants dependencies: BALL_ID, BUNNY_ID, BUNNY_R,
 * LEFT_WALL_ID, RIGHT_WALL_ID, WALL_ID, START_BOX_ID
 * Global variable dependencies: _physics, _terrain, _resources,
 * _canvasW, _canvasH
 */

//TODO Try to reduce dependencies
//TODO refactor code


(function() {

	function levelLoader(_physics, __globals) {

		var WALL_ID = __globals.CONSTANTS.WALL_ID;
		var START_POINT_ID = __globals.CONSTANTS.START_POINT_ID;
		var LEFT_WALL_ID = __globals.CONSTANTS.LEFT_WALL_ID;
		var RIGHT_WALL_ID = __globals.CONSTANTS.RIGHT_WALL_ID;
		var BALL_R = __globals.CONSTANTS.BALL_R;
		var BALL_ID = __globals.CONSTANTS.BALL_ID;
		var BUNNY_R = __globals.CONSTANTS.BUNNY_R;

		var _resources = __globals._resources;
		var _canvasW = __globals._canvasW;
		var _canvasH = __globals._canvasH;

		var levels = [levelOne];

		function levelOne() {

			createStartPoint({
				"x" : 0.5537500381469727,
				"y" : 0.6912499666213989
			}, 0.09500002861022949);

			createTerrain([{
				outer : [{
					"x" : 0.001249939203262329,
					"y" : 0.7137500047683716
				}, {
					"x" : 0.32624995708465576,
					"y" : 0.6137499809265137
				}, {
					"x" : 0.47624993324279785,
					"y" : 0.5887500047683716
				}, {
					"x" : 0.5762499570846558,
					"y" : 0.5387499928474426
				}, {
					"x" : 0.6512500047683716,
					"y" : 0.5887500047683716
				}, {
					"x" : 1.00124990940094,
					"y" : 0.6887499690055847
				}, {
					"x" : 1.00124990940094,
					"y" : 0.18874996900558472
				}, {
					"x" : 0.001249939203262329,
					"y" : 0.18874996900558472
				}],
				holes : [[{
					"x" : 0.37624993920326233,
					"y" : 0.5137499570846558
				}, {
					"x" : 0.37624993920326233,
					"y" : 0.4637500047683716
				}, {
					"x" : 0.4262499511241913,
					"y" : 0.4637500047683716
				}, {
					"x" : 0.4262499511241913,
					"y" : 0.5137499570846558
				}], [{
					"x" : 0.6012499332427979,
					"y" : 0.38874995708465576
				}, {
					"x" : 0.6012499332427979,
					"y" : 0.4387499690055847
				}, {
					"x" : 0.6512500047683716,
					"y" : 0.4387499690055847
				}, {
					"x" : 0.6512500047683716,
					"y" : 0.38874995708465576
				}], [{
					"x" : 0.47624993324279785,
					"y" : 0.3137499690055847
				}, {
					"x" : 0.47624993324279785,
					"y" : 0.26374995708465576
				}, {
					"x" : 0.5262500047683716,
					"y" : 0.26374995708465576
				}, {
					"x" : 0.5262500047683716,
					"y" : 0.3137499690055847
				}]]
			}]);

			createSensors([{
				"x" : 0.4012499451637268,
				"y" : 0.48874998092651367
			}, {
				"x" : 0.6262499094009399,
				"y" : 0.4137499928474426
			}, {
				"x" : 0.5012499094009399,
				"y" : 0.28874996304512024
			}]);

			createDestination([{
				"x" : 0.42500001192092896,
				"y" : 0
			}, {
				"x" : 0.42500001192092896,
				"y" : 0.02500000037252903
			}, {
				"x" : 0.550000011920929,
				"y" : 0.02500000037252903
			}, {
				"x" : 0.550000011920929,
				"y" : 0
			}]);

		}

		function createTerrain(data) {
			var polys = [];
			for ( var i in data) {
				var obj = data[i];
				polys.push({
					outer : translatePoints(obj.outer),
					holes : translateHoles(obj.holes)
				});
			}

			__globals._terrain = new Body(_physics, {
				type : "static",
				shape : "terrain",
				patternImg : _resources.snowPattern,
				// color : "#996633",
				terrainPolys : polys
			});

		}

		function createBouncers(data, restitution) {
			for ( var i in data) {
				var points = data[i];
				createPolygon(points, {
					color : "pink",
					restitution : 1.2
				});
			}
		}

		function createWalls(data) {
			for ( var i in data) {
				var points = data[i];
				createPolygon(points, {
					color : "#C4460D",
					zIndex : 1
				});
			}
		}

		function createPushers(data) {
			for ( var i in data) {
				var points = data[i];
				var pusher = createPolygon(points, {
					color : "red"
				});

				pusher.beginContact = function(obj) {
					if (obj.details.id === BALL_ID) {
						var body = obj.body;
						body.ApplyImpulse(new b2Vec2(0, -50), body.GetWorldCenter());
					}
				};
			}

		}

		function createStartPoint(point, r) {

			var pos = translatePoint(point);

			new Body(_physics, {
				id : START_POINT_ID,
				type : "static",
				color : "rgba(242,39,39,0.3)",
				shape : "circle",
				x : pos.x,
				y : pos.y,
				radius : r * _canvasW,
				isSensor : true
			});
		}

		function createPolygon(points, details) {

			var polyDetails = {
				type : "static",
				shape : "polygon",
				color : "e5e5e5",
				zIndex : 0,
				points : translatePoints(points),
			};

			for ( var i in details) {
				polyDetails[i] = details[i];
			}

			return new Body(_physics, polyDetails);
		}

		function createSensors(points) {
			var sensorPoints = translatePoints(points);

			for ( var i in sensorPoints) {
				var pos = sensorPoints[i];
				var sensor = new Body(_physics, {
					type : "static",
					image : _resources.bunnyImg,
					shape : "circle",
					zIndex : 1,
					x : pos.x,
					y : pos.y,
					radius : BUNNY_R,
					height : BUNNY_R * 2,
					width : BUNNY_R * 2,
					isSensor : true
				});

				sensor.beginContact = function(obj) {
					if (obj.details.id === BALL_ID) {
						this.details.dead = true;
					}
				};
			}
		}

		function createDestination(points) {
			var finishingPoint = new Body(_physics, {
				type : "static",
				shape : "polygon",
				color : "yellow",
				isSensor : true,
				zIndex : 1,
				points : translatePoints(points),
			});

			finishingPoint.beginContact = function(obj) {

				console.log(obj);

				$('#level-dialog').dialog("open");
				finishingPoint.beginContact = undefined;
			};
		}

		function createRevoluteJoint(obj, point, motorSpeed) {
			var revoluteJointDef = new b2RevoluteJointDef();

			var anchor = translatePoint({
				"x" : point.x,
				"y" : point.y
			});

			revoluteJointDef.Initialize(_physics.world.GetGroundBody(), obj.body,
					new b2Vec2(anchor.x / _physics.scale, anchor.y / _physics.scale));

			revoluteJointDef.maxMotorTorque = 5.0;
			revoluteJointDef.motorSpeed = motorSpeed || 0;
			revoluteJointDef.enableMotor = true;

			return _physics.world.CreateJoint(revoluteJointDef);
		}

		function createPrismaticJoint(obj, point, axis, speed) {
			var prismaticJointDef = new b2PrismaticJointDef();

			var anchor = translatePoint({
				"x" : point.x,
				"y" : point.y
			});

			prismaticJointDef.Initialize(obj.body, _physics.world.GetGroundBody(),
					new b2Vec2(anchor.x / _physics.scale, anchor.y / _physics.scale),
					axis);

			prismaticJointDef.maxMotorForce = 10.0;
			prismaticJointDef.motorSpeed = speed || 0;
			prismaticJointDef.enableMotor = true;

			return _physics.world.CreateJoint(prismaticJointDef);
		}

		function translateHoles(shapes) {
			var translated = [];
			for ( var i in shapes) {

				// Holes are CCW
				translated.push(translatePoints(shapes[i]).reverse());
			}
			return translated;
		}

		function translatePoints(points) {
			var translated = [];
			for ( var i in points) {
				translated.push(translatePoint(points[i]));
			}
			return translated;
		}

		function translatePoint(point) {
			return {
				x : point.x * _canvasW,
				y : point.y * _canvasW
			};
		}

		this.load = function(pos) {
			return levels[pos]();
		}

		this.levels = levels;
	}

	module.exports = levelLoader;

})();
