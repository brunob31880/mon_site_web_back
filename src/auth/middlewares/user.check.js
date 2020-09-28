
/**
 * Validation utilities for user authentication from email/password.
 * Intermediate handler for requests prior to final controller action.
 *
 * @name user.check
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 */


import {genHash} from "../../lib/encrypt";
import {findByEmail} from "../../users/models/users.model";
import {config} from "../../../.config/base";

/**
 * Validate posted data prior to authentication.
 *
 * @name hasAuthValidFields
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @param {Object}		next	Callback for proceeding to next middleware action
 * @return {Object}		Next callback execution result or error sending result when validation fails
 */
export const hasAuthValidFields = (req, res, next) => {

	const errors = [];
	console.log("[user.check] Password length="+req.body.password.length);
	if (req.body) {
		if (!req.body.email) {
			errors.push("Missing email field");
		}
		if (!req.body.password) {
			errors.push("Missing password field");
		}
		if (req.body.password.length<=config.minPwdLength) {
			
			errors.push("Password length insufficient min="+config.minPwdLength);
		}
		if (errors.length) {
			// Bad request
			return res.status(400).send({errors: errors.join(",")});
		}
		return next();
	}
	// Bad request
	return res.status(400).send({errors: "Missing email and password fields"});
};

/**
 * Validate user authentication prior to valid token generation.
 *
 * @name isPasswordAndUserMatch
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @param {Object}		next	Callback for proceeding to next middleware action
 * @return {Object}		Next callback execution result or error sending result when validation fails
 */
export const isPasswordAndUserMatch = async (req, res, next) => {
	console.log("[User.check.js] Connecting with "+req.body.email+" "+req.body.password);
	const user = await findByEmail(req.body.email);
	if (!user[0]) {
		// Invalid user
		console.log("[User.check.js] "+req.body.email+" invalid user");
		return res.status(400).send({errors: ["Invalid user"]});
	}
	const passwordFields = user[0].password.split("$");
	const salt = passwordFields[0];
	const hash = genHash(req.body.password, salt);
	console.log("[User.check.js] PasswordFields="+JSON.stringify(passwordFields));
	if (hash === passwordFields[1]) {
		// Prepare user profile for access token
		req.body = {
			userId:		user[0]._id,					// eslint-disable-line no-underscore-dangle
			email:		user[0].email,
			level:		user[0].evel,
			provider:	"email",
			name:		`${user[0].firstName} ${user[0].lastName}`,
		};
		return next();
	}
	else {
		console.log('[User.check.js] Problem with identification');
	}
	// Bad request
	return res.status(400).send({errors: ["Invalid email or password"]});
};
