import http from "http";
import httpProxy from "http-proxy";


export function setupProxy() {
  
  const state = {
    wsHost :  "127.0.0.1",
    wsPort : 7861,
    httpHost : "127.0.0.1",
    httpPort :  3000,
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

  server.on("upgrade", (req, socket, head) => {
    // return
    proxy.ws(req, socket, head, {target: `ws://${state.wsHost}:${state.wsPort}`});
  });

  proxy.on("error", (err) => {
    console.error("proxy ws err: ", err);
  });

  server.on("error", (err) => {
    console.error("proxy server err: ", err);
  });


  return {server, updateState};
}
