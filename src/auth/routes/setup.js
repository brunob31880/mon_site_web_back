import express from "express";
import path from "path";
import {validTokenNeeded}
	from "../middlewares/auth.validation";
import {hasAuthValidFields, isPasswordAndUserMatch}
	from "../middlewares/user.check";
import {logUserIn, logUserOut}
	from "../controllers/auth.controller";


// NodeJS with ESM if supported
const dir = (import.meta && import.meta.url)
	? path.dirname(new URL(import.meta.url).pathname)
	: __dirname;


/**
 * Register routes for Authentication API
 *
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}	app		Express instance to register routes with
 * @return {void}
 */
export default app => {
	
	app.route("/avatars/:id")
		.get([						// Users may use login page
			(req, res) => {
				var id = req.param("id"); 
  				console.log(id);
				res.sendFile(path.join(dir, "../../../avatars/"+id));
			}
		]);
	
	app.route("/login")
		.get([						// Users may use login page
			(req, res) => {
				res.sendFile(path.join(dir, "../../login.html"));
			}
		]);
	
	app.route("/auth")
		.post([						// Users with valid username an password may authenticate
			hasAuthValidFields,
			isPasswordAndUserMatch,
			logUserIn
		]);

	app.route("/logout")
		.post([						// Users with valid access token may logout
			validTokenNeeded,
			logUserOut
		]);

};
