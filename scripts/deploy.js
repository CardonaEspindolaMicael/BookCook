import hre from "hardhat";
import { writeFileSync } from 'fs';



async function main() {
  console.log("🚀 Deploying BookNFT contract...");

  // Get the contract factory
  const BookNFT = await hre.ethers.getContractFactory("BookNFT");
  
  // Deploy the contract
  const bookNFT = await BookNFT.deploy();
  
  // Wait for deployment to finish
  await bookNFT.waitForDeployment();
  
  // Get the deployed contract address
  const address = await bookNFT.getAddress();
  
  console.log("✅ BookNFT deployed to:", address);
  console.log("📋 Contract details:");
  console.log("   - Network:", hre.network.name);
  console.log("   - Chain ID:", hre.network.config.chainId);
  console.log("   - Address:", address);
  
  // Verify the contract on Etherscan/Mantle Explorer
  if (hre.network.config.chainId !== 31337) { // Skip verification for local network
    console.log("🔍 Verifying contract...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified successfully!");
    } catch (error) {
      console.log("⚠️  Contract verification failed:", error.message);
    }
  }
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    contractAddress: address,
    deployer: await (await hre.ethers.getSigners())[0].getAddress(),
    deploymentTime: new Date().toISOString(),
  };
  
  console.log("📄 Deployment info saved to deployment.json");
  writeFileSync(
    'deployment.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  return address;
}

// Handle errors
main()
  .then((address) => {
    console.log("🎉 Deployment completed successfully!");
    console.log("📝 Next steps:");
    console.log("   1. Update your .env file with the contract address");
    console.log("   2. Copy the contract ABI to src/contracts/BookNFT.json");
    console.log("   3. Test the contract functionality");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
