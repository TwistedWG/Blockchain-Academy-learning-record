//npm install @nomiclabs/hardhat-web3 --save-dev
//npm install @nomiclabs/hardhat-ethers --save-dev
import { task, HardhatUserConfig, types } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { readAddressList } from "./scripts/addressRecord";
import { Twd__factory } from "./typechain-types";


const data = require("./.secret.json");

task("accounts").setAction(async (_, hre) => {
  const { network } = hre;
  const accounts = await hre.ethers.getSigners();;

  console.log("Accounts:");
  for (const account of accounts) {
    console.log("- Address:", account.address);
    if(network.name!="localhost"){
      const balance = await hre.ethers.provider.getBalance(account.address);
      console.log("- Balance:", hre.ethers.utils.formatEther(balance), "ETH\n");
    }
  }   
});

task("getVersion").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev] = await hre.ethers.getSigners();
  const addressList = readAddressList();
  console.log(addressList[network.name].MyContract)

  const myContract = new Twd__factory(dev).attach(
    addressList[network.name].MyContract
  );
  const version = await myContract.VERSION();

  console.log("version: ", version.toString());
});

const config: HardhatUserConfig = {
  solidity: {
    version:"0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      localhost: 0,
      tokenOwner: 0,
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts:{
        mnemonic:data.mnemonic
      }  
    },
    bsctest: {
      url: data.bsctest_url,
      accounts: [data.bsctest_key],
      timeout: 100000
    },
    goerli: {
      url: data.goerli_url,
      chainId: 5,
      accounts: [data.bsctest_key]
    },
    bsc: {
      url: data.bsc_url,
      chainId: 56,
      accounts: [data.bsctest_key]
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },  
  mocha: {
    timeout: 600000,
  },
};

export default config;
