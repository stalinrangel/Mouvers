'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

var UserSchema = new Schema({
		email: { type: String, unique: true, index: true, lowercase: true },
        password: { type: String, select: true},
        nombre: String,
        apellido: String,
        imagen: String,
        tipo_usuario: String, //admin - cliente
        tipo_registro: String,
        codigo_verificacion: { type: String, default: null}
        
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

UserSchema.pre('save', function (next) {
	let user = this
	if (!user.isModified('password')) return next()

	bcrypt.genSalt(10, function (err, salt)  {
		if (err) return next(err)

		bcrypt.hash(user.password, salt, null, function (err, hash)  {
			if (err) return next(err)

			user.password = hash
			next()
		})
	})
})

module.exports = mongoose.model('User', UserSchema)