
import mongoose from "mongoose";

import {config} from "../../.config/base";


const DB_CONNECTION = `mongodb://${config.mongHost}/${config.dbName}`;
const RETRY_TIMEOUT = 100;			// milliseconds

let count = 0;
console.log(DB_CONNECTION);

mongoose.Promise = global.Promise;

const options = {
	//autoIndex: false,					// Don't build indexes
	useCreateIndex:		true,			// Do create indexes
	//reconnectTries:		30,				// Retry up to 30 times
	//reconnectInterval:	500,			// Reconnect every 500ms
	poolSize:			10,				// Maintain up to 10 socket connections
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries:	0,
	// Getting rid off the deprecation errors
	useNewUrlParser:	true,
	useUnifiedTopology:	true
};


const connectWithRetry = async () => {
	try {
		const success = await mongoose.connect(DB_CONNECTION, options);
		if (success) {
			console.log("MongoDB is connected");
		} else {
			console.log(`Could not connect to MongoDB, retry after ${RETRY_TIMEOUT} milliseconds.`);
		}
	} catch (err) {
		console.log(`MongoDB connection unsuccessful (${err}), retry after ${RETRY_TIMEOUT} milliseconds.`);
		count += 1;
		setTimeout(connectWithRetry, RETRY_TIMEOUT);
	}
};

connectWithRetry();

export default mongoose;
