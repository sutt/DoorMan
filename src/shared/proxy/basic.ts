import http from "http";
import httpProxy from "http-proxy";


export function setupProxy(params?: {
  wsHost?: string, 
  wsPort?: number, 
  httpHost?: string, 
  httpPort?: number, 
  checkHeaderCallback?:  (req: http.IncomingMessage) => Promise<boolean>
}) {
  
  const state = {
    wsHost: params?.wsHost || "localhost",
    wsPort: params?.wsPort || 7861,
    httpHost: params?.httpHost || "localhost",
    httpPort: params?.httpPort || 3005,
  };
  
  const updateState = (key : string, value : any) => {
    state[key] = value;    
  };

  const proxy = httpProxy.createProxyServer({
    ws: true,
  });

  const server = http.createServer((req, res) => {
    proxy.web(req, res, {target: `http://${state.httpHost}:${state.httpPort}`});
  });

  server.on('upgrade', async (req, socket, head) => {
    if (params?.checkHeaderCallback) {
        const authorized = await params.checkHeaderCallback(req);
        if (authorized) {
            proxy.ws(req, socket, head, { target: `ws://${state.wsHost}:${state.wsPort}` });
        } else {
            // This is to tell the doorman client that is was not authorized
            // pass along the error code so client can help user debug
            socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
            socket.destroy();
        }
    } else {
        proxy.ws(req, socket, head, { target: `ws://${state.wsHost}:${state.wsPort}` });
    }
  });

  proxy.on("error", (err) => {
    console.error("proxy ws err: ", err);
  });

  server.on("error", (err) => {
    console.error("proxy server err: ", err);
  });


  return {server, updateState};
}
