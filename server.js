const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://admin:zG55iE3MuExHtrCZ@ds213118.mlab.com:13118/greensheep', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('movie').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {movies: result})
  })
})

app.post('/movie', (req, res) => {
  db.collection('movie').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})
