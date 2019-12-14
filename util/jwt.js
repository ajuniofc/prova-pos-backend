const jwt = require('jsonwebtoken');

const PASS = 'euvoupracasa';

const verificarTokenJWT = (req, resp, next)  => {
    if (req.url == '/login') {
        next();
    }

    var token = req.headers['x-access-token'];
    try {
        var decodificado = jwt.verify(token, PASS);
        next();
    } catch (e) {
        console.log(e.message);
        resp.status(500).send({ message: 'token invalido', error: e.message });
    }
}

module.exports = { verificarTokenJWT, PASS };