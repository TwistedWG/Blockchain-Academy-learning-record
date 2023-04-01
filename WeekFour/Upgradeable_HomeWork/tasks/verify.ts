import { task, HardhatUserConfig, types } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import { readAddressList } from "../scripts/addressRecord";
import { Twd__factory, TransparentUpgradeableProxy__factory } from "../typechain-types";

// npx hardhat --config ./tasks/verify.ts getTotalSupply --network localhost
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

task("getValue").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev] = await hre.ethers.getSigners();
  const addressList = readAddressList();

  const myContract = new Twd__factory(dev).attach(
    addressList[network.name].MyContract
  );
  const value = await myContract.value();
  console.log("value: ", value.toString());
});
  
task("getName").setAction(async (_, hre) => {
  const { network } = hre;
  const [dev] = await hre.ethers.getSigners();
  const addressList = readAddressList();

  const myContract = new Twd__factory(dev).attach(
    addressList[network.name].MyContract
  );
  const name = await myContract.name();
  console.log("name: ", name.toString());
});
  
task("setValue")
  .addParam("value", "The value to set", undefined, types.int)
  .setAction(async (taskArgs, hre) => {
    const { network } = hre;
    const [dev] = await hre.ethers.getSigners();
    const addressList = readAddressList();

    const myContract = new Twd__factory(dev).attach(
      addressList[network.name].MyContract
    );
    const tx = await myContract.setValue(taskArgs.value);
    console.log("tx: ", await tx.wait());

    const currentValue = await myContract.value();
    console.log("currentValue: ", currentValue.toString());
  });
  

export {};