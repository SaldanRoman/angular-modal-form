import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'modal-form-material';
  isModalShow: boolean = false;

  toogleModal() {
    this.isModalShow = !this.isModalShow;
  }
}
