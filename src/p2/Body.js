/**
 *
 */
(function(window) {

	//Import Box2D constructors
	// var b2Vec2 = Box2D.Common.Math.b2Vec2;
	// var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	// var b2Body = Box2D.Dynamics.b2Body;
	// var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	// var b2Fixture = Box2D.Dynamics.b2Fixture;
	// var b2World = Box2D.Dynamics.b2World;
	// var b2MassData = Box2D.Collision.Shapes.b2MassData;
	// var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	// var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	// var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
	// var b2Transform = Box2D.Common.Math.b2Transform;
	// var b2Mat22 = Box2D.Common.Math.b2Mat22;
	// var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
	// var b2PrismaticJointDef = Box2D.Dynamics.Joints.b2PrismaticJointDef;

  var FLAG = false;

  const DEFAULTS = {
		shape : "block",
		width : 120,
		height : 120,
		radius : 30,
		life : Infinity,
		dead : false,
		zIndex : 0
	};

	Body.prototype.fixtureDefaults = {
		density : 2,
		friction : 1,
		restitution : 0.2
	};

	Body.prototype.definitionDefaults = {
		active : true,
		allowSleep : true,
		angle : 0,
		angularVelocity : 0,
		awake : true,
		bullet : false,
		fixedRotation : false
	};

	function Body(physics, details) {

		this.details = details || {};

		// // Create the definition
		// this.definition = new b2BodyDef();
    //
		// // Set up the definition
		// for ( var k in this.definitionDefaults) {
		// 	this.definition[k] = details[k] || this.definitionDefaults[k];
		// }
		// this.definition.position = new b2Vec2(details.x / physics.scale || 0,
		// 		details.y / physics.scale || 0);
		// this.definition.linearVelocity = new b2Vec2(details.vx / physics.scale
		// 		|| 0, details.vy / physics.scale || 0);
		// this.definition.userData = this;
		// this.definition.type = details.type == "static"
		// 		? b2Body.b2_staticBody
		// 		: b2Body.b2_dynamicBody;

		// // Create the Body
		// this.body = physics.world.CreateBody(this.definition);

    //TODO setup dynamic or static
    this.body = new p2.Body({
      mass: details.type == "static" ? 0 : 1,
    });

    this.body.__wrapper = this;

    var body = this.body;

    body.position = screenToWorld({
      x: details.x || 0,
      y: details.y || 0
    });

		// // Create the fixture
		// this.fixtureDef = new b2FixtureDef();
		// for ( var l in this.fixtureDefaults) {
		// 	this.fixtureDef[l] = details[l] || this.fixtureDefaults[l];
		// }

		for ( var k in DEFAULTS) {
			this.details[k] = details[k] || DEFAULTS[k];
		}

		switch (details.shape) {
			case "circle" :
				details.radius = details.radius || DEFAULTS.radius;
        var circleShape = new p2.Circle({ radius: details.radius/physics.scale});
        circleShape.sensor = details.isSensor ? true : false;
        body.addShape(circleShape);

				// this.fixtureDef.shape = new b2CircleShape(details.radius
				// 		/ physics.scale);
				break;
			case "polygon" :
        var polyPoints = details.points.map(screenToWorld).reverse();
        var polyShape = new p2.Convex({
          vertices: polyPoints
        });
        polyShape.sensor = details.isSensor ? true : false;
        body.addShape(polyShape);


				break;
			case "terrain" :
				break;
			case "block" :
			default :
				details.width = details.width || this.defaults.width;
				details.height = details.height || this.defaults.height;

        var boxShape = new p2.Box({
          width: details.width / physics.scale,
          height: details.height / physics.scale
        });

        boxShape.sensor = details.isSensor ? true : false;

        body.addShape(boxShape);

				// this.fixtureDef.shape = new b2PolygonShape();
				// this.fixtureDef.shape.SetAsBox(details.width / 2
				// 		/ physics.scale, details.height / 2 / physics.scale);
				break;
		}

		if (details.shape === "polygon") {

			// var triContext = new poly2tri.SweepContext(details.points, {
			// 	cloneArrays : true
			// });
      //
			// triContext.triangulate();
			// var triangles = triContext.getTriangles();
			// for ( var i in triangles) {
			// 	var verticesVec = [];
			// 	for ( var j in triangles[i].points_) {
			// 		var point = triangles[i].points_[j];
			// 		verticesVec.push({
			// 			x : point.x / physics.scale,
			// 			y : point.y / physics.scale
			// 		});
			// 	}
			// 	polyShape = new b2PolygonShape();
			// 	polyShape.SetAsVector(verticesVec);
			// 	this.fixtureDef.shape = polyShape;
			// 	var fixture = this.body.CreateFixture(this.fixtureDef);
			// 	if (details.isSensor)
			// 		fixture.SetSensor(details.isSensor);
			// }

		} else if (details.shape === "terrain") {
			var terrainTriangles = [];
			for (var i = 0; i < details.terrainPolys.length; i++) {
				var poly = details.terrainPolys[i];

				if (!poly.outer) continue;

				var triContext = new poly2tri.SweepContext(poly.outer, {
					cloneArrays : true
				});
				for ( var j in poly.holes) {
					triContext.addHole(poly.holes[j]);
				}

				try {
					triContext.triangulate();
				} catch (e) {

					console.log("I got this fixed!");

					var delta = 0.0001;
					var offsetted = [];
					for ( var k in poly.outer) {
						offsetted.push({
							x : poly.outer[k].x
									+ (Math.random() > 0.5 ? 1 : -1) * delta
									* k,
							y : poly.outer[k].y
									+ (Math.random() > 0.5 ? 1 : -1) * delta
									* k
						});
					}

					triContext = new poly2tri.SweepContext(offsetted, {
						cloneArrays : true
					});
					for ( var n in poly.holes) {
						triContext.addHole(poly.holes[n]);
					}

					triContext.triangulate();
				}
				terrainTriangles = terrainTriangles.concat(triContext
						.getTriangles()
						|| []);
			}

			for ( var i in terrainTriangles) {
				var verticesVec = [];
				for ( var j in terrainTriangles[i].points_) {
					var point = terrainTriangles[i].points_[j];
					verticesVec.push(screenToWorld(point));
				}

        body.addShape(new p2.Convex({
          vertices: verticesVec
        }));

				// polyShape = new b2PolygonShape();
				// polyShape.SetAsVector(verticesVec);
				// this.fixtureDef.shape = polyShape;
				// this.body.CreateFixture(this.fixtureDef);
			}

		} else {

      //TODO
			// var fixture = this.body.CreateFixture(this.fixtureDef);
			// if (details.isSensor)
			// 	fixture.SetSensor(details.isSensor);
		}

    //add body to the p2 world
    //and add the reference to the map if an id is defined
    physics.world.addBody(body);
    if (details.id) physics.bodyWrapperMap[details.id] = this;

		this.update = function() {
			details.life--;
			if (details.life < 0) {
				details.dead = true;
			}
		};

		this.draw = function(context) {
			var pos = this.body.position, angle = this.body.angle;

			context.save();
			context.translate(pos[0] * physics.scale, physics.__globals._canvasH - pos[1] * physics.scale);
			context.rotate(angle);

			if (this.details.color || this.details.patternImg) {
				context.fillStyle = this.details.color;

				switch (this.details.shape) {
					case "circle" :
						context.beginPath();
						context.arc(0, 0, this.details.radius, 0, Math.PI * 2);
						context.fill();
						break;
					case "polygon" :
						var points = this.details.points.map(translateForScreen);

            if (!FLAG) {
              console.log(points);
              FLAG = true;
            }

						context.beginPath();
						context.moveTo(points[0].x, points[0].y);
						for (var i = 1; i < points.length; i++) {
							context.lineTo(points[i].x, points[i].y);
						}
						context.fill();
						break;
					case "terrain" :

						if (this.details.patternImg) {
							var pattern = context.createPattern(
									this.details.patternImg, "repeat");
							context.fillStyle = pattern;

						}

						for ( var k in this.details.terrainPolys) {
							var poly = this.details.terrainPolys[k];

							if (!poly.outer) continue;

              var polyPoints = poly.outer.map(translateForScreen);

							context.beginPath();
							context.moveTo(polyPoints[0].x, polyPoints[0].y);
							for (var i = 1; i < polyPoints.length; i++) {
								context
										.lineTo(polyPoints[i].x,
												polyPoints[i].y);
							}
							context.closePath();
							context.fill();

						}

						for ( var k in this.details.terrainPolys) {
							var poly = this.details.terrainPolys[k];

							context.fillStyle = "black";
							var holes = poly.holes;
							for ( var i in holes) {
								var holePoints = holes[i].map(translateForScreen);
								context.beginPath();
								context.moveTo(holePoints[0].x, holePoints[0].y);
								for (var j = 1; j < holePoints.length; j++) {
									context.lineTo(holePoints[j].x, holePoints[j].y);
								}
								context.fill();
							}

						}

						break;
					case "block" :
						context.fillRect(-this.details.width / 2,
								-this.details.height / 2, this.details.width,
								this.details.height);
					default :
						break;
				}
			}

			if (this.details.image) {
				context.drawImage(this.details.image, -this.details.width / 2,
						-this.details.height / 2, this.details.width,
						this.details.height);

			}

			context.restore();

		};

    function screenToWorld(point) {
      return [point.x / physics.scale, point.y / physics.scale];
    }

    function translateForScreen(point) {
      return {
        x: point.x,
        y: -point.y
      };
    }

	}



	window.Body = Body;



	module.exports = Body;

})(window);
