const http = require('http');
const httpProxy = require('http-proxy');
const WebSocket = require('ws');
require('dotenv').config()


const log = false;           // log ws events
const logMsg = true;        // log ws messages
const logHttp = false;      // log http proxy activity
const errLog = true;        // log errors


const proxyPort = 8080

const TARGET_HOST = 'ws://127.0.0.1:7861';
const httpPort = 7861

// const wsPort = 7182
const wsPort = 7862

// const wsHost = '127.0.0.1'
const wsHost = process.env.REMOTE_HOST

// if true, proxies http + ws, but prevents interception of ws requests
//  this is good for simply proxying the app whitout any problems
// and you can still do modification with http req/res.
const simpleProxy = false; 

// if true, altters the message to demonstrate the capability
// currently set to change height to 128
const hack = true


const proxy = httpProxy.createProxyServer({
    target: TARGET_HOST, 
    ws: true
})

const server = http.createServer((req, res) => {
          
    if (logHttp) console.log("http req.url: ", req.url)

    proxy.web(req, res, {target: `http://127.0.0.1:${httpPort}`});

});

server.on('upgrade', (req, socket, head) => {

    if (log) console.log("upgrade event: ", req.url)
    
    if (simpleProxy) {
        proxy.ws(req, socket, head);
        return
    }

    
    // heart of the websockets intercept + modification, notes:
    // 
    //  - .send(msg, {binary:false}) is required to 
    //        maintain compatibility with our client/servers protocol
    // - the http UPGRADE method is fired once to create a ws channel
    //        which can then have multiple back&forth messages. That's
    //        what we handle below on message events.
    //  
            
    const wsServer = new WebSocket.Server({ noServer: true })
    const wsClient = new WebSocket(`ws://${wsHost}:${wsPort}` + req.url)
    
    wsClient.on('open', () => {
        
        if (log) console.log('WebSocket client connected')
        
        wsServer.handleUpgrade(req, socket, head, (ws) => {
        
            ws.on('message', (message) => {
                
                if (wsClient.readyState === WebSocket.OPEN) {
                
                    const sMsg = Buffer.from(message).toString()
                    let oMsg = JSON.parse(sMsg)

                    if ((hack)
                        && (oMsg.data)
                    ) {
                    // oMsg.data = oMsg.data.replace(/"id":\d+/g, '"id":0')
                        oMsg.data[17] = 128
                        message = JSON.stringify(oMsg)
                    }
                    
                    if (logMsg) {
                        console.log(`\n>>>>>>>> Message from client >>>>>>>>\n`)
                        console.log(oMsg)
                    }
                    
                    wsClient.send(message, {binary:false})
                
                }
        });
    });

    wsClient.on('message', (message) => {
    
        if (log) console.log('Message from server:');
    
        wsServer.clients.forEach((client) => {

            if (client.readyState === WebSocket.OPEN) {
                
                const sMsg = Buffer.from(message).toString()
                const oMsg = JSON.parse(sMsg)
                
                if (logMsg) {
                    console.log(`\n<<<<<<<<Message from server <<<<<<<<\n`)
                    console.log(oMsg)
                }

                client.send(message, {binary:false})
            }
        });
    });
    });


    wsClient.on('error', (error) => {
        if (errLog) console.error('WebSocket client encountered an error:', error);
        wsServer.handleUpgrade(req, socket, head, (ws) => {
            ws.send(JSON.stringify({ error: 'Failed to connect to the target WebSocket server' }));
            ws.close();
        });
    });
})

    

proxy.on('error', (err) => {
    if (errLog) console.log("proxy.on('error') error: ", err)
})

server.on('error', (err) => {
    console.log("server.on('error') error: ", err)
})
      

server.listen(proxyPort, () => {
    console.log(`Proxy server is running on port ${proxyPort}`);
});
      