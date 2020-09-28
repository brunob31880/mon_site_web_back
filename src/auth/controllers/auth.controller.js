/**
 * Controller for authentication REST API.
 * Interact with storage models to fulfill requested action.
 *
 * @name auth.controller
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 */


import {create, removeByUser} from "../models/tokens.model";


/**
 * Final handler for POST <i>/login</i> API route.
 * Validate user authentication and issue access and refresh tokens.
 *
 * @name logUserIn
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const logUserIn = async (req, res) => {
	console.log("[Auth.Controller] Connecting request with "+JSON.stringify(req.body));
	try {
		
		const {userId} = req.body;
		// Generate access token containing user profile
		const b = Buffer.from(JSON.stringify(req.body));
		const token = b.toString("base64");
		// Cleanup any existing stored refresh token for this user
		await removeByUser(userId);
		// And store refresh token in database
		create({
			userId,
			content:	token
		});
		res.status(201).send({token});
	} catch (err) {
		console.log(err);
		// Internal server error
		res.sendStatus(500);
	}
};


/**
 * Final handler for POST <i>/logout</i> API route.
 * Log user out of the system.
 *
 * @name logUserOut
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const logUserOut = (req, res) => {
	// Cleanup refresh token to prevent it from being used
	removeByUser(req.body.userId);
	res.status(200).send({message: "Logged out successfully"});
};
