import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DbService } from "../services/db.service";

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
})
export class ProductoPage implements OnInit {

  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  constructor(
    public router: Router,
    public db: DbService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if (this.db.producto == undefined) {
      this.router.navigate(['/home']);
   }
  }

}
