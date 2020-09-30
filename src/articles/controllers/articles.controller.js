
/**
 * Controller for users REST API.
 * Interact with storage models to fulfill requested action.
 *
 * @name user.controller
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 */


import {list, create, findById, patchById, removeById}
	from "../models/articles.model";


/**
 * Final handler for GET <i>/users/</i> API route.
 * Provide a list of stored Users.
 *
 * @name listUsers
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const listArticles = async (req, res) => {
	console.log("[articles.controller] list users");
	try {
		const result = await list();
		res.status(200);
		await res.json(result);
	} catch (err) {
		console.log(err);
		// Internal server error
		res.sendStatus(500);
	}
};


/**
 * Final handler for POST <i>/users/</i> API route.
 * Create and store new User.
 *
 * @name insertArticle
 * @author Bruno Boissie 
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const insertArticle = async (req, res) => {
	console.log("[articles.controller] inserting article "+JSON.stringify(req.body));
	
	// Default user permission level
	try {
		const result = await create(req.body);
		res.status(201).send({id: result._id});					// eslint-disable-line no-underscore-dangle
	} catch (err) {
		console.log(err);
		// Internal server error
		res.sendStatus(500);
	}
};


/**
 * Final handler for GET <i>/users/:userId</i> API route.
 * Retrieve User data by ID.
 *
 * @name getArticle
 * @author Bruno Boissie 
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const getArticle = async (req, res) => {
	console.log("[articles.controller] get article "+req.params.userId);
	try {
		const result = await findById(req.params.userId);
		res.status(200).send(result);
	} catch (err) {
		console.log(err);
		// Internal server error
		res.sendStatus(500);
	}
};


/**
 * Final handler for PATCH <i>/users/:userId</i> API route.
 * Update User data.
 *
 * @name patchArticle
 * @author Bruno Boissie
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const patchArticle = async (req, res) => {
	console.log("[articles.controller] patch article "+JSON.stringify(req.body));
	if (req.body.level) {
		// Users are not allowed to change their permission level, AND SHOULD NOT TRY TO !
		delete req.body.level;
	}
	try {
		await patchById(req.params.userId, req.body);
		res.sendStatus(204);
	} catch (err) {
		console.log(err);
		// Internal server error
		res.sendStatus(500);
	}
};


/**
 * Final handler for DELETE <i>/users/:userId</i> API route.
 * Remove User from storage.
 *
 * @name removeArticle
 * @author Bruno Boissie
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}		req		Express request object
 * @param {Object}		res		Express response object
 * @return {void}
 */
export const removeArticle = async (req, res) => {
	console.log("[articles.controller] remove article "+req.params.userId);
	try {
		const result = await removeById(req.params.userId);
		res.status(204);
		await res.json(result);
	} catch (err) {
		console.log(err);
		// Internal server error
		res.sendStatus(500);
	}
};
