const express = require('express')
const app = express()
const bodyParser = require('body-parser')
<<<<<<< HEAD
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
=======
const MongoClient = require('mongodb').MongoClient
>>>>>>> 9125569f67614540e9bed1ccdbf7f469f50caaaa

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
    console.log('Enregistré dans la bdd')
    res.redirect('/')
  })
})

app.get('/delete', (req, res) => {
  db.collection('movie').deleteOne({_id: new mongodb.ObjectID(req.query.id)}, (err, result) =>{
    if (err) return console.log(err)
    console.log('supprimé de la bdd')
  })
  res.redirect('/')
 })

 app.get('/updatevu', (req, res) => {
  var myquery = { _id: new mongodb.ObjectID(req.query.id)};
  var newvalues = { $set: {etat: "1"} };
  db.collection("movie").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 film mis a jour");
  })
  res.redirect('/')
})

app.get('/updateavoir', (req, res) => {
 var myquery = { _id: new mongodb.ObjectID(req.query.id)};
 var newvalues = { $set: {etat: "0"} };
 db.collection("movie").updateOne(myquery, newvalues, function(err, res) {
   if (err) throw err;
   console.log("1 film mis a jour");
 })
 res.redirect('/')
})
