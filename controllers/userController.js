const { User } = require('../models/user')

const createAccount = async (req, res) => {
    const newUser = req.body

    // checks if email is a valid email
    if (!verifyNewPatientProfile(newUser)) {
        req.flash('newAccountError', 'Invalid Email Address')
        return res.redirect('/')
    }

    // email already exists
    if (await User.findOne({ username: newUser.username })) {
        req.flash('newAccountError', 'User already exists')
        return res.redirect('/')
    }

    try {
        const newUserProfile = new User({
            username: newUser.username,
            password: newUser.password,
            displayName: newUser.displayName,
            status: newUser.status,
            role: 'User',
            friends: [],
            files: [],
            categories: [],
        })

        // save the new account to the DB
        await newUserProfile.save()
    } catch (err) {
        await User.deleteOne({ username: newUser.username })
        req.flash('newAccountError', 'Invalid Data Type(s) Entered')
        return res.redirect('/')
    }

    return res.redirect('/')
}

// Verify the email address of the new patient is correct
const verifyNewPatientProfile = (newUser) => {
    try {
        const email = newUser.username
        // Check email has only 1 @ symbol
        const emailTokens = email.split('@')
        if (emailTokens.length != 2) {
            return false
        }
        const recipient = emailTokens[0]
        const domain = emailTokens[1]
        // Check if either field is null
        if (recipient) {
            if (domain) {
                // Check if domain has at least 2 parts
                const domainTokens = domain.split('.')
                if (domainTokens.length < 2) {
                    return false
                }
            } else {
                return false
            }
        } else {
            return false
        }
        // If all tests passed, input is verified
        return true
    } catch {
        // Return invalid
        return false
    }
}

module.exports = {
    createAccount,
    verifyNewPatientProfile,
}
