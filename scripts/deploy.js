const hre = require("hardhat");
require("dotenv").config();

async function main() {
  // Use the verified address from the requirement
  const verifiedAddress = "0x081C18e85D09645CA64dBD1e4781135F5E54110f";
  
  console.log("Deploying contracts with the account:", (await hre.ethers.getSigners())[0].address);
  console.log("Verified address for funds:", verifiedAddress);

  const HealthInsurance = await hre.ethers.getContractFactory("HealthInsurance");
  const healthInsurance = await HealthInsurance.deploy(verifiedAddress);

  await healthInsurance.deployed();

  console.log("HealthInsurance deployed to:", healthInsurance.address);
  
  // Wait for a few block confirmations to ensure the contract is mined
  console.log("Waiting for confirmations...");
  await healthInsurance.deployTransaction.wait(5);
  
  // Verify contract on Etherscan
  console.log("Verifying contract on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: healthInsurance.address,
      constructorArguments: [verifiedAddress],
    });
    console.log("Contract verified on Etherscan!");
  } catch (error) {
    console.error("Error verifying contract:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });