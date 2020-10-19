if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require('express')
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session');
const initializePassport = require('./passport-config');
const methodOverride = require('method-override')

let users = []

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id),

)

const app = express()

const PORT = process.env.PORT || 3000


app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}

app.get('/', checkAuthenticated, (req, res) => {
    res.render('index', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        let { name, email, password } = req.body
        const pass = await bcrypt.hash(password, 10)
        users.push({ id: Date.now().toString(), name, email, password: pass })
        res.redirect('/login')
    } catch (error) {
        res.redirect('/register')
        console.log(error);
    }
    console.log(users);
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

app.listen(PORT, console.log(`listening on port ${PORT}`))