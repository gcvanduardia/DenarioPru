import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  iconoClave="eye-off";
  textoClave="password";

  constructor(
    public db:DbService
  ) { }

  ngOnInit() {
  }

  verClave(){
    if(this.iconoClave == "eye-off"){
      this.iconoClave = "eye";
      this.textoClave = "text";
    }else{
      this.iconoClave = "eye-off";
      this.textoClave = "password";
    }
  }

}
