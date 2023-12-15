const jwt = require('jsonwebtoken');

const generarJWT = (uid, name) => {

    return new Promise((resolve, reject) => {

        //payload es la información a "encriptar"
        const payload = { uid, name};

        jwt.sign(payload, process.env.SECRET_JWT_SEED, {

            expiresIn: '24h'

        }, (error, token) => {

            if(error){
                console.log(error);
                reject('No se pudo generar el token');
            }

            resolve(token);

        })
    });
}

module.exports = {
    generarJWT
}