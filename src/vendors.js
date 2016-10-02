//there is a weird bug for clipper.js if putting box2dweb at the beginning
// which will make .AddPolygons become undefined
window['Box2D'] = require('../lib/Box2dWeb-2.1.a.3.js');

//needed for global reference to the Clipper lib
//not quite understand how this works
//http://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
window['ClipperLib'] = require('../lib/clipper.js');

//var poly2tri = require('poly2tri');
