import Promise from 'bluebird';
import fs from 'fs';

Promise.promisifyAll(fs);

const appConfigPath = "conf/applicationConfiguration.json";

function getByFileName(fname){
		let fileAsync = fs.readFileAsync(fname, 'utf-8');
		return fileAsync.then((data) => JSON.parse(data));
}


const configAsync = getByFileName(appConfigPath);

export {configAsync};