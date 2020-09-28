
import {listUsers, insertUser, getUser, patchUser, removeUser}
	from "../controllers/users.controller";
import {validTokenNeeded}
	from "../../auth/middlewares/auth.validation";
import {minLevelRequired, allowSameUserOrAdmin}
	from "../../auth/middlewares/auth.permissions";
import {userLevels} from "../../../.config/base";


const {BASIC, MANAGER, ADMIN} = userLevels;

/**
 * Register routes for Users API
 *
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}	app		Express instance to register routes with
 * @return {void}
 */
export default app => {

	app.route("/users")
		.get([						// Authenticated manager accounts may list users
			validTokenNeeded,
			minLevelRequired(MANAGER),
			listUsers
		])
		.post([						// Anyone may create a user account
			insertUser
		]);

	app.route("/users/:userId")
		.get([						// Authenticated users may access their own account (or any administrator)
			validTokenNeeded,
			minLevelRequired(BASIC),
			allowSameUserOrAdmin,
			getUser
		])
		.patch([					// Authenticated users may modify their own account (or any administrator)
			validTokenNeeded,
			minLevelRequired(BASIC),
			allowSameUserOrAdmin,
			patchUser
		])
		.delete([					// Only administrators may delete user accounts
			validTokenNeeded,
			minLevelRequired(ADMIN),
			removeUser
		]);

};
