// Imports
const express = require('express') 
const exphbs = require('express-handlebars')
const req = require('express/lib/request')
const appRouter = require('./routes/appRouter')

// Set your app up as an express app 
const app = express() 


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


app.listen(3000, () => { 
    console.log('Demo app is listening on port 3000!') 
}); 