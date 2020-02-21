import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  testForm : FormGroup
  ngOnInit(): void {
    const ipPattern = 
    "(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
    this.testForm = new FormGroup({
      inp: new FormControl('128.129.80.66', Validators.pattern(ipPattern))
    });
  }
  
  title = 'modal-form-material';
  isModalShow: boolean = false;

  toogleModal() {
    this.isModalShow = !this.isModalShow;
  }
}
