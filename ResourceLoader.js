(function(window) {
	function ResourceLoader(objList, callback) {
		this.objList = objList;
		this.onload = callback;
		this.resources = {};
		this.loadCount = 0;
	}

	ResourceLoader.prototype.loadResource = function(name, type, url) {

		var loader = this;
		var res;
		switch (type) {
			case "audio" :
				res = new Audio();
				break;
			case "image" :
				res = new Image();
				break;
			default :
				;
		}

		res.src = url;

		res.onload = function() {
			
			loader.resources[name] = res;
			
			if (++loader.loadCount == loader.objList.length)
				loader.onload(loader.resources);
		};

	};

	ResourceLoader.prototype.load = function() {
		for (var i = 0; i < this.objList.length; ++i) {
			var obj = this.objList[i];
			this.loadResource(obj.name, obj.type, obj.url);
		}
	};

	window.ResourceLoader = ResourceLoader;
})(window);
