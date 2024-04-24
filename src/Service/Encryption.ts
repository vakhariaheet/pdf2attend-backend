import CryptoJS from 'crypto-js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
/**
 * Encrypts a string with a given key.
 * Uses AES encryption.
 * @param data data to be encrypted
 * @param secret secret key
 * @returns {string}
 */
export const encrypt = (data: string, secret: string) => {
	return CryptoJS.AES.encrypt(data, secret).toString();
};
/**
 * Decrypts a string with a given key.
 * Uses AES encryption.
 * @param data data to be descrypted
 * @param secret secret key
 * @returns {string}
 */
export const decrypt = (data: string, secret: string) => {
	return CryptoJS.AES.decrypt(data, secret).toString(CryptoJS.enc.Utf8);
};
/**
 *
 * @param rounds number of rounds to hash the password
 * @returns
 */
export const createSalt = (rounds: number) =>
	new Promise((resolve, reject) => {
		bcrypt.genSalt(rounds, (err, salt) => {
			if (err) {
				reject(err);
			} else {
				resolve(salt);
			}
		});
	});
/**
 * @param password password to be hashed
 * @param salt salt to be used for hashing
 * @returns {Promise<string>}
 */
export const BycrptPassword = (password: string, salt: string) =>
	new Promise((resolve, reject) => {
		bcrypt.hash(password, salt, (err, hash) => {
			if (err) {
				reject(err);
			} else {
				resolve(hash);
			}
		});
	});
/**
 * @param data data to be hashed
 * @returns {Promise<string>}
 * @throws {Error}
 * @description Hashes a string using bcrypt
 * @example
 * const hashed = await hash('password');
 * console.log(hashed); // saljdslfdsjdlsfdmsklafjdfljdklmflas
 **/
export const hash = async (data: string) => {
	const salt = await createSalt(10);
	if (typeof salt !== 'string') throw new Error('Salt is not a string');
	const hash = await BycrptPassword(data, salt);
	if (typeof hash !== 'string') throw new Error('Hashing failed');
	return hash;
};
export const BycrptCompare = (data: string, hash: string) => {
	return new Promise((resolve, reject) => {
		bcrypt.compare(data, hash, (err, result) => {
			if (err) {
				reject(err);
			} else {
				resolve(result);
			}
		});
	});
};
/**
 *
 * @param data data to be compared
 * @param hash hash to be compared with
 * @returns {Promise<boolean>}
 * @throws {Error}
 * @description Compares a string with a hash
 * @example
 * const result = await compare('password', hashed);
 * console.log(result); // true or false
 */
export const compare = async (data: string, hash: string): Promise<boolean> => {
	const result = await BycrptCompare(data, hash);
	if (typeof result !== 'boolean') throw new Error('Comparing failed');
	return result;
};
