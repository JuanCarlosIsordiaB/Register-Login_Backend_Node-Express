const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');



const crearUsuario = async(req, res = express.response) => {

    const {email, password} = req.body;

    try{

        //Verifica si el correo ya existe
        let usuario = await Usuario.findOne({email})
        if(usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya ha sido registrado'
            })
        }

        //Crea el usuario con los parametros de Usuario
        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync(10);
        usuario.password = bcrypt.hashSync( password, salt );

        //Agrega el usuario a la Base de Datos
        await usuario.save();

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        //Envia confirmacion de exito
        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            msg: 'Usuario Creado con Exito',
            token
        })

    }catch(error){
        res.status(500).json({
            ok: false,
            msg: 'Error creating new user',
        })
        throw new Error(error.message);
    }

    
};

const loginUsuario= async (req, res = express.response) => {
    
    const { email, password} = req.body;

    try{
        //Verificar si la cuenta existe
        let usuario = await Usuario.findOne({email})
        if(!usuario ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo no existe'
            })
        }

        //Confirmar los password
        const validPassword = bcrypt.compareSync( password, usuario.password);

        if(!validPassword){
            return res.status(500).json({
                ok: false,
                msg: 'Usuario o contraseña Incorrecta',
            })
        }

        //Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            msg: 'Login Exitoso',
            token
        })

    }catch(error){
        console.log(error)
        res.status(404).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
   
};

const revalidarToken = async (req, res = express.response) => {

    const {uid,name} = req;

    // generar un nuevo JWT y retornarlo en esta peticion
    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        token
    })
};

module.exports = {
    crearUsuario, loginUsuario, revalidarToken
}