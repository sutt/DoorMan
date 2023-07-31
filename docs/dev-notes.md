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

--------

## New UI notes:

enable dark mode on webui: in `theme.css` replace `.dark {` selector with `body {` selector.

use the interrupt button to check the state of the webui clientside.

new startup command allows us to drop websockets and only use http

> webui.bat --skip-torch-cuda-test --no-half --port 7861 --no-gradio-queue

--------

## Skinning the Automattic1111 WebUI

- serived from 'save page as' on the live site
   - many js fragments and css sheets end up in `Stable Diffusion files/` directory

- need to copy /assets from `venv/.../site-packages/gradio/templates/frontend/` and put it as folder
   - need to find/replace the on `href="127...PPPP"` in script tags tp relative paths within `index.html` that poonts to assets/ dir.

- made early return js functions:
   - extraNetworks.js.download:setupExtraNetworksForTab()
   - imageviewer.js.download: gradioApp().appendChild(modal)
   - ui.js.download: onAfterUiUpdate()

- needed to change this a .js.download file to just a .js for certrain script tags:

   - from this:

     ``` <script type="module" crossorigin="" src="./Stable Diffusion_files/index-607392ea.js.download"></script> ```
      
   - to this (by just changing the filename, or pointing to assets):
   
      ``` <script type="module" crossorigin="" src="./assets/index-607392ea.js"></script> ```

- needed to add `theme.css` to root (otherwise caused problem with js)

- delete in the innerHTML of <gradioapp></gradioApp> but keep the outerHtml(or else two ui's on top of each other). The JS will write into that element

- build some mock responses for the following routes:
   - `/run/predict POST`
   - `/internal/progress POST`
   - `/info GET`
   

- other notes:
   - do we need to get responses on info/ run/predict?
      - IIRC, its not that it needs good data, just valid json to prevent bombing out js
   -client/dist/js/index.js is viewable in devtools:source but it's not a file sent, its contructed out of .js fragment files
   - one file, index-607...js is the most important fragment, since it appears to initiate the request for all other js fragments
   - appears the frontend framework the gradio app uses is Svelte

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
