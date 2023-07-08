const handleRegister= async (req, res, db, bcrypt)=>{
	const {username,password,email} = req.body
	const validRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

	if (email==="" || password==="" || username==="") {

		res.status(400).json("Field is empty")

	} else if (/\s/.test(username) || /\s/.test(email) || /\s/.test(password)) {


		res.status(400).json("Field has spaces")


	} else if (!validRegex.test(String(email).toLowerCase())) {


		res.status(400).json("Email is not formatted correctly")





	} else {


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
}

module.exports = {
	handleRegister	: handleRegister	
}