//middleware para verificar la valides del token

'use strict'

//Importamos el servivio para el manejo del token
//const jwt_service = require('../services/jwt_service')

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function isAuth(req, res, next) {

	//verificar si viene el header authorization
	if(!req.headers.authorization) {
	return res
	  .status(403)
	  .send({message: "Tu petición no tiene cabecera de autorización."});
	}

	const token = req.headers.authorization.split(' ')[1]

	try {
		const payload = jwt.decode(token, config.SECRET_TOKEN)

		if(payload.exp <= moment().unix()) {
			return res
			  .status(401)
			  .send({message: "El token ha expirado."});
		}

		req.user = payload.sub
		next()

	} catch (err) {
		return res
		  .status(401)
		  .send({message: "Token inválido."});
	}

	/*jwt_service.decodeToken(token)
		.then(response => {
			req.user = response
			next()
		})
		.catch(response => {
			res.status(response.status)
		})*/
}

module.exports = isAuth
