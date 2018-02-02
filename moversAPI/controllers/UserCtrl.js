'use strict'

const mongoose = require('mongoose')
const User = require('../models/User')

function index(req, res) {
	User.find({}, (err, usuarios) => {
		if (err) return res.status(500).send({ error: `Error al realizar la petición: ${err}`})

		if (usuarios.length === 0) return res.status(404).send({ message: 'No existen usuarios'})

		return res.status(200).send({ usuarios: usuarios})
	})
}

function store(req, res) {

	console.log(req.body)

	if(!req.body.email ||
		!req.body.password ||
		!req.body.nombre ||
		!req.body.tipo_usuario ||
		!req.body.tipo_registro)
	{
		return res.status(409).send({ message: 'Faltan datos necesarios para el proceso de alta.'})
	}

	let user = new User({
		email: req.body.email,
		password: req.body.password, 
		nombre: req.body.nombre,
		apellido: req.body.apellido,
		imagen: req.body.imagen,
		tipo_usuario: req.body.tipo_usuario,
		tipo_registro: req.body.tipo_registro
	})

	user.save((err, nuevoUsuario) => {
		if (err) return res.status(500).send({ error: `Error al crear el usuario: ${err}`})

		return res.status(200).send({ message: 'Usuario creado con éxito.', usuario: nuevoUsuario})
	})
}

function show(req, res) {
	let id = req.params.id

	User.findById(id, (err, user) => {
		if (err) return res.status(500).send({ error: `Error al realizar la petición: ${err}`})

		if (user.length === 0) return res.status(404).send({ message: `No existe el usuario con id = ${id}`})

		return res.status(200).send({ usuario: user})
	})
}

function update(req, res) {
	console.log('hola');
}

function destroy(req, res) {
	let id = req.params.id

	User.findById(id, (err, user) => {
		if (err) return res.status(500).send({ error: `Error al realizar la petición: ${err}`})

		if (!user) return res.status(404).send({ message: `No existe el usuario con id = ${id}`})

		user.remove(err => {
			if (err) return res.status(500).send({ error: `Error al realizar la petición: ${err}`})

			return res.status(200).send({ message: 'Usuario eliminado con éxito.'})
		})
	})
}

module.exports = {
	index,
	store,
	show,
	update,
	destroy
}