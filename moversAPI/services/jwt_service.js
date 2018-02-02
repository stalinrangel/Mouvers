//service para el manejo del token

'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const config = require('../config')

function createToken (user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(), //Fecha de creacion del token en formato unix
    exp: moment().add(1, "minutes").unix(), //Duracion del token
  }

  return jwt.encode(payload, config.SECRET_TOKEN)
}


//No esta en uso por error deprecated promesas
function decodeToken(token) {
	const decoded = new Promise((resolve, reject) => {
		try {
			const payload = jwt.decode(token, config.SECRET_TOKEN)

			if(payload.exp <= moment().unix()) {
				reject({
					status: 401,
					message: 'El token ha expirado.'
				})
			}

			resolve(payload.sub)
		} catch (err) {
			reject({
				status: 500,
				message: 'Invalid Token.'
			})
		}
	})
}

module.exports = {
	createToken,
	decodeToken
}