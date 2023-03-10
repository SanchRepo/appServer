const handleImage = async (req, res, db)=>{
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
	

}

module.exports = {
handleImage: handleImage	

}