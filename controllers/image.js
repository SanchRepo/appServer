
//This is called from the frontend to update the database. It will receive the id and use 
//the knex syntax to search the database to update the entry.
const USER_ID = 'aseeker';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'dda4d4e1eefd43d5bab862d7f94bdcbe';
const APP_ID = 'my-first-application';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '45fb9a671625463fa646c3523a3087d5';    
//const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';


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

const handleFacedetection = async (req, res ) => {
	const {imgurl} = req.body;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imgurl
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
    // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
    // this will default to the latest version_id

    // fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));
	try {
	    const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions) 
	    const data = await response.json();
	    const box = data.outputs[0].data.regions[0].region_info.bounding_box;
	    res.json(box)
	}
	catch (err) {
		res.status(400).json("Clarfai Api Error")
	}
    
    //console.log(box)

}

module.exports = {
handleImage: handleImage,
handleFacedetection : handleFacedetection	

}