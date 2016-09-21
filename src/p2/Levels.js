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

		var levels = [levelFour];

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

		function levelTwo() {

			createStartPoint({
				"x" : 0.11624997854232788,
				"y" : 0.6937499642372131
			}, 0.08933781832456589);

			createTerrain([{
				outer : [{
					"x" : 0,
					"y" : 0.550000011920929
				}, {
					"x" : 0.32500001788139343,
					"y" : 0.6500000357627869
				}, {
					"x" : 0.6000000238418579,
					"y" : 0.625
				}, {
					"x" : 0.875,
					"y" : 0.625
				}, {
					"x" : 0.9750000238418579,
					"y" : 0.4749999940395355
				}, {
					"x" : 0.8500000238418579,
					"y" : 0.25
				}, {
					"x" : 0.625,
					"y" : 0.17499999701976776
				}, {
					"x" : 0.2750000059604645,
					"y" : 0.20000000298023224
				}, {
					"x" : 0,
					"y" : 0.2750000059604645
				}],
				holes : [[{
					"x" : 0.45000001788139343,
					"y" : 0.2750000059604645
				}, {
					"x" : 0.45000001788139343,
					"y" : 0.22500000894069672
				}, {
					"x" : 0.5,
					"y" : 0.22500000894069672
				}, {
					"x" : 0.5,
					"y" : 0.2750000059604645
				}], [{
					"x" : 0.25,
					"y" : 0.574999988079071
				}, {
					"x" : 0.25,
					"y" : 0.5250000357627869
				}, {
					"x" : 0.30000001192092896,
					"y" : 0.5250000357627869
				}, {
					"x" : 0.30000001192092896,
					"y" : 0.574999988079071
				}], [{
					"x" : 0.824999988079071,
					"y" : 0.5250000357627869
				}, {
					"x" : 0.824999988079071,
					"y" : 0.4749999940395355
				}, {
					"x" : 0.875,
					"y" : 0.4749999940395355
				}, {
					"x" : 0.875,
					"y" : 0.5250000357627869
				}]]
			}]);

			// create a wall

			createWalls([[{
				"x" : 0.22500000894069672,
				"y" : 0.45000001788139343
			}, {
				"x" : 0.675000011920929,
				"y" : 0.45000001788139343
			}, {
				"x" : 0.7875000238418579,
				"y" : 0.4000000059604645
			}, {
				"x" : 0.4749999940395355,
				"y" : 0.42500001192092896
			}, {
				"x" : 0.16249997913837433,
				"y" : 0.4000000059604645
			}]]);

			createSensors([{
				"x" : 0.2750000059604645,
				"y" : 0.550000011920929
			}, {
				"x" : 0.8500000238418579,
				"y" : 0.5
			}, {
				"x" : 0.4749999940395355,
				"y" : 0.25
			}]);

			createDestination([{
				"x" : 0.4000000059604645,
				"y" : 0.02500000037252903
			}, {
				"x" : 0.4000000059604645,
				"y" : 0
			}, {
				"x" : 0.550000011920929,
				"y" : 0
			}, {
				"x" : 0.550000011920929,
				"y" : 0.02500000037252903
			}]);

		}

		function levelThree() {

			createStartPoint({
				"x" : 0.8612500429153442,
				"y" : 0.7162500023841858
			}, 0.06543124467134476);

			createTerrain([{
				outer : [{
					"x" : 0.925000011920929,
					"y" : 0.675000011920929
				}, {
					"x" : -0.05000000074505806,
					"y" : 0.625
				}, {
					"x" : 0.05000000074505806,
					"y" : 0.42500001192092896
				}, {
					"x" : 0.925000011920929,
					"y" : 0.4749999940395355
				}],
				holes : [[{
					"x" : 0.05000000074505806,
					"y" : 0.574999988079071
				}, {
					"x" : 0.05000000074505806,
					"y" : 0.5250000357627869
				}, {
					"x" : 0.10000000149011612,
					"y" : 0.5250000357627869
				}, {
					"x" : 0.10000000149011612,
					"y" : 0.574999988079071
				}]]
			}, {
				outer : [{
					"x" : 0.05000000074505806,
					"y" : 0.2750000059604645
				}, {
					"x" : 0.05000000074505806,
					"y" : 0.10000000149011612
				}, {
					"x" : 0.4000000059604645,
					"y" : 0.07500000298023224
				}, {
					"x" : 0.3499999940395355,
					"y" : 0.3499999940395355
				}],
				holes : []
			}]);

			createWalls([[{
				"x" : 0.45000001788139343,
				"y" : 0.22500000894069672
			}, {
				"x" : 0.699999988079071,
				"y" : 0.15000000596046448
			}, {
				"x" : 0.699999988079071,
				"y" : 0
			}, {
				"x" : 0.75,
				"y" : 0
			}, {
				"x" : 0.75,
				"y" : 0.20000000298023224
			}], [{
				"x" : 0.949999988079071,
				"y" : 0.42500001192092896
			}, {
				"x" : 0.22500000894069672,
				"y" : 0.4000000059604645
			}, {
				"x" : 0.949999988079071,
				"y" : 0.3499999940395355
			}]]);

			createSensors([{
				"x" : 0.07500000298023224,
				"y" : 0.550000011920929
			}, {
				"x" : 0.125,
				"y" : 0.375
			}, {
				"x" : 0.5,
				"y" : 0.30000001192092896
			}]);

			createDestination([{
				"x" : 0.800000011920929,
				"y" : 0.02500000037252903
			}, {
				"x" : 0.800000011920929,
				"y" : 0
			}, {
				"x" : 0.9000000357627869,
				"y" : 0
			}, {
				"x" : 0.9000000357627869,
				"y" : 0.02500000037252903
			}]);
		}

		function levelFour() {

			createStartPoint({
				"x" : 0.14874997735023499,
				"y" : 0.7212499976158142
			}, 0.08746424317359924);

			createTerrain([{
				outer : [{
					"x" : -0.0012500286102294922,
					"y" : 0.7162500023841858
				}, {
					"x" : 0.14874997735023499,
					"y" : 0.6687500476837158
				}, {
					"x" : 0.32124996185302734,
					"y" : 0.7112500071525574
				}, {
					"x" : 0.3187500238418579,
					"y" : 0.4287499785423279
				}, {
					"x" : 0.47874999046325684,
					"y" : 0.20624998211860657
				}, {
					"x" : 0.001249939203262329,
					"y" : 0.2137499749660492
				}],
				holes : [[{
					"x" : 0.2750000059604645,
					"y" : 0.30000001192092896
				}, {
					"x" : 0.2750000059604645,
					"y" : 0.25
				}, {
					"x" : 0.32500001788139343,
					"y" : 0.25
				}, {
					"x" : 0.32500001788139343,
					"y" : 0.30000001192092896
				}]]
			}, {
				outer : [{
					"x" : 0.7250000238418579,
					"y" : 0.699999988079071
				}, {
					"x" : 0.6500000357627869,
					"y" : 0.17499999701976776
				}, {
					"x" : 0.949999988079071,
					"y" : 0.17499999701976776
				}, {
					"x" : 0.949999988079071,
					"y" : 0.675000011920929
				}],
				holes : []
			}]);

			createWalls([[{
				"x" : 0.574999988079071,
				"y" : 0.32500001788139343
			}, {
				"x" : 0.550000011920929,
				"y" : 0
			}, {
				"x" : 0.625,
				"y" : 0
			}]]);

			createSensors([{
				"x" : 0.30000001192092896,
				"y" : 0.2750000059604645
			}, {
				"x" : 0.574999988079071,
				"y" : 0.42500001192092896
			}, {
				"x" : 0.7250000238418579,
				"y" : 0.05000000074505806
			}]);

			createDestination([{
				"x" : 0.800000011920929,
				"y" : 0.02500000037252903
			}, {
				"x" : 0.800000011920929,
				"y" : 0
			}, {
				"x" : 0.9000000357627869,
				"y" : 0
			}, {
				"x" : 0.9000000357627869,
				"y" : 0.02500000037252903
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
