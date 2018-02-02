'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')

//Importamos el servivio para la creacion del token
const jwt_service = require('../services/jwt_service')

function loginWeb(req, res) {
	User.find({ email: req.body.email }, (err, user) => {
		if (err) return res.status(500).send({ error: `Error al realizar la petición: ${err}`});

		if (user.length === 0) return res.status(404).send({ message: 'No existe el usuario.'})	

		req.user = user

		return res.status(200).send({ token: jwt_service.createToken(user), usuario: user})
	
	})
}

function loginApp(req, res) {
	console.log('login app');
}

module.exports = {
	loginWeb,
	loginApp
}
