import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readAddressList, storeAddressList } from "../scripts/addressRecord";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();
  console.log("Deploying ProxyAdmin with account:", deployer);

  const addressList = readAddressList();

  const proxyAdmin = await deploy("ProxyAdmin", {
    contract: "ProxyAdmin",
    from: deployer,
    args: [],
    log: true,
  });
  console.log("ProxyAdmin deployed to:", proxyAdmin.address);

  addressList[network.name].ProxyAdmin = proxyAdmin.address;
  storeAddressList(addressList);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

func.tags = ["ProxyAdmin"];
export default func;
