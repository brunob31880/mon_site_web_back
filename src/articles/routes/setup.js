
import {listArticles, insertArticle, getArticle, patchArticle, removeArticle} from "../controllers/articles.controller";
import {validTokenNeeded} from "../../auth/middlewares/auth.validation";
import {minLevelRequired, allowSameUserOrAdmin} from "../../auth/middlewares/auth.permissions";
import {userLevels} from "../../../.config/base";


const {BASIC, MANAGER, ADMIN} = userLevels;

/**
 * Register routes for Article API
 *
 * @author Bruno Boissie <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Object}	app		Express instance to register routes with
 * @return {void}
 */
export default app => {

	app.route("/articles")
		.get([						// Authenticated manager accounts may list users
			validTokenNeeded,
			minLevelRequired(ADMIN),
			listArticles
		])
		.post([						// Anyone may create a user account
			insertArticle
		]);

	app.route("/articles/:articleId")
		.get([						// Authenticated users may access their own account (or any administrator)
			validTokenNeeded,
			minLevelRequired(ADMIN),
			allowSameUserOrAdmin,
			getArticle
		])
		.patch([					// Authenticated users may modify their own account (or any administrator)
			validTokenNeeded,
			minLevelRequired(ADMIN),
			allowSameUserOrAdmin,
			patchArticle
		])
		.delete([					// Only administrators may delete user accounts
			validTokenNeeded,
			minLevelRequired(ADMIN),
			removeArticle
		]);

};
