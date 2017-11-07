// ==UserScript==
// @name         Constructor | Agar Clones
// @namespace    Bots
// @version      1.0.2
// @description  Bot Template
// @author       TrapKilloYT
// @match        http://*/*
// @grant        none
// ==/UserScript==

let clientIP = 'ws://127.0.0.1:8081';

class Client {
    constructor(server) {
        this.server = server;
        this.ws = null;
        this.moveBots = 0;
        this.xPos = 0;
        this.yPos = 0;
        this.addListener();
        this.connect();
    }
    connect() {
        this.ws = new WebSocket(this.server);
        this.ws.binaryType = "arraybuffer";
        this.ws.onopen = this.onopen.bind(this);
        this.ws.onmessage = this.onmessage.bind(this);
        this.ws.onerror = this.onerror.bind(this);
        this.ws.onclose = this.onclose.bind(this);
        this.log('Client: Connecting to server...');
    }
    onopen() {
        this.log('Client: Success connecting.');
        this.startMoving();
    }
    onmessage(msg) {
        let buf = new DataView(msg.data);
        let offset = 0;
        let opCode = buf.readUInt8(offset++);
        switch(opCode) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }
    onerror(e) {
        this.log('Client: Error connecting.');
    }
    onclose(e) {
        this.log('Client: Connection closed.');
    }
    split() {
        this.send(new Uint8Array([17]));//17 is for most of clones. Change it if needed.
    }
    eject() {
        this.send(new Uint8Array([21]));//21 or 22 is for most of clones. Change it if needed.
    }
    moveTo(x, y) {
        //add movement packet
    }
    addListener() {
        document.addEventListener('mousemove', event => {
            this.xPos = event.clientX; //bots will follow the x position of your mouse
            this.yPos = event.clientY; //bots will follow the y position of your mouse
        });
    }
    startMoving() {
        this.moveBots = setInterval(() => {
            this.moveTo(this.xPos, this.yPos);
        }, 100);
    }
    log(msg) {
        console.log(msg);
    }
    send(buf) {
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN) return;// if connection isn't opened return.
        this.ws.send(buf); //send something.
    }
}

class GUI {
    constructor() {
        this.createGUI();
    }
    createGUI() {
        $('body').append(`<div></div>`); //costumize your GUI here.
    }
}

class Keys {
    constructor() {
        this.addkeys();
    }
    addkeys() {
        document.addEventListener('keydown', this.createkeys.bind(this));
    }
    createkeys(e) {
        var key = e.keyCode;
        switch(key) {
            case "E".charCodeAt(0): // keyCode of E is 69
                client.split();
                break;
            case "R".charCodeAt(0): // keyCode of R is 82
                client.eject();
                break;
        }
    }
}

//Load constructors
window.client = new Client(clientIP);
new GUI();
new Keys();
