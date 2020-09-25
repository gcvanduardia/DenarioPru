import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from "../services/db.service";

@Component({
  selector: 'app-uploadproducto',
  templateUrl: './uploadproducto.page.html',
  styleUrls: ['./uploadproducto.page.scss'],
})
export class UploadproductoPage implements OnInit {

  constructor(
    public router: Router,
    public db:DbService
  ) { }

  ngOnInit() {
  }  

  ionViewWillEnter() {
    if (this.db.producto == undefined) {
      this.router.navigate(['/home']);
    }
  }

}
