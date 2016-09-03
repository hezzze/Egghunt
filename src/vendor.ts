// Angular 2
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router-deprecated';

// RxJS
import 'rxjs';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...

//there is a weird bug for clipper.js if putting box2dweb at the beginning
// which will make .AddPolygons become undefined
//require('../lib/Box2dWeb-2.1.a.3.js');

//needed for global reference to the Clipper lib
//not quite understand how this works
//http://stackoverflow.com/questions/12709074/how-do-you-explicitly-set-a-new-property-on-window-in-typescript
window['ClipperLib'] = require('../lib/clipper.js');
window['p2'] = require('../lib/p2.min.js');

require('../lib/poly2tri.js');
