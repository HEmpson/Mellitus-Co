// Load envioronment variables
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const mongoose = require('mongoose')

const ObjectId = require('mongodb').ObjectId
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')

// Connect to your mongo database using the MONGO_URL environmentvariable.
// Locally, MONGO_URL will be loaded by dotenv from .env.
// We've also used Heroku CLI to set MONGO_URL for our Heroku app before.
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

// Exit on error
const db = mongoose.connection.on('error', (err) => {
    console.error(err)
    process.exit(1)
})

// Create Bucket To Accept File Uploads
let bucket
db.on('connected', () => {
    bucket = new mongoose.mongo.GridFSBucket(mongoose.connections[0].db, {
        bucketName: 'uploads',
    })
})

const storage = new GridFsStorage({
    url: process.env.MONGO_URL || 'mongodb://localhost',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            const filename = file.originalname
            const fileInfo = {
                filename: filename,
                bucketName: 'uploads',
            }
            resolve(fileInfo)
        })
    },
})

// Utility for file uploads
const upload = multer({ storage })

// Function For Downloading Files
const downloadFile = async (req, res) => {
    bucket
        .find({
            _id: ObjectId(req.params.id),
        })
        .toArray((err, files) => {
            if (!files || files.length === 0) {
                return res.status(404).json({
                    err: 'no files exist',
                })
            }
            bucket.openDownloadStream(ObjectId(req.params.id)).pipe(res)
        })
}

// Log to console once the database is open
db.once('open', async () => {
    console.log(`Mongo connection started on ${db.host}:${db.port}`)
})

require('./user')
require('./post')
require('./category')

module.exports = { upload, downloadFile }
