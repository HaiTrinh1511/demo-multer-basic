const express = require('express')
const multer = require('multer')
const path = require('path')
const mongoose = require('mongoose')
const uuid = require('uuid').v4
const Image = require('./models/images')
require('dotenv').config()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },

    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        const id = uuid()
        const filePath = `images/${id}${ext}`
        Image.create({ filePath })
            .then(() => {
                cb(null, filePath)
            })
        
    }
})
const upload = multer({ storage })


const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/upload', upload.single('avatar'), (req, res) => {
    return res.json({ status: 'OK' })
})

app.post('/upload-mul', upload.array('avatar'), (req, res) => {
    return res.json({ status: 'OK', uploaded: req.files.length })
})

app.get('/images', (req, res) => {
    Image.find()
        .then((images) => {
            return res.json({ status: 'OK', images })
        })
})



const PORT = process.env.PORT || 3000

mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
}).then(() => {
    console.log('Database is connected...!')
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}).catch(err => console.log(err.message))