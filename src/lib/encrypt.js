
import crypto from "crypto";


/**
 * Generates random string of characters i.e salt converted to hexadecimal format
 *
 * @name genSalt
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {Integer}		length		Length of the random string.
 * @return {void}
 */
export const genSalt = length => crypto.randomBytes(Math.ceil(length / 2))
	.toString("base64")
	.slice(0, length);


/**
 * Encrypt given string with sha512, applying given salt
 *
 * @name genHash
 * @author Luc Thibault <luc@suhali.net>
 * @copyright (c) 2020, DSNA/DTI. All rights reserved.
 *
 * @param {String}		input		Input string to be encrypted.
 * @param {String}		salt		Password string to be encrypted.
 * @return {Object}    An object with salt and hash for password
 */
export const genHash = (input, salt) => crypto.createHmac("sha512", salt)
	.update(input)
	.digest("base64");
