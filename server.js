const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')

const app = express()

const PORT = process.env.PORT || 3000

let users = []

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('index', { data: 'data from app' })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try {
        let { name, email, password } = req.body
        const pass = await bcrypt.hash(password, 10)
        users.push({ id: Date.now().toString(), name, email, pass })
        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
        console.log(error);
    }
    console.log(users);
})

app.listen(PORT, console.log(`listening on port ${PORT}`))