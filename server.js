const express = require("express");
let cors = require('cors');
const bcrypt = require("bcrypt-node")

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



app.use(cors());
app.use(express.json());




app.get("/", (req,res)=> {
	db.select().table('users').then(data => res.json(data));

})

app.post("/signin", async (req,res)=>{
	const {password,email} = req.body
	// if (email === database.users[1].email && password === database.users[1].password){
	// 		res.json(database.users[1]);
	// } else {
	// 	res.json("Something went wrong")

	// }
	try {
		//
		const hash = await db("login").where("email",email);
		//res.json()
		if (bcrypt.compareSync(password, hash[0].hash)){
			const user = await db("users").where("email",email);
			res.json(user[0]);
		}
		
		else {
			res.status(400).json("Incorrect credentials or user does not exist");
		}
	} catch(err) {
		res.status(400).json("Error confirming credentials");
		console.log(err);		
	}

});

app.post("/register", async (req,res)=>{
	const {username,password,email} = req.body

	// try {
	// 	const user = await db("users")
	// 	.returning('*')
	// 	.insert(
	// 			{	
	// 				username: username,
	// 				email: email,
	// 				joined: new Date()
	// 			}

	// 	)
	// 	res.json(user[0]);
	// }
	// catch(err) {
	// 	res.status(400).json("Unable to join");
	// };
	try {
		await db.transaction(async trx => {
			console.log(password);

			const hash = bcrypt.hashSync(password)

			const loginEmail = await trx("login")
			.insert(
				{
					hash: hash,
					email: email

				}
			)
			.returning('email')

			const user = await trx("users")
			.returning('*')
			.insert(
				{	
					username: username,
					email: loginEmail[0].email,
					joined: new Date()
				}
			)
			res.json(user[0]);

		});
	} catch (err) {
		res.status(400).json("Error storing information");
		console.log(err);
	}
})

app.post("/profile/:id", async (req,res) => {
	const {id} = req.params;

	// db("users")
	// .where('id', id)
	// .then(user => {
	// 	if (user.length) {
	// 		res.json(user[0]);
	// 	} else {
	// 		res.json("User does not exist")
	// 	}

	// })
	// .catch(err => {
	// 	res.status(400).json("Error in database")
	// });
	try {
		const user = await db("users").where('id', id);
		if (user.length) {
			res.json(user[0]);
		} else {
			res.json("User does not exist");
		}
	} catch(err){
		res.status(400).json("Error retrieving user");
		console.log(err);
	}

})


app.put("/image", async (req,res)=>{
	const {id} = req.body;
	try {
		const entries = await db("users")
		.where('id', id)
		.increment('entries', 1)
		.returning('entries')
		
		res.json(entries[0].entries)
	}
	catch(err) {
		res.status(400).json("Error updating entries")
		console.log(err);
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