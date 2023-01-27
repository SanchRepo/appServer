const express = require("express");
let cors = require('cors');

const app = express();
const knex = require('knex')

const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    port : 5432,
    user : 'postgres',
    password : 'SLKjd9s!@',
    database : 'intelliimage'
  }
});

console.log(postgres.select().table('users'));

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

	database.users.push(
			{	
				id:"3",
				username: username,
				password: password,
				email: email,
				entries: 0,
				joined: new Date()
			}

	)

	res.json(database.users[database.users.length-1]);



})

app.post("/profile/:id", (req,res) => {
	const {id} = req.params;
	let exists = false;
	database.users.forEach((user)=>{
		if (user.id === id) {
			exists = true
			return res.json(user)
		}		
	})

	if (!exists){
		res.status(404).json("Not found")
	}

	//res.json(id)

})


app.put("/image", (req,res)=>{
	const {id} = req.body;
	let exists = false;
	database.users.forEach((user)=>{
		if (user.id === id) {
			exists = true
			user.entries++
			return res.json(user)
		}		
	})

	if (!exists){
		res.status(404).json("Not found")
	}
	

})

app.listen(3001, ()=>{
	console.log("App is running on port 3001");
});




// /signin - POST(encrypted data) ---> success/failed
// /register - POST ---> user
// /image - PUT ---> update rank of user
// /profile/:userID - GET ---> User Profile
// store Image links and boundaries