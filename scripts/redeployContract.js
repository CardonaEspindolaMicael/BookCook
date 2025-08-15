import pkg from 'hardhat';
const { ethers } = pkg;
import fs from 'fs';

async function main() {
    console.log("🚀 Redeploying BookNFT contract...");
    console.log("=" .repeat(50));
    
    try {
        // Get the contract factory
        const BookNFT = await ethers.getContractFactory("BookNFT");
        
        // Get deployer account
        const [deployer] = await ethers.getSigners();
        console.log("👤 Deploying with account:", deployer.address);
        
        // Check deployer balance
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("💰 Deployer balance:", ethers.formatEther(balance), "ETH");
        
        // Deploy the contract
        console.log("⏳ Deploying contract...");
        const bookNFT = await BookNFT.deploy();
        
        // Wait for deployment
        await bookNFT.waitForDeployment();
        const contractAddress = await bookNFT.getAddress();
        
        console.log("✅ BookNFT deployed to:", contractAddress);
        
        // Test basic functions immediately
        console.log("\n🧪 Testing basic functions...");
        
        const name = await bookNFT.name();
        const symbol = await bookNFT.symbol();
        const owner = await bookNFT.owner();
        const totalSupply = await bookNFT.totalSupply();
        
        console.log("📖 Name:", name);
        console.log("🏷️  Symbol:", symbol);
        console.log("👑 Owner:", owner);
        console.log("📊 Total Supply:", totalSupply.toString());
        
        // Test simple mint
        console.log("\n🧪 Testing simple mint...");
        const mintTx = await bookNFT.simpleMint(
            "test-book-001",
            "https://example.com/metadata/1.json",
            deployer.address
        );
        
        console.log("⏳ Waiting for mint transaction...");
        await mintTx.wait();
        console.log("✅ Mint successful!");
        
        // Check updated total supply
        const newTotalSupply = await bookNFT.totalSupply();
        console.log("📊 New Total Supply:", newTotalSupply.toString());
        
        // Save deployment info
        const deploymentInfo = {
            contractAddress: contractAddress,
            network: "localhost",
            deployer: deployer.address,
            deploymentTime: new Date().toISOString(),
            name: name,
            symbol: symbol,
            initialTotalSupply: newTotalSupply.toString()
        };
        
        fs.writeFileSync(
            'deployment-fresh.json', 
            JSON.stringify(deploymentInfo, null, 2)
        );
        
        console.log("\n📄 Deployment info saved to deployment-fresh.json");
        
        console.log("\n🎉 Deployment completed successfully!");
        console.log("📋 Contract address:", contractAddress);
        console.log("🔧 Use this address in your test scripts");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        
        if (error.message.includes("could not detect network")) {
            console.log("\n🔧 Make sure Hardhat node is running:");
            console.log("   npx hardhat node");
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});