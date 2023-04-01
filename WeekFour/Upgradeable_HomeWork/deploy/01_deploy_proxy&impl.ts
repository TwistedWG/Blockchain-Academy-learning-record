import { DeployFunction, ProxyOptions } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { readAddressList, storeAddressList } from "../scripts/addressRecord";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("Deploying My Contract with account:", deployer);

  const addressList = readAddressList();

  const proxyOptions: ProxyOptions = {
    proxyContract: "TransparentUpgradeableProxy",
    viaAdminContract: "ProxyAdmin",
    execute: {
      // 只在初始化时执行
      init: {
        // 执行initialize方法
        methodName: "init",
        // 参数
        args: [66],
      },
    },
  };

  const myContract = await deploy("Twd", {
    contract: "Twd",
    from: deployer,
    proxy: proxyOptions,
    args: [],
    log: true,
  });

  console.log("Proxy deployed to:", myContract.address);
  console.log("Implementation deployed to:", myContract.implementation);

  addressList[network.name].MyContract = myContract.address;
  addressList[network.name].Implementation = myContract.implementation;
  storeAddressList(addressList);
};

// npx hardhat deploy --network {network} --tags {Tag}
func.tags = ["MyContract"];
export default func;
