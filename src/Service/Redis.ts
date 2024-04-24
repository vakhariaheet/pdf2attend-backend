import {createClient} from 'redis';

const client = createClient();

(async () => { 
    await client.connect();
    console.log('Connected to Redis 🕗 🕗 ');
})();


const DEFAULT_EXPIRATION = 3600;
/**
 * Get value from cache or set it if it doesn't exist
 * @param {string} key Redis key
 * @param {() => T} cb Callback function to get fresh value
 * @returns {Promise<T>} Fresh value or cached value
 */
const getOrSetCache = async <T>(key: string, cb: () => T): Promise<T> => {
	try {
		const cacheValue = await getCache(key);
		
		if (cacheValue) {
			return cacheValue;
		}
		const freshValue = await cb();
		await setCache(key, freshValue);
		return freshValue;
	}
	catch (error) {
		console.log(error);
		return cb();
	}

};


const getCache = async (key:string) => {
	const cacheValue = await client.get(key);
	if (!cacheValue) {
		return null;
	}
	return JSON.parse(cacheValue);
};
const setCache = async (key:string, value:any) => {
	return await client.setEx(
		key,
		DEFAULT_EXPIRATION,
		JSON.stringify(value),
	);
};

/**
 *  Delete cache by key regex
 * @param {string} keyRegex  Redis key regex
 * @returns {void} 
 */
const deleteCache = async (keyRegex:string) => {
	const keys = await client.keys(keyRegex);
	if(keys.length === 0) return;
	return await client.del(keys);
}
 
export { getOrSetCache, getCache, setCache, deleteCache };