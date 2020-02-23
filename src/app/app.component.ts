import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  directForm: FormGroup;
  ngOnInit(): void {}

  title = 'modal-form-material';
  isModalShow: boolean = false;
  fromFormToApp(event) {
    this.directForm = event;
  }
  toogleModal() {
    this.isModalShow = !this.isModalShow;
  }
}
