const handleSignin= async (req, res, db, bcrypt)=>{
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

}

module.exports = {
	handleSignin: handleSignin	
}