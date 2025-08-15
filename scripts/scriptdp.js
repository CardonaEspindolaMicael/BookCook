import pkg from 'hardhat';
const { ethers } = pkg;

async function testContract() {
    try {
        const BookNFT = await ethers.getContractAt(
            "BookNFT",
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        );
        
        const [owner, user1] = await ethers.getSigners();
        console.log("👤 Owner address:", owner.address);
        console.log("👤 User1 address:", user1.address);
        
        // Test 1: Simple mint (owner only)
        console.log("\n🧪 Test 1: Simple mint (owner only)");
        console.log("=" .repeat(50));
        
        const simpleMintTx = await BookNFT.simpleMint(
            "book-001", // bookId
            "https://example.com/metadata/1.json", // tokenURI
            user1.address // recipient
        );
        
        console.log("📋 Simple mint transaction:", simpleMintTx.hash);
        await simpleMintTx.wait();
        console.log("✅ Simple mint successful!");
        
        // Test 2: Full mintBookNFT with metadata
        console.log("\n🧪 Test 2: Full mintBookNFT with metadata and payment");
        console.log("=" .repeat(50));
        
        // Create book metadata
        const bookMetadata = {
            title: "My First NFT Book",
            author: "Test Author",
            description: "A test book for NFT minting",
            coverImage: "https://example.com/cover.jpg",
            totalChapters: 10,
            isComplete: true,
            mintPrice: ethers.parseEther("0.01"), // 0.01 ETH
            maxSupply: 100,
            currentSupply: 0
        };
        
        const mintBookTx = await BookNFT.mintBookNFT(
            "book-002", // bookId
            bookMetadata,
            "https://example.com/metadata/2.json", // tokenURI
            user1.address, // recipient
            owner.address, // author address
            { value: ethers.parseEther("0.01") } // payment
        );
        
        console.log("📋 MintBookNFT transaction:", mintBookTx.hash);
        await mintBookTx.wait();
        console.log("✅ MintBookNFT successful!");
        
        // Test 3: Check contract state
        console.log("\n📊 Contract State");
        console.log("=" .repeat(50));
        
        const totalSupply = await BookNFT.totalSupply();
        console.log("📈 Total supply:", totalSupply.toString());
        
        // Check book metadata
        const storedMetadata = await BookNFT.getBookMetadata("book-002");
        console.log("📖 Book metadata for 'book-002':");
        console.log("   Title:", storedMetadata.title);
        console.log("   Author:", storedMetadata.author);
        console.log("   Max Supply:", storedMetadata.maxSupply.toString());
        console.log("   Current Supply:", storedMetadata.currentSupply.toString());
        
        // Check token URIs
        const tokenURI1 = await BookNFT.tokenURI(1);
        const tokenURI2 = await BookNFT.tokenURI(2);
        console.log("🔗 Token 1 URI:", tokenURI1);
        console.log("🔗 Token 2 URI:", tokenURI2);
        
        // Check book token IDs
        const book1Tokens = await BookNFT.getBookTokenIds("book-001");
        const book2Tokens = await BookNFT.getBookTokenIds("book-002");
        console.log("📚 Book-001 token IDs:", book1Tokens.map(id => id.toString()));
        console.log("📚 Book-002 token IDs:", book2Tokens.map(id => id.toString()));
        
        // Check token ownership
        const owner1 = await BookNFT.ownerOf(1);
        const owner2 = await BookNFT.ownerOf(2);
        console.log("👤 Token 1 owner:", owner1);
        console.log("👤 Token 2 owner:", owner2);
        
        // Check book exists
        const book1Exists = await BookNFT.bookExists("book-001");
        const book2Exists = await BookNFT.bookExists("book-002");
        console.log("✅ Book-001 exists:", book1Exists);
        console.log("✅ Book-002 exists:", book2Exists);
        
        // Test 4: Try minting another copy of book-002
        console.log("\n🧪 Test 4: Mint additional copy of existing book");
        console.log("=" .repeat(50));
        
        const additionalMintTx = await BookNFT.mintBookNFT(
            "book-002", // same bookId
            bookMetadata, // metadata (will use stored version)
            "https://example.com/metadata/3.json", // different tokenURI
            owner.address, // recipient (owner this time)
            owner.address, // author address (must be same as original)
            { value: ethers.parseEther("0.01") } // payment
        );
        
        console.log("📋 Additional mint transaction:", additionalMintTx.hash);
        await additionalMintTx.wait();
        console.log("✅ Additional mint successful!");
        
        // Final state check
        const finalSupply = await BookNFT.totalSupply();
        const finalBook2Tokens = await BookNFT.getBookTokenIds("book-002");
        const updatedMetadata = await BookNFT.getBookMetadata("book-002");
        
        console.log("\n📊 Final State");
        console.log("=" .repeat(50));
        console.log("📈 Final total supply:", finalSupply.toString());
        console.log("📚 Book-002 token IDs:", finalBook2Tokens.map(id => id.toString()));
        console.log("📖 Book-002 current supply:", updatedMetadata.currentSupply.toString());
        
        console.log("\n🎉 All tests completed successfully!");
        
    } catch (error) {
        console.error("❌ Test failed:", error);
        
        if (error.message.includes('no matching fragment')) {
            console.log("\n🔍 Available functions:");
            const BookNFT = await ethers.getContractAt("BookNFT", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
            Object.keys(BookNFT.interface.functions).forEach(func => {
                console.log(`   - ${func}`);
            });
        }
    }
}

testContract().catch(console.error);