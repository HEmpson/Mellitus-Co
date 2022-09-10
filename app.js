// Imports
const express = require('express')
const exphbs = require('express-handlebars')
const req = require('express/lib/request')
const appRouter = require('./routes/appRouter')
const postRouter = require('./routes/postRouter')
const userRouter = require('./routes/userRouter')
const models = require('./models')
const flash = require('express-flash')
const session = require('express-session')

// Set your app up as an express app
const app = express()

// Set Location of static resources
app.use(express.static('public'))

// To Parse JSON Objects
app.use(express.json())

// To Parse Body From URL
app.use(express.urlencoded({ extended: true }))

app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
    })
)

app.set('view engine', 'hbs')

// enable flash
app.use(flash())

app.use(
    session({
        // The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'mellitus-co',
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production',
        },
    })
)

const passport = require('./passport')
app.use(passport.authenticate('session'))

// File upload and download routes

app.use('/', appRouter)

app.use('/posts', postRouter)

app.use('/user', userRouter)

app.use(
    '/bootstrap',
    express.static(__dirname + '/node_modules/bootstrap/dist')
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // Trust first proxy
}

app.listen(process.env.PORT || 3000, () => {
    console.log('App is running!')
})
