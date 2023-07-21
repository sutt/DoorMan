import http from "http";
import httpProxy from "http-proxy";

export function setupProxy(
  wsHost : string = "127.0.0.1",
  wsPort : number = 7861,
  httpHost : string = "127.0.0.1",
  httpPort : number = 3000,
) {
  const proxy = httpProxy.createProxyServer({
    ws: true,
  });

  const server = http.createServer((req, res) => {
    proxy.web(req, res, {target: `http://${httpHost}:${httpPort}`});
  });

  server.on("upgrade", (req, socket, head) => {
    // return
    proxy.ws(req, socket, head, {target: `ws://${wsHost}:${wsPort}`});
  });

  proxy.on("error", (err) => {
    console.error("proxy ws err: ", err);
  });

  server.on("error", (err) => {
    console.error("proxy server err: ", err);
  });

  return server;
}
