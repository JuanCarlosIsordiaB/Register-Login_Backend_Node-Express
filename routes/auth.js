const express = require('express');
const { check } = require('express-validator');
const router = express.Router();

//Importaciones de acciones
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

router.post(
    '/register',// route
    [ 
        // agarra los valores de postman body raw y hace las validaciones
        check('name','El nombre es obligatorio').not().isEmpty(),//express-validator
        check('email', 'El email es obligatorio').isEmail(),
        check('password','La contraseña debe ser mayor a 6 caracteres').isLength({min: 6}),
        validarCampos
    
    ],
    crearUsuario //controller
); 

router.post(
    '/login',
    [
        check('email','Debe ser un email valido').isEmail(),
        check('password', 'Debe de contener al menos 6 digitos').isLength({min: 6}),
        validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT,revalidarToken);


module.exports = router;

