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
- more complex fee schedule

----------
 ## Install Automatic1111

### to run:
- locally for dev with no gpu
```
> webui.bat --skip-torch-cuda-test --no-half `
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
