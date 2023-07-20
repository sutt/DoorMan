const http = require('http');
const httpProxy = require('http-proxy');
const WebSocket = require('ws');

require('dotenv').config()

const argv = require('yargs/yargs')(process.argv.slice(2))
    .option('ws_host',      {type: 'string',})
    .option('ws_port',      {type: 'number',})
    .option('http_host',    {type: 'string',})
    .option('http_port',    {type: 'number',})
    .option('proxy_host',   {type: 'string',})
    .option('proxy_port',   {type: 'number',})
    .option('hack',         {type: 'boolean',})
    .option('hack_header',  {type: 'boolean',})
    .option('log_header',   {type: 'boolean',})
    .option('check_header', {type: 'boolean',})
    .option('simple_proxy', {type: 'boolean',})
    .option('log_level',    {type: 'string',})
    .help()
    .alias('help', 'h')
    .argv;

const wsPort        = argv.ws_port          || process.env.WS_PORT  || 7861;
const wsHost        = argv.ws_host          || process.env.WS_HOST  || '127.0.0.1';

const httpPort      = argv.http_port        || process.env.HTTP_PORT || 7861;
const httpHost      = argv.http_host        || process.env.HTTP_HOST || '127.0.0.1';

const proxyPort     = argv.proxy_port       || process.env.PROXY_PORT || 8080;
const proxyHost     = argv.proxy_host       || process.env.PROXY_HOST || '127.0.0.1';

const hack          = argv.b_hack           || undefined            || false;
const hackHeader    = argv.hack_header      || undefined            || false;
const logHeader     = argv.log_header       || undefined            || false;
const checkHeader   = argv.check_header     || undefined            || false;

// run --mock_server 127.0.0.1:PPPP to proxy the three server calls made
const mockServer    = argv.mock_server      || undefined            || false;


// if true, proxies http + ws, but prevents interception of ws requests
const simpleProxy   = argv.simple_proxy     || undefined            || false;

// log vars turn on console printing for various events
// e.g. --log_vars logWs,logMsg
let logVars = (argv.log_vars || process.env.LOG_VARS || '').split(',');

const {logWs, logMsg, logHttp, logErr} = {
    logWs:      logVars.includes('logWs'),      // log ws events
    logMsg:     logVars.includes('logMsg'),     // log ws messages
    logHttp:    logVars.includes('logHttp'),    // log http proxy activity
    logErr:     logVars.includes('logErr')      // log errors
};


const proxy = httpProxy.createProxyServer({
    ws: true
})

const server = http.createServer((req, res) => {
          
    if (logHttp) console.log("http req.url: ", req.url)

    if ((mockServer)  &&
        (
            (req.url == '/info') ||                 // initial call to populate json of info
            (req.url == '/run/predict') ||                 // initial call to populate models?
            (req.url == '/internal/progress') ||    // called before /queue/join/
            (req.url.includes(`/file=C:/`))                  // allows the image to be viewable
        )
        ) {
        // TODO - we'll just mock this data and put into app
        console.log(`...proxying ${req.url} to SD api server (instead of static file server)`)
        proxy.web(req, res, {target: `http://${mockServer}`}); 
        return
    }
    
    proxy.web(req, res, {target: `http://${wsHost}:${httpPort}`});   //TODO - wsHost seems wrong here

});

server.on('upgrade', (req, socket, head) => {

    if (logWs) console.log("upgrade event: ", req.url)

    if (checkHeader) {
        
        if (req.headers['lightning_r_hash']) {
        
            console.log('lightning_r_hash: ', req.headers['lightning_r_hash'])
        
        } else {
            
            console.log('...402, `no lightning_r_hash` header')
            
            // this closes it but doesn't send a message
            // socket.write('HTTP/1.1 403 Forbidden\r\nContent-Type: text/plain\r\n\r\nNo lightning_r_hash in headers');
            // socket.destroy();
            
            // this uses websocket to send a 402, would prefer just http response
            const wsServer = new WebSocket.Server({ noServer: true })
            
            wsServer.handleUpgrade(req, socket, head, (ws) => {
                const msg402 = JSON.stringify({
                    'msg': 'ln_pay', 
                    'data': '402: No lightning_r_hash in headers'
                })
                ws.send(msg402, {binary:false});
                ws.close();
            });

            return 
            
        }

    }

    
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
    
    // use req.headers to pass through all headers
    const clientWsHeaders = {}

    if (hackHeader) {
        clientWsHeaders['lightning_r_hash'] = '00ff00af16'
    }
    
    const wsClient = new WebSocket(
         address = `ws://${wsHost}:${wsPort}${req.url}`
        ,options = {headers: clientWsHeaders}
    )

    
    wsClient.on('open', () => {
        
        if (logWs) console.log('WebSocket client connected')

        if (logHeader) {
            console.log('req.headers: ', req.headers)
        }
        
        wsServer.handleUpgrade(req, socket, head, (ws) => {
        
            ws.on('message', (message) => {
                
                if (wsClient.readyState === WebSocket.OPEN) {
                    
                    const sMsg = Buffer.from(message).toString()
                    let oMsg = JSON.parse(sMsg)
                
                    if ((hack)&& (oMsg.data)) {
                        
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
    
        if (logWs) console.log('Message from server:');
    
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
        if (logErr) console.error('WebSocket client encountered an error:', error);
        wsServer.handleUpgrade(req, socket, head, (ws) => {
            ws.send(JSON.stringify({ error: 'Failed to connect to the target WebSocket server' }));
            ws.close();
        });
    });
})

    

proxy.on('error', (err) => {
    if (logErr) console.log("proxy.on('error') error: ", err)
})

server.on('error', (err) => {
    console.log("server.on('error') error: ", err)
})
      

server.listen(proxyPort, proxyHost, () => {
    console.log(`Proxy is running on host ${proxyHost} port ${proxyPort}`);
});
      