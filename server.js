const express = require("express");
let cors = require('cors');

const app = express();
const knex = require('knex')

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

db.select().table('users').then(data => console.log(data))

const database = {
	users: [

		{	
			id:"1",
			username: "aSeeker",
			password: "yaboi",
			email: "sanch@gmail.com",
			entries: 0,
			joined: new Date()

		},
		{	
			id:"2",
			username: "donutman",
			password: "ilovedonuts",
			email: "donuts@gmail.com",
			entries: 0,
			joined: new Date()

		}
	]
}
app.use(cors());
app.use(express.json());




app.get("/", (req,res)=> {
	res.json(database.users);

})

app.post("/signin", (req,res)=>{
	if (req.body.email === database.users[1].email && req.body.password === database.users[1].password){
			res.json(database.users[1]);
	} else {
		res.json("Something went wrong")
	}


});

app.post("/register", (req,res)=>{
	const {username,password,email} = req.body

	db("users")
	.returning('*')
	.insert(
			{	
				username: username,
				email: email,
				joined: new Date()
			}

	).then(user => {
		res.json(user[0]);
	}).catch(err => {
		res.status(400).json("Unable to join");
	});


})

app.post("/profile/:id", (req,res) => {
	const {id} = req.params;

	db("users")
	.where('id', id)
	.then(user => {
		if (user.length) {
			res.json(user[0]);
		} else {
			res.json("User does not exist")
		}

	})
	.catch(err => {
		res.status(400).json("Error in database")
	});

})


app.put("/image", (req,res)=>{
	const {id} = req.body;
	db("users")
	.where('id', id)
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries)
	})
	.catch(err => {
		res.status(400).json("Error updating entries")
	})
	

})

app.listen(3001, ()=>{
	console.log("App is running on port 3001");
});




// /signin - POST(encrypted data) ---> success/failed
// /register - POST ---> user
// /image - PUT ---> update rank of user
// /profile/:userID - GET ---> User Profile
// store Image links and boundaries