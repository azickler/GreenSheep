const express = require('express')
const session = require('express-session');
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

var db
var sess

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
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}))

app.get('/', (req, res) => {
  sess=req.session
  if(sess.login){
    db.collection('movie').find({user:sess.login}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('index.jade', {movies: result, sess: sess.login})
    })
  }else{
    res.render('login.jade')
  }
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

app.get('/maj', (req, res) => {
 var myquery = { _id: new mongodb.ObjectID(req.query.id)};
 db.collection("movie").findOne(myquery, function(err, result) {
   if (err) throw err;
   res.render('updatemovie.jade', {movie: result})
 });
})


app.post('/maj', (req, res) => {
  var myquery = { _id: new mongodb.ObjectID(req.query.id)};
  var newvalues = { $set: {name: req.body.name} };
  db.collection("movie").updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 film mis a jour");
  })
  res.redirect('/')
})


app.get('/export', (req, res) => {
  sess=req.session;
  var collectionInfo = db.collection("movie")
  // Here we will find all students
  collectionInfo.find({user:sess.login}).toArray(function(err, movie) {
     // so now, we can return all students to the screen.
     res.status(200).json({'Mes films' : movie})
  })
})


app.post('/inscription', (req, res) => {
  db.collection('users').save(req.body, (err, result) => {
    if (err) {
      res.render('login.jade',{inscription: 'false'})}
    else{
      console.log('Enregistré dans la bdd')
      res.render('login.jade',{inscription: 'true'})
    }
  })
})


app.post('/login', (req, res) => {
  var myquery = { login: req.body.login, password: req.body.password};
  db.collection("users").findOne(myquery, function(err, result) {
    if (err){
      res.render('login.jade',{connexion: 'false'})
    }else{
      sess=req.session;
      sess.login=req.body.login;
      res.redirect('/')
    }
  });
})

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err){console.log(err)}
        else{res.redirect('/')}
    })
})

app.get('/majuser', (req, res) => {
  sess=req.session;
  var myquery = { login: sess.login};
  db.collection("users").findOne(myquery, function(err, result) {
    if (err) throw err;
    res.render('updateuser.jade', {user: result})
  })
})

app.post('/majuser', (req, res) => {
  sess=req.session;
  var myquery = { login: req.query.login};
  var newvalues = { $set: {login: req.body.login} };
  db.collection("users").updateOne(myquery, newvalues, function(err, result) {
    if (err) {
      res.redirect('/majuser')
    }else{
      console.log('Compte mis à jour dans la bdd');
      sess.login=req.body.login;
      res.redirect('/');
    }
  })
})
