const express = require('express');
const app = express();
const morgan = require('morgan'); //libreria morgan que nos permite saber las solicitudes que provienen de la interfaz
const mongoose = require('mongoose');// libreria para conectar con la DB
const cors = require('cors');
const authJWT = require('./helpers/jwt');// la clase para encriptar el token
const errorHandler = require('./helpers/error-handler');//manejador de errores


//se llama la libreria dotenv
require('dotenv/config');
const api = process.env.API_URL;
app.use(cors());
app.options('*',cors());

//middleway
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJWT());
app.use(errorHandler());
//routers
const productsRouter = require('./routers/products');
const usersRouter = require('./routers/users');
const ordersRouter = require('./routers/orders');
const categoryRouter = require('./routers/categorys');
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categorys`, categoryRouter);

//conexion a la base de datos
mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    console.log('Conexion realizada');  
}) 
.catch((err)=>{
    console.log(err);
});

//server
app.listen(3000, ()=>{ console.log('server is running http://localhost:3000');
})