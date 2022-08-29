// Imports
const express = require('express')
const exphbs = require('express-handlebars')
const req = require('express/lib/request')
const appRouter = require('./routes/appRouter')
const fileRouter = require('./routes/fileRouter')
const userRouter = require('./routes/userRouter')
const models = require('./models')

// Set your app up as an express app
const app = express()

// Set Location of static resources
app.use(express.static('public'))

// To Parse JSON Objects
app.use(express.json())

// To Parse Body From URL
app.use(express.urlencoded({ extended: false }))

app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
    })
)

app.set('view engine', 'hbs')

// routes to pages
app.use('/', appRouter)

// File upload and download routes
app.use('/files', fileRouter)

app.use('/user', userRouter)

app.use(
    '/bootstrap',
    express.static(__dirname + '/node_modules/bootstrap/dist')
)

app.listen(process.env.PORT || 3000, () => {
    console.log('App is running!')
})
