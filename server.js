const express = require('express')
const path = require('path')

const app = express()

app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3000

app.get('/', (req, res) => {
    res.render('index', {data: 'data from app'})
})

app.listen(PORT, console.log(`listening on port ${PORT}`))