const express = require("express");

const app = express();
app.use(express.json());


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




app.get("/", (req,res)=> {
	res.json(database.users);

})

app.post("/signin", (req,res)=>{
	if (req.body.email === database.users[1].email && req.body.password === database.users[1].password){
			res.json("success")
	} else {
		res.send("Something went wrong")
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

	res.json(database.users[database.users.length-1])



})


app.listen(3000, ()=>{
	console.log("App is running on port 3000");
});




// /signin - POST(encrypted data) ---> success/failed
// /register - POST ---> user
// /image - PUT ---> update rank of user
// /profile/:userID - GET ---> User Profile
// store Image links and boundaries