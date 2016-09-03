import { Component } from '@angular/core';
import { AfterViewChecked } from '@angular/core';
import '../../public/css/styles.css';
@Component({
  selector: 'my-app',
  template: require('./app.component.html'),
  styles: [require('./app.component.css')]
})

export class AppComponent implements AfterViewChecked {

  ngAfterViewChecked () {
    require("../p2/Main");
  }

}
