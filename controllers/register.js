const handleRegister= async (req, res, db, bcrypt)=>{
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
}

module.exports = {
	handleRegister	: handleRegister	
}