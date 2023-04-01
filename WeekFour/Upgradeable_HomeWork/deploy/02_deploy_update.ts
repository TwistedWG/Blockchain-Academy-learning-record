import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readAddressList, storeAddressList } from "../scripts/addressRecord";
import { TransparentUpgradeableProxy__factory, ProxyAdmin__factory } from "../typechain-types";

const { ethers } = require("hardhat")

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts, network } = hre;
    const [dev] = await hre.ethers.getSigners();
    const { deploy } = deployments;
  
    const { deployer } = await getNamedAccounts();
    // const [deployer] = await hre.ethers.getSigners()
    console.log("Update:", deployer);
  
    const addressList = readAddressList();
  
    const TwdV2 = await deploy("TwdV2", {
      contract: "TwdV2",
      from: deployer,
      args: [],
      log: true,
    });
    console.log("TwdV2 deployed to:", TwdV2.address);
    
    addressList[network.name].Implementation_Tw2 = TwdV2.address;
    storeAddressList(addressList);

    const proxyAddress = addressList[network.name].MyContract;
    const proxyAdminAddress = addressList[network.name].ProxyAdmin;

    const proxy = new TransparentUpgradeableProxy__factory(dev).attach(proxyAddress);

    const proxyAdmin = new ProxyAdmin__factory(dev).attach(proxyAdminAddress)

    //const ProxyAdmin = await ethers.getContract("ProxyAdmin")
    //const transparentProxy = await ethers.getContract("TwistedWToken_Proxy")

    const upgradeTx = await proxyAdmin.upgrade(proxy.address, TwdV2.address) ;
    console.log("MyContract upgraded to proxy");
  };

func.tags = ["upgradContract"];
export default func;