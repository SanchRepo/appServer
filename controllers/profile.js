const handleProfile = async (req, res, db) => {
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

}

module.exports= {
	handleProfile: handleProfile	
}