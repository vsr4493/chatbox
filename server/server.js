import express from 'express';
import bodyParser from 'body-parser';
import log from 'npmlog';

/*Logging*/
log.enableColor();
const logSilly = (message) => log.silly("Express: ", message);
log.level = "silly";
logSilly("Hey there");


/*Creating an express instance*/
//express() returns a function with a signature func(req,res) which can handle requests and response arguments.
const app = express();

/*Adding express middleware for serving static files*/
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

export {app};