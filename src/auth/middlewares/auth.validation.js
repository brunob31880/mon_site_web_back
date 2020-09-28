/**
 * Validation utilities for user token validation.
 * Intermediate handler for requests prior to final controller action.
 *
 * @name auth.validation
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 */

import {findByContent} from "../models/tokens.model";


/**
 * Always validate user with a valid JWT, reject with error otherwise.
 *
 * @name validTokenNeeded
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @param {Object}		next	Callback for proceeding to next middleware action
 * @return {Object}		Next callback execution result or error sending result when validation fails
 */
export const validTokenNeeded = async (req, res, next) => {

	if (req.headers.token) {
		try {
			// Finding by content is a ottleneck of current token implementation
			const stored = await findByContent(req.headers.token);
			if (stored) {
				const b = Buffer.from(req.headers.token, "base64");
				req.token = JSON.parse(b.toString("ascii"));
				return next();
			}
			// Unauthorized
			return res.status(401).send({error: "Valid token needed"});
		} catch (err) {
			// Forbidden
			// Send error message in case expiration should trigger refresh
			return res.status(403).send({error: err.name});
		}
	} else {
		// Unauthorized
		return res.status(401).send({error: "Access token needed"});
	}
};

export const noop = () => {};
