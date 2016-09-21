/**
 *
 */

(function(window) {

	// var b2Vec2 = Box2D.Common.Math.b2Vec2;
	// var b2World = Box2D.Dynamics.b2World;

	var GRAVITY = 30;
	var BRUSH_R = 15;

  var STEP_AMOUNT = 1 / 60;

	function Physics(element, scale, __globals) {
    this.__globals = __globals;
		this.resources = __globals._resources;
		this.bodyWrapperMap = {};


		// var gravity = new b2Vec2(0, GRAVITY);
		// this.world = new b2World(gravity, true);

    this.world = new p2.World({
			gravity: [0, -30]
		});

		this.world.defaultContactMaterial.friction = 0.5;
		this.world.defaultContactMaterial.restitution = 0;
		this.world.defaultContactMaterial.stiffness = 1e4;

		this.element = element; // most likely the canvas element
		this.context = element.getContext("2d");
		this.scale = scale || 30;
		this.dtRemaining = 0;
		// this.stepAmount = 1 / 60;
	}

	Physics.prototype.step = function(dt) {
		this.dtRemaining += dt;
		while (this.dtRemaining > STEP_AMOUNT) {
			this.dtRemaining -= STEP_AMOUNT;
			this.world.step(STEP_AMOUNT);
		}

		var bodies = this.world.bodies;


		this.context.clearRect(0, 0, this.element.width,
					this.element.height);

		var deadBodies = [];

		var drawLater = [];

    for (var i = 0; i < bodies.length; i++) {
      var obj = bodies[i].__wrapper;
			if (obj) {
				obj.update();
				if (obj.details.dead) deadBodies.push(obj);
				if (obj.details.zIndex > 0) {
					drawLater.push(obj);
				} else {
					obj.draw(this.context);
				}
			}
    }

		for ( var i in drawLater) {
			drawLater[i].draw(this.context);
		}

		// Remove dead bodies
		for (var i = 0; i < deadBodies.length; i++) {
			this.world.removeBody(deadBodies[i].body);
		}
	};

	Physics.prototype.onMouseDown = function(callback) {

		function handleMouseDown(e) {
			e.preventDefault();
			callback(e);
		}

		this.element.addEventListener("mousedown", handleMouseDown);

	};

	Physics.prototype.onMouseUp = function(callback) {

		function handleMouseUp(e) {
			e.preventDefault();
			callback(e);
		}

		this.element.addEventListener("mouseup", handleMouseUp);

	};

	Physics.prototype.onClick = function(callback) {

		function handleClick(e) {
			e.preventDefault();
			callback(e);
		}

		this.element.addEventListener("click", handleClick);
	};

	Physics.prototype.rightClickToCreate = function(callback) {

		function handleRightClick(e) {
			e.preventDefault();
			callback(e);
		}

		this.element.addEventListener("contextmenu", handleRightClick);
	};

	Physics.prototype.onTouchEnd = function(callback) {

		function handleTouchEnd(e) {
			e.preventDefault();
			callback(e);
		}

		this.element.addEventListener("touchend", handleTouchEnd);
	};

	Physics.prototype.onTouchStart = function(callback) {

		function handleTouchStart(e) {
			e.preventDefault();
			callback(e);
		}

		this.element.addEventListener("touchstart", handleTouchStart);
	};

	Physics.prototype.collision = function() {

    this.world.on('beginContact', function(evt) {
      var bodyA = evt.bodyA.__wrapper;
      var bodyB = evt.bodyB.__wrapper;

      if (bodyA.beginContact) {
				bodyA.beginContact(bodyB);
			}
			if (bodyB.beginContact) {
				bodyB.beginContact(bodyA);
			}
    });
	};

	window.Physics = Physics;

	module.exports = Physics;
})(window);
