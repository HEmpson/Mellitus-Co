const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {User} = require("./models/db.js")

// Serialize information to be stored in session/cookie
passport.serializeUser((user, done) => {
    // Use id to serialize user
    done(undefined, user.id)
    })

passport.deserializeUser((userId, done) => {
    User.findById(userId, { password: 0 }, (err, user) => {
        if (err) {
            return done(err, undefined)     
        }
        return done(undefined, user)
    })
})

passport.use(
    new LocalStrategy((username, password, done) => {
        // Email should be case insensitive
        username = username.toLowerCase()
        User.findOne({ username }, {}, {}, (err, user) => {
            if (err) {
                return done(undefined, false, {
                    message: 'Unknown error has occurred',
                })
            }
            if (!user) {
                return done(undefined, false, {
                    message: 'Incorrect username or password',
                })
            }
            // Check password
            user.verifyPassword(password, (err, valid) => {
                if (err) {
                    return done(undefined, false, {
                        message: 'Unknown error has occurred',
                    })
                }
                if (!valid) {
                    return done(undefined, false, {
                        message: 'Incorrect username or password',
                    })
                }
                // If user exists and password matches the hash in the database
                return done(undefined, user)
            })
        })
    })
)

module.exports = passport