const express = require('express');
const { dbConnection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');


//Crear el servidor de express
const app = express();

//Base de Datos
dbConnection();

//CORS
app.use(cors())

//Directorio Público
app.use( express.static('public')); //public es la carpeta con html y css

//Lectura y parseo del body raw
app.use( express.json()); //Sirve para leer datos de postman

//Rutas
app.use('/api/auth', require('./routes/auth')); // routes/auth es la carpeta donde estan las rutas

//Escuchar peticiones 
app.listen( process.env.PORT , () => {
    console.log(`Servidor correctamente corriendo en puerto ${ process.env.PORT  }`);
});