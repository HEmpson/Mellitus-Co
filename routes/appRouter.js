const express = require('express')
const appRouter = express.Router()
const appController = require('../controllers/appController')

// put routes here

appRouter.get('/', appController.getTestPage)
appRouter.get('/dashboard', appController.getDashboard)

module.exports = appRouter
