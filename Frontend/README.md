# set up your environment variables
# read the comments in the .env files for what is required/optional
$ cp .env.example .env

# fill in your own values in .env, then =>
$ yarn
$ yarn start
```

The site is now running at `http://localhost:3000`!
Open the source code and start editing!

## Rinkeby Testing

**Rinkeby faucet for sOHM:**
[Lives here](https://rinkeby.etherscan.io/address/0x800B3d87b77361F0D1d903246cA1F51b5acb43c9#writeContract), to retrieve test sOHM click `Connect to Web3` and use function #3: `dripSOHM`. After connecting to web3, click `Write` to execute and 10 sOHM will automatically be transferred to your connected wallet.

Note: The faucet is limited to one transfer per wallet every 6500 blocks (~1 day)

**Rinkeby faucet for WETH:**
[Wrap rinkeby eth on rinkeby uniswap](https://app.uniswap.org/#/swap)

**Rinkeby faucets for LUSD, FRAX & DAI can be taken from rinkeby etherscan:**

1. Go to `src/helpers/AllBonds.ts`
2. then copy the rinkeby `reserveAddress` for the applicable bond & navigate to that contract on rinkeby etherscan. 
3. On Rinkeby etherscan use the `mint` function. You can use the number helper for 10^18 & then add four more zeros for 10,000 units of whichever reserve you are minting.

### Architecture/Layout
The app is written in [React](https://reactjs.org/) using [Redux](https://redux.js.org/) as the state container. 

The files/folder structure are a  **WIP** and may contain some unused files. The project is rapidly evolving so please update this section if you see it is inaccurate!

```
./src/
├── App.jsx       // Main app page
├── abi/          // Contract ABIs from etherscan.io
├── actions/      // Redux actions 
├── assets/       // Static assets (SVGs)
├── components/   // Reusable individual components
├── constants.js/ // Mainnet Addresses & common ABI
├── contracts/    // TODO: The contracts be here as submodules
├── helpers/      // Helper methods to use in the app
├── hooks/        // Shared reactHooks
├── themes/       // Style sheets for dark vs light theme
└── views/        // Individual Views
```


## 🚀 Deployment
