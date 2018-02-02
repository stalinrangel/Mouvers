'use strict'

const mongoose = require('mongoose')
const app = require('./app');
const config = require('./config')

// Iniciamos la base de datos y el servidor
mongoose.connect(config.db, (err, res) => {

	if (err) {
		return  console.log(`Error al conectar a la BD: ${err}`);
	}

	console.log('Conexión a la BD establecida...!')

	app.listen(config.port, () => {
		console.log(`API REST corriendo en http://localhost:${config.port}`)
	})

})


