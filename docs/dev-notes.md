## Project Steps

### Proof of Concept
-  attach a lightning payment to an outgoing request from a locally running frontend
-  how to receive a websocket from a cloud running instance,
how to put that websocket connection behind an LNPay?

### MVP
- admin panel enables adding sats to a wallet
- admin panel enables basic switching backends
- LN-paywall server-side
- doorman one click app launches ui /home
- one skin of a project frontend (a4one)

### Stretch
- add number of sats into the gui on the generate button 
- multiple frontends
- Backend api for status, availability
- more complex fee schedule
- log of payment/generations
- web version with trial sats

---------

## Proof of Concept Recipe 

Two Chained Proxy Servers b/w Client and Server
 1. UI-client in browser (at proxyPort)
 2. Through Local-Proxy (with added lightning_r_hash header)
 3. Up to Remote Proxy on open port (with checking header)
 4. Into Remote API/Engine 

Commands:
 1. Open port 7862 on the VM
 1. Run Auto1111 on the VM with the following commands, note it's not on open port
    - `> webui.sh --listen --port 7865`
 1. Start the proxy server on the remote to listen to open port, and direct to Auto1111
    - `> node index.js --ws_port 7865 --http_port 7865 --proxy_port 7862 --proxy_host 0.0.0.0`
    - for next step, add `--check_header` flag as well
 1. Locally, startup the GUI with
    - `> webui.bat --port 7861` 
    - `> node index.js --ws_port 7861 --ws_host 127.0.0.1 --http_port 7861 --proxy_port 8080 `
 1. Locally, change tunnel to point at cloud
    - add to `.env`: `WS_HOST=32.x.x.x` (which affect host)
    - `> node index.js --ws_port 7862 --http_port 7861 --proxy_port 8080 --hack_header`
    - by changing http host/port to work with remote, the image will download


----------
 ## Install Automatic1111

### to run:
- locally for dev with no gpu
```
> webui.bat --skip-torch-cuda-test --no-half 
```

- server-side for prod
```
> webui.sh --listen --port 7862 [--share]
```

- `--listen` to run on host 0.0.0.0
- default port=7160

### requirements & gotcha's
- requires python 3.10, therefore use env vars to point to that python version.
- `webui-user.bat` helps supply custom env vars to your session and calls startup script, `webui.bat`, but the command line args you pass to the `webui-user.bat` don't flow through to the main startup script.


### other notes:
- For dev, can lower the image-gen time by changing `ui-config.json` to use:
```
"txt2img/Sampling steps/value": 2,
"txt2img/Width/value": 64,
"txt2img/Width/minimum": 64,
```
- there are secondary windows instruction for release 1.0 with slightly different install scripts (currently 1.4 on main as of three weeks ago)
