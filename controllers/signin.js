const handleSignin= async (req, res, db, bcrypt)=>{
	const {password,email} = req.body
	const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

	if (email==="" || password==="") {

		res.status(400).json("Field is empty")

	} else if (/\s/.test(email) || /\s/.test(password)) {


		res.status(400).json("Field has spaces")


	} else if (!validRegex.test(String(email).toLowerCase())) {


		res.status(400).json("Email is not formatted correctly")





	} else {

		try {
			//
			const hash = await db("login").where("email",email);
			//console.log(hash);
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

}

module.exports = {
	handleSignin: handleSignin	
}