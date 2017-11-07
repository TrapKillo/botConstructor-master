const WebSocket = require('ws');
const ws = new WebSocket.Server({
	port: 8081
});
const Socks = require('socks');
const HttpProxyAgent = require('https-proxy-agent');
const fs = require('fs');
let bots = [];
let botNick = "";
let serverIP = "";
let botsPerIP = 1;
let botAmount = 100;
let xPos, yPos = 0;
let httpProxies, socksProxies = fs.readFileSync('proxies.txt', 'utf8').split('\n').filter(function(a) {
	return !!a;
});

const Proxies = {
	agents() {
		var proxy = socksProxies[Math.floor(Math.random() * socksProxies.length)].split(':');
		for(var i = 0; i < socksProxies.length; ++i) {
			for(var j = 0; j < botsPerIP; ++j) {
				return new Socks.Agent({
					proxy: {
						ipaddress: proxy[0],
                 	   port: parseInt(proxy[1]),
                  	  type: parseInt(proxy[2]) || 5 //socks5
               	 	}
				});
			}
		}
		for(var i = 0; i < httpProxies.length; ++i) {
			for(var j = 0; j < botsPerIP; ++j) {
				return new HttpProxyAgent(`http://${httpProxies[i]}`);
			}
		}
	}
}

class Bot {
	constructor(id) {
		this.ws = null;
		this.id = id;
		this.headers = {
			'origin' : '' //don't forget to add origin
		};
		this.agent = Proxies.agents(this.id);
		this.connect();
	}
	connect() {
		this.ws = new WebSocket(serverIP, {
			headers: this.headers,
			agent: this.agent
		});
		this.ws.binaryType = "nodebuffer";
		this.ws.onopen = this.onopen.bind(this);
        this.ws.onmessage = this.onmessage.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onclose = this.onclose.bind(this);
	}
	spawn(name) {}
	moveTo(x, y) {}
	onopen() {
		this.log('socket open');
		//first send inits to connect then spawn and movement
		setInerval(function() {
			client.spawn(botNick);
		}, 1000);
		setInerval(function() {
			client.moveTo(xPos, yPos);
		}, 100);
	}
	onmessage(msg) {
		let buf = new DataView(msg.data);
		let offset = 0;
		let opCode = buf.readUInt8(offset++);
		switch(opCode) {
			case 16: //tick
				break;
			case 17: //update spectating coordinates in "spectate" mode
				break;
			case 32: // ball id
				break;
			case 21: //debug line drawn from the player to the specified point
				break;
			case 49: //LeaderBoard Update
				break;
			case 50: //team scored update in teams mode
				break;
			case 64: //map size load
				break;
			default:
				this.log(`Got unknown packet: ${opCode}`);
		}
	}
	onerror(e) {
		this.log(`Socket error: ${e}`);
		setTimeout(this.connect.bind(this), 1000); //in 1 second the bot will retry to connect.
	}
	onclose(e) {
		this.log(`Socket closed: ${e}`);
	}
	log(msg) {
		console.log(msg);
	}
	send(buf) {
		if(!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		this.ws.send(buf);
	}
	disconnect() {
		if(this.ws) this.ws.close();
	}
}

function restart() {
	for(var i of bots)
		i.disconnect();
}

function onMessage(buf) {
	let offset = 0;
	let opCode = buf.readUInt8(offset++);
	switch(opCode) {
		case 1:
			break;
		case 2:
			break;
		case 3:
			break;
		default:
			console.log(`Got unknown packet: ${opCode}`);
	}
}

ws.on('connection', ws => {
	console.log('User connected.')
	ws.on('close', () => {
		console.log('Connection was closed.');
	});
	ws.on('error', () => {
		console.log('Error connecting.');
	});
	ws.on('message', msg => {
		onMessage(msg, ws);
	});
});

console.log('Waiting for user connection...');
