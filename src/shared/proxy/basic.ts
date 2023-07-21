import http from "http";
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  // target: TARGET_HOST,
  ws: true,
});

const server = http.createServer(() => {
  // proxy.web(req, res, {target: `http://${wsHost}:${httpPort}`});
});

server.on("upgrade", (req, socket, head) => {
  if (req.headers["lightning_r_hash"]) {
    console.log("lightning_r_hash: ", req.headers["lightning_r_hash"]);
    proxy.ws(req, socket, head);
  } else {
    console.log("...403, no r_hash");
    // send back 403
  }
});
