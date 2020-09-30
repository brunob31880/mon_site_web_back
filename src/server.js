/* eslint-disable no-console */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import socketIo from "socket.io";
import http from "http";
import https from "https";
import fs from "fs";

import authRoutes from "./auth/routes/setup";
import userRoutes from "./users/routes/setup";
import articleRoutes from "./articles/routes/setup";

import { create,removeById, findByEmail, findAll } from "./users/models/users.model";
import { config } from "../.config/base";

const version = "0.0.4";
/*
const options = {
	key: fs.readFileSync('selfsigned.key'),
	cert: fs.readFileSync('selfsigned.crt')
};
*/

// Certificate
/*
const privateKey = fs.readFileSync('/etc/letsencrypt/live/boissiebruno-pageperso-pi.ovh/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/boissiebruno-pageperso-pi.ovh/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/boissiebruno-pageperso-pi.ovh/chain.pem', 'utf8');

const options = {
	key: privateKey,
	cert: certificate,
	ca: ca
};
*/
const app = express();


//app.use(cors({credentials: true, origin: 'https://brunoboissie.pagesperso-orange.fr'}));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const server = http.createServer(app);
//const secure_server = https.createServer(options,app);
//const io = socketIo().listen(secure_server);
const io = socketIo().listen(server);
io.origins('*:*');
// Register the routes
authRoutes(app);
userRoutes(app);
articleRoutes(app);

console.log("Server version " + version);
// Startup services listening
// Handle port listening services
server.listen(
	config.httpPort,
	() => console.log(`${config.appName} HTTP server listening on port ${config.httpPort}!`)
);
//secure_server.listen(
//	config.httpsPort,
//	() => console.log(`${config.appName} HTTPS server listening on port ${config.httpsPort}!`)
//);
const sonic = {
	firstName: "Sonic",
	lastName: "Leherisson",
	email: "sonic@gmail.com",
	password: "elpassword"
};

let list = findAll().then((datas) => {
	console.log("Liste of Users=" + JSON.stringify(datas));
});
const isEmpty = obj => JSON.stringify(obj).includes("[]");
let user = findByEmail("sonic@gmail.com").then((data) => {
	console.log("Find sonic=" + JSON.stringify(data));

	if (isEmpty(data)) {
		console.log("[Server] Creation de " + JSON.stringify(sonic));
		create(sonic);
	}
	else {
		console.log(JSON.stringify(data));
		console.log("[Server] Utilisateur sonic deja crée");
	}
});

let x=0;
let y=0;
let interval;
const moveFlight=(socket)=>{
	x+=0.5;
	y+=0.5;
	console.log("[Server] Socket IO: move Flight x="+x+" y="+y);
	socket.emit("moveFlight",{callsign:"AFR120",x,y,afl:230});
}
io.on("connection", socket => {
	console.info(`[Server] Client connected [id=${socket.id}]`);
	socket.on("disconnect", () => {
		console.info(`[Server] Client gone [id=${socket.id}]`);
		clearInterval(interval);
    });
	socket.on("launchdemo",(message)=> {
		console.log("[Server] Launch demo "+message);
		console.log("[Server] Socket IO: move Flight x="+x+" y="+y);
		socket.emit("addFlight",{callsign:"AFR120",x,y,afl:230});
		interval=setInterval(()=>moveFlight(socket), 2000);
	}
	)
});
