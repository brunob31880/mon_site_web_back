
import mongoose from "../../lib/mongoose.service";
import {config} from "../../../.config/base";

const {Schema, model} = mongoose;

/**
 * MongoDB Schema for Refresh Tokens data type
 *
 * @name tokenSchema
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 */
const tokenSchema = new Schema({
	userId: {
		type:		String,
		index:		true,
		unique:		true
	},
	content: {
		type:		String
	},
	created: {
		type:		Date,
		default:	Date.now
	},
	expires: {
		type:		Date,
		default:	() => Date.now() + config.tokenExpires
	}
});

// Index on email field
tokenSchema.index({ userId: 1, content: 1 });

/*
 * Create and export a model for Tokens data
 */
export const TokenModel = model("Tokens", tokenSchema);


/*
 * Expose methods for controllers to work with stored data
 */
export const create = data => {

	const token = new TokenModel(data);
	return token.save();
};

export const findByContent = async content => TokenModel.findOne({content}).lean();

export const findByUser = async userId => TokenModel.findOne({userId}).lean();

export const removeById = async tokenId => TokenModel.deleteOne({_id: tokenId});

export const removeByUser = async userId => TokenModel.deleteOne({userId});
