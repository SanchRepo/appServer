const express = require("express");
let cors = require('cors');
const bcrypt = require("bcrypt-node")

const app = express();
const knex = require('knex')
const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'SLKjd9s!@',
    database : 'intelliimage'
  }
});



app.use(cors());
app.use(express.json());




app.get("/", (req,res)=> {
	db.select().table('users').then(data => res.json(data));

})

app.post("/signin", (req,res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.post("/profile/:id", (req,res) => {profile.handleProfile(req, res, db)});

app.post("/face", (req,res) => {image.handleFacedetection(req,res)});

app.post("/grpc", (req,res) => {image.handleGRPCClarifai(req,res)});


app.put("/image", (req,res) => {image.handleImage(req, res, db)});

app.listen(3001, ()=>{
	console.log("App is running on port 3001");
});




// /signin - POST(encrypted data) ---> success/failed
// /register - POST ---> user
// /image - PUT ---> update rank of user
// /profile/:userID - GET ---> User Profile
// store Image links and boundaries