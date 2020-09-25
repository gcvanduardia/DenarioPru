import { Component } from '@angular/core';
import { DbService } from "../services/db.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    public db:DbService
  ) { }
  
  ionViewWillEnter() {
    this.db.getProductos();
  }

}
