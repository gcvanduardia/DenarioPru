import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AlertController } from '@ionic/angular';
import { Plugins, CameraResultType, Capacitor, FilesystemDirectory, CameraPhoto, CameraSource } from '@capacitor/core';
import { Platform } from '@ionic/angular';

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DbService {

  documento = '';
  clave = '';
  token;
  productos = [];
  producto;
  newName;
  newDescripcion;
  newPrecio;
  newImagen1;
  newImagen2;
  newImagen3;
  newImagen4;
  newImagen5;
  newfotos = [];
  prodfotos = [];

  constructor(
    public router: Router,
    public http: HttpClient,
    public alertController: AlertController,
    public platform: Platform,
  ) { 
    Storage.get({ key: 'token' })
      .then((res) => {
        console.log('lectura de memoria: ', res);
        if (res.value != null) {
          this.token = res.value;
          this.router.navigate(['/home']);
        }
      })
      .catch((err) => {
        console.log('Falló lectura de memoria: ', err);
      });
    this.httpHome();
  }

  httpHome() {
    let url = 'http://localhost';
    this.http.get(url)
      .subscribe((res) => { 
          console.log(res);
        },
        (err: any) => {
          console.log('Error: ' + JSON.stringify(err));
        }
      
      );
  }


  login() {
    console.log('Login');
    if (this.documento != undefined && this.clave != undefined) {
      let url = 'http://localhost/login';
      let body = {
        documento: this.documento,
        clave: this.clave
      };
      let HTTPoptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.http.post(url, body, HTTPoptions)
        .subscribe((res:any) => { 
          console.log(res);
          this.documento = "";
          this.clave = "";
          this.token = res.token;
          Storage.set({ key: 'token', value: this.token })
            .then(() => {
              this.getProductos();
              this.router.navigate(['/home']);
            })
            .catch((err) => {
              console.log('Falló lectura de memoria')
            })
        }, (err) => { 
            console.log(err);
            alert('Usuario y/o contraseña incorrecto');
        });
    } else {
      alert('Por favor completa los datos');
    }
  }

  getProductos() {
    let url = 'http://localhost/productos';
      let HTTPoptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        })
      };
      this.http.get(url, HTTPoptions)
        .subscribe((res:any) => { 
          this.productos = res;
          console.log('Productos: ', this.productos);
        }, (err) => { 
            console.log(err);
            this.router.navigate(['/login']);
        });
  }

  getFotosProdArr() {
    this.prodfotos = [];
    if(this.producto.imagen1 != null && this.producto.imagen1 != "null"){this.prodfotos.push(this.producto.imagen1)}
    if(this.producto.imagen2 != null && this.producto.imagen2 != "null"){this.prodfotos.push(this.producto.imagen2)}
    if(this.producto.imagen3 != null && this.producto.imagen3 != "null"){this.prodfotos.push(this.producto.imagen3)}
    if(this.producto.imagen4 != null && this.producto.imagen4 != "null"){this.prodfotos.push(this.producto.imagen3)}
    if(this.producto.imagen5 != null && this.producto.imagen5 != "null"){this.prodfotos.push(this.producto.imagen5)}
    console.log('prodfotos: ', this.prodfotos);
  }

  irProducto(producto) {
    console.log(producto);
    this.producto = producto;
    this.getFotosProdArr();
    this.router.navigate(['/producto']);
  }

  async borrarProductoAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirma!',
      message: 'Estas seguro de borrar este producto?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.borrarProducto();
          }
        }
      ]
    });

    await alert.present();
  }

  borrarProducto() {
    console.log("borrar producto: ", this.producto);

    let url = 'http://localhost/productos/delete/' + this.producto.id;
    let HTTPoptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    this.http.delete(url, HTTPoptions)
      .subscribe((res:any) => { 
        console.log('mensaje: ', res);
        this.router.navigate(['/home']);
      }, (err) => { 
          console.log(err);
          this.router.navigate(['/login']);
      });
  }

  irAddProducto() {
    this.router.navigate(['/addproducto']);
  }

  addProduct() {
    let newProducto = {
      nombre: this.newName,
      descripcion: this.newDescripcion,
      precio: this.newPrecio,
      imagen1: this.newImagen1,
      imagen2: this.newImagen2,
      imagen3: this.newImagen3,
      imagen4: this.newImagen4,
      imagen5: this.newImagen5,
    }
    console.log("Crear producto: ", newProducto);

    let url = 'http://localhost/productos/add';
    let HTTPoptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    let body = newProducto;
    this.http.post(url, body, HTTPoptions)
      .subscribe((res:any) => { 
        console.log('mensaje: ', res);
        this.newName = "";
        this.newDescripcion = "";
        this.newPrecio = "";
        this.newfotos = [];
        this.router.navigate(['/home']);
      }, (err) => { 
          console.log(err);
          this.router.navigate(['/login']);
      });
    
  }

  async takeImgNewProd() {
    if (this.newfotos.length < 5) {
      console.log('tomar foto ',this.newfotos.length);
      let imagen = await Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.DataUrl
      });
      this.newfotos.unshift(imagen.dataUrl);
      if(this.newfotos.length == 1) this.newImagen1 = imagen.dataUrl;
      if(this.newfotos.length == 2) this.newImagen2 = imagen.dataUrl;
      if(this.newfotos.length == 3) this.newImagen3 = imagen.dataUrl;
      if(this.newfotos.length == 4) this.newImagen4 = imagen.dataUrl;
      if(this.newfotos.length == 5) this.newImagen5 = imagen.dataUrl;
    }
  }

  irUploadProducto() {
    this.router.navigate(['/uploadproducto']);
  }

  uploadProduct() {
    console.log("Actualizar producto: ", this.producto);

    let url = 'http://localhost/productos/upload/'+this.producto.id;
    let HTTPoptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    };
    let body = this.producto;
    this.http.put(url, body, HTTPoptions)
      .subscribe((res:any) => { 
        console.log('mensaje: ', res);
        this.router.navigate(['/producto']);
      }, (err) => { 
          console.log(err);
          this.router.navigate(['/login']);
      });
  }
  

}
