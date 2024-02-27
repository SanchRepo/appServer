
const {grpc} = require("clarifai-nodejs-grpc");
const service = require("clarifai-nodejs-grpc/proto/clarifai/api/service_pb");
const resources = require("clarifai-nodejs-grpc/proto/clarifai/api/resources_pb");
const {StatusCode} = require("clarifai-nodejs-grpc/proto/clarifai/api/status/status_code_pb");
const {V2Client} = require("clarifai-nodejs-grpc/proto/clarifai/api/service_grpc_pb");

const clarifai = new V2Client("api.clarifai.com", grpc.ChannelCredentials.createSsl());

const metadata = new grpc.Metadata();
metadata.set("authorization", "Key f5bf3fbb14e74911bad4ccfb11bba92f");

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
	const {imgurl} = req.body;
	console.log(req.body);
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
        // .then(response => response.text())
        // .then(result => console.log(result))
        // .catch(error => console.log('error', error));
       	// res.json(result)

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

const handleGRPCClarifai = async (req, res) => {
	const {imgurl} = req.body;
	const request = new service.PostModelOutputsRequest();
	// This is the model ID of a publicly available General model. You may use any other public or custom model ID.
	request.setModelId("aaa03c23b3724a16a56b629203edc62c");
	request.addInputs(
	    new resources.Input()
	        .setData(
	            new resources.Data()
	                .setImage(
	                    new resources.Image()
	                        .setUrl(imgurl)
	                )
	        )
	)

	clarifai.postModelOutputs(
	    request,
	    metadata,
	    (error, response) => {
	        if (error) {
	            throw error;
	        }

	        if (response.getStatus().getCode() !== StatusCode.SUCCESS) {
	            throw "Error: " + response.getStatus();
	        }

	        console.log("Predicted concepts, with confidence values:")
	        for (const concept of response.getOutputsList()[0].getData().getConceptsList()) {
	            console.log(concept.getName() + " " + concept.getValue());
	        }
	    }
	)

}


module.exports = {
handleImage: handleImage,
handleFacedetection : handleFacedetection,
handleGRPCClarifai : handleGRPCClarifai	

}