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

require('../lib/dump.js');
require('../lib/clipper.js');

//there is a weird bug for clipper.js if putting box2dweb at the beginning
// which will make .AddPolygons become undefined
require('../lib/Box2dWeb-2.1.a.3.js');
require('../lib/poly2tri.js');
