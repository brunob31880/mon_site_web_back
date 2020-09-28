/**
 * Validation utilities for user token validation.
 * Intermediate handler for requests prior to final controller action.
 *
 * @name auth.permissions
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 */

import {userLevels} from "../../../.config/base";

const keys = Object.keys(userLevels);


/**
 * Generate a validator method for user permissions against provided minimal level.
 * Control permissions using the bitwise AND operator (bitmasking).
 * When each required permission is set as a power of 2,
 * then each bit of the 32bit integer is treated as a single permission.
 *
 * @name minLevelRequired
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		required		Required permission level
 * @return {Function}	Middleware function for user permissions validation
 */
export const minLevelRequired = required => (req, res, next) => {

	const {token} = req;
	if (token && keys.indexOf(required) >= keys.indexOf(token.level)) {
		return next();
	}
	// Forbidden
	return res.status(403).send({error: "Not allowed"});
};


/**
 * Validate that only administrators or current identified user may proceed.
 *
 * @name allowSameUserOrAdmin
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @param {Object}		next	Callback for proceeding to next middleware action
 * @return {Object}		Next callback execution result or error sending result when validation fails
 */
export const allowSameUserOrAdmin = (req, res, next) => {

	const userLevel = +req.token.level;
	const {userId} = req.token;
	if (req.params && userId === req.params.userId) {
		return next();
	}
	if (userLevel === userLevels.ADMIN) {
		return next();
	}
	// Forbidden
	return res.status(403).send({error: "Not allowed"});
};


/**
 * Validate that only current identified user may proceed.
 *
 * @name allowSameUser
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @param {Object}		next	Callback for proceeding to next middleware action
 * @return {Object}		Next callback execution result or error sending result when validation fails
 */
export const allowSameUser = (req, res, next) => {

	const {userId} = req.token;
	if (req.params && userId === req.params.userId) {
		return next();
	}
	// Bad request
	return res.status(400).send();
};

/**
 * Validate that current identified user may not proceed.
 *
 * @name denySameUser
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @param {Object}		next	Callback for proceeding to next middleware action
 * @return {Object}		Next callback execution result or error sending result when validation fails
 */
export const denySameUser = (req, res, next) => {

	const {userId} = req.token;
	if (req.params.userId !== userId) {
		return next();
	}
	// Bad request
	return res.status(400).send();
};
