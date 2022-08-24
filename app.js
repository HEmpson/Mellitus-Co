// Imports
const express = require('express')
const exphbs = require('express-handlebars')
const req = require('express/lib/request')
const appRouter = require('./routes/appRouter')

<<<<<<< HEAD
// Set your app up as an express app 
const app = express() 

app.use(express.static('public'))
=======
// Set your app up as an express app
const app = express()
>>>>>>> 99679ae9803e6e98e7541ce66f9972707bf31725

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

app.use(
    '/bootstrap',
    express.static(__dirname + '/node_modules/bootstrap/dist')
)

app.listen(process.env.PORT || 3000, () => { 
    console.log('The library app is running!') 
  }) 