const express = require('express');
const mysql = require('mysql');
const jwt = require("jsonwebtoken");

const bodyParser = require('body-parser');

const PORT =  80;

const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});


app.get('/',(req,res)=>{
  res.json({
    mensaje:'Holaa desde el servidor de prueba Denario!'
  });
});

//sigin
app.post('/signin',(req,res)=>{
  const sql = 'INSERT INTO usuarios SET ?'
  const usuarioObj = {
      nombres: req.body.nombres,
      apellidos: req.body.apellidos,
      documento: req.body.documento,
      correo: req.body.correo,
      clave: req.body.clave
  }
  connection.query(sql, usuarioObj, err=>{
    if(err) throw err;
    jwt.sign({usuarioObj},'denario',{expiresIn: '1d'}, (err,token)=>{
      if(err) throw err;
      res.json({
        usuarioObj,
        token
      });
    });
  });
});

//login
app.post("/login",(req,res)=>{
  const {documento, clave} = req.body;
  const sql = `SELECT * FROM usuarios WHERE documento = '${documento}' AND clave LIKE '${clave}'`
  connection.query(sql,(err,usuarios)=>{
    if(err) throw err;
    if(usuarios.length > 0){
      const usuarioObj = usuarios[0];
      jwt.sign({usuarioObj}, 'denario',{expiresIn: '1d'}, (err,token)=>{
        if(err) throw err;
        res.json({
          usuarioObj,
          token
        })
      });
    }else{
      res.sendStatus(404);
    }
  });
});

//mySql
var connection = mysql.createConnection({
    host     : 'localhost',
    port     : '8889',
    user     : 'root',
    password : 'root',
    database : 'Denario_mysql',
  });

  function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        jwt.verify(req.token,'denario', (err,authData)=>{ 
          if(err){ 
            res.sendStatus(403); 
          }else{
              next();
          }
        });  
    }else{
        res.sendStatus(403);
    }
  }

  app.get('/productos', verifyToken,(req,res)=>{
          
    const sql = 'SELECT * FROM productos';
    connection.query(sql,(err, results)=>{
        if(err) throw err;
        if(results.length > 0){
            res.json(results);
        }else{
          res.json({
            mensaje:'No hay productos'
          });
        }
    });

  });

  app.get('/productos/:id', verifyToken,(req,res)=>{

    const {id} = req.params;
    const sql = `SELECT * FROM productos WHERE id = ${id}`;
    connection.query(sql,(err, results)=>{
        if(err) throw err;
        if(results.length > 0){
            res.json(results[0]);
        }else{
            res.send('Producto no existe!');
            res.json({
              mensaje:'Producto no existe'
            });
        }
    });

  });

  app.post('/productos/add',verifyToken,(req,res)=>{
      const sql = 'INSERT INTO productos SET ?'
      const productoObj = {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          precio: req.body.precio,
          imagen1: req.body.imagen1,
          imagen2: req.body.imagen2,
          imagen3: req.body.imagen3,
          imagen4: req.body.imagen4,
          imagen5: req.body.imagen5
      }
      connection.query(sql, productoObj, err=>{
        if(err) throw err;
        res.json({
          mensaje:'Producto creado correctamente! '
        });
    });
  });


  app.put('/productos/upload/:id', verifyToken, (req,res)=>{
      const {id} = req.params;
      const {nombre, descripcion, precio, imagen1, imagen2, imagen3, imagen4, imagen5} = req.body;
      const sql = `UPDATE productos SET nombre='${nombre}',descripcion='${descripcion}',precio='${precio}',imagen1='${imagen1}',imagen2='${imagen2}',imagen3='${imagen3}',imagen4='${imagen4}',imagen5='${imagen5}' WHERE id=${id}`;
      connection.query(sql, err=>{
        if(err) throw err;
        res.json({
          mensaje:'Producto actualizado correctamente!'
        });
    });
  });

  app.delete('/productos/delete/:id', verifyToken, (req,res)=>{
    const {id} = req.params;
    const sql = `DELETE FROM productos WHERE id=${id}`;
    const sqlRai = 'ALTER TABLE productos AUTO_INCREMENT = 1';
    connection.query(sql, err=>{
      if(err) throw err;
      connection.query(sqlRai, err={});
      res.json({
        mensaje:'Producto borrado correctamente!'
      });
  });
});

  //check connect
  connection.connect(error =>{
      if(error){console.log('Error de SQL: ',error);} 
      else{console.log('Database server is running!');}
  });

  app.listen(PORT, ()=>{
    console.log("Server started!");
});
