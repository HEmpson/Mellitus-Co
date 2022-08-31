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
const passport = require('./passport')

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
app.use('/posts', postRouter)

app.use('/user', userRouter)

app.use(
    '/bootstrap',
    express.static(__dirname + '/node_modules/bootstrap/dist')
)

app.listen(process.env.PORT || 3000, () => {
    console.log('App is running!')
})

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
        secure: app.get('env') === 'production'
        },
    })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
}


app.use(passport.authenticate('session'))


// enable flash
app.use(flash())