import { Component, OnInit } from '@angular/core';
import { DbService } from "../services/db.service";

@Component({
  selector: 'app-addproducto',
  templateUrl: './addproducto.page.html',
  styleUrls: ['./addproducto.page.scss'],
})
export class AddproductoPage implements OnInit {

  constructor(
    public db:DbService
  ) { }

  ngOnInit() {
  }

}
