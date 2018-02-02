'use strict'

const express = require('express')

// Iniciamos las rutas de nuestro servidor/API
const router = express.Router()

//Importamos nuestros middlewares
const auth = require('../middlewares/jwt_middleware')

//Importamos nuestros controladores
const LoginCtrl = require('../controllers/LoginCtrl')
const UserCtrl = require('../controllers/UserCtrl')

router.get('/hola', auth, (req, res) => {
	res.send({ message: 'Hola mundo!' })
})

router.post('/login/web', LoginCtrl.loginWeb)

router.get('/usuarios', UserCtrl.index)
router.post('/usuarios', UserCtrl.store)
router.get('/usuarios/:id', UserCtrl.show)
router.delete('/usuarios/:id', UserCtrl.destroy)


module.exports = router