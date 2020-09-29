
import mongoose from "../../lib/mongoose.service";
import {genSalt, genHash} from "../../lib/encrypt";
// import {TokenModel} from "../../auth/models/tokens.model";
import {config, userLevels} from "../../../.config/base";

const {Schema, model} = mongoose;

/**
 * MongoDB Schema for Users data type
 *
 * @name userSchema
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 */
const userSchema = new Schema({
	category: {
		type:		String,
		required:	"Please provide a category"
	},
	contenu: {
		type:		String,
		required:	"Please provide a contenu"
	},
	filecontenu: {
		type:		String,
		required:	"Please provide a file contenu"
	}
});

// Index on email field
userSchema.index({ category: 1 });

// Ensure virtual fields are serialised.
userSchema.set("toJSON", { virtuals: true });


/*
 * Setup Mongoose middlewares
 */

// Hook a pre-save method to hash the password (needs the local 'this' context)
userSchema.pre("save", function saveHook (next) {
	if (this.password
			&& this.isModified("password")
			&& this.contenu.length >= config.minContenuLength) {
	}
	next();
});

/*
 * Create and export a model for Users data
 */
export const UserModel = model("Articles", userSchema);


/*
 * Expose methods for controllers to work with stored data
 */
export const list = async (perPage, page) => UserModel.find().limit(perPage).skip(perPage * page);

export const create = data => {
	const user = new UserModel(data);
	return user.save();
};

export const findByCategory = async category => UserModel.find({category});
export const findAll= async () => UserModel.find({});
export const findById = async id => UserModel.findById(id);


export const patchById = async (id, data) => {
	// UserModel.findOneAndUpdate({_id: id}, data);
	const user = await UserModel.findById(id);
	Object.keys(data).forEach( k => {
		user[k] = data[k];
	});
	return user.save();
};

export const removeById = async userId => UserModel.deleteOne({_id: userId});
