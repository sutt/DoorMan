# DoorMan

Your on-ramp to the LightningCloud from your favorite GenerativeAI GUI.

### Quickstart

```bash
git clone https://github.com/sutt/DoorMan.git

cd DoorMan
npm install
npm run build

# add any values you want to `workers.json` to `.src/data`
# or just use `workers.example.json` as a template

# do any typescript stuff you need

# this will start doorman ui on localhost:8080
npm run start

# set env BOSSMAN=1 to start bossman on localhost:8090, or run
node ./dist/index.js --bossman
```

Coming soon: npm package...install as simple as `npm install -g doorman`.

### Lightning cleaves Front & Back of AI apps

How lightning enables cooperative inter-operation of Front & Back ends of an AI app run by different users:

On the left, we see the typical webapp architecutre with the backend hosted on a personal cloud or beefy desktop PC for hardware boosted inference, while the user controls the engine through a GUI on their local machine in the browser. 

Most users want to use open-source AI, not administer it. Unfortunately, the open-source AI community has not yet developed a robust, easy-to-use, and secure way to host and share AI models.

![DoorMan](./docs/assets/doorman-network-diagram-v1.png)

On the right, we see how each of the components of the architecture is preserved in totality, but now handled by separate parties:
 - Prompt Requestors
 - Cloud Workers - available vm's or gaming computer can pair up with the user's GUI to provide image generation or text completion in exchange for a one-time lightning payment.

If this is confusing, think of Uber. The user is the passenger, the driver is the worker. What ties them together is self-interest, and that's what DoorMan focuses on: 

 > How to attach a lightning payment such that quick one and done transactions can occur between two parties unfamiliar in the most trustless way.

The wins here for this new architecture from the uer's side
 - TODO
 - TODO


available service workers that can pair up with the user's GUI to provide image generation or text completion in exchange for a one-time lightning payment.

### Components & Information  Flow

![DoorMan](./docs/assets/doorman-network-diagram-v1.1.png)