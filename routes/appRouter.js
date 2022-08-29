const express = require('express')
const appRouter = express.Router()
const appController = require('../controllers/appController')

// put routes here

appRouter.get('/', appController.getTestPage)

module.exports = appRouter
