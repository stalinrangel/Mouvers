'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const router = require('./routes/routes');

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.use('/api', router)

module.exports = app