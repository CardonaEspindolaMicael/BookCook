import pkg from 'hardhat';
const { ethers } = pkg;

async function workaroundTest() {
    console.log("🚀 Testing BookNFT contract (avoiding totalSupply)");
    console.log("=" .repeat(60));
    
    try {
        const BookNFT = await ethers.getContractAt(
            "BookNFT",
            "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
        );
        
        const [owner, user1] = await ethers.getSigners();
        console.log("👤 Owner:", owner.address);
        console.log("👤 User1:", user1.address);
        
        // Test basic contract info
        console.log("\n📖 Contract Info:");
        const name = await BookNFT.name();
        const symbol = await BookNFT.symbol();
        const contractOwner = await BookNFT.owner();
        console.log("   Name:", name);
        console.log("   Symbol:", symbol);
        console.log("   Contract Owner:", contractOwner);
        
        // Check existing tokens (from previous mints)
        console.log("\n🔍 Checking existing tokens:");
        
        // Count tokens manually
        let tokenCount = 0;
        const maxCheck = 20; // Check up to 20 tokens
        const existingTokens = [];
        
        for (let i = 1; i <= maxCheck; i++) {
            try {
                const tokenOwner = await BookNFT.ownerOf(i);
                const tokenURI = await BookNFT.tokenURI(i);
                const bookId = await BookNFT.getBookId(i);
                
                existingTokens.push({
                    tokenId: i,
                    owner: tokenOwner,
                    uri: tokenURI,
                    bookId: bookId
                });
                tokenCount++;
                
            } catch (error) {
                // Token doesn't exist, which is fine
                break;
            }
        }
        
        console.log(`📊 Found ${tokenCount} existing tokens:`);
        existingTokens.forEach(token => {
            console.log(`   Token ${token.tokenId}:`);
            console.log(`     Owner: ${token.owner}`);
            console.log(`     Book ID: ${token.bookId}`);
            console.log(`     URI: ${token.uri}`);
        });
        
        // Check book information
        console.log("\n📚 Book Information:");
        const uniqueBooks = [...new Set(existingTokens.map(t => t.bookId))];
        
        for (const bookId of uniqueBooks) {
            try {
                const bookTokens = await BookNFT.getBookTokenIds(bookId);
                const bookAuthor = await BookNFT.getBookAuthor(bookId);
                const bookExists = await BookNFT.bookExists(bookId);
                
                console.log(`   Book: ${bookId}`);
                console.log(`     Exists: ${bookExists}`);
                console.log(`     Author: ${bookAuthor}`);
                console.log(`     Token IDs: ${bookTokens.map(id => id.toString()).join(', ')}`);
                
                // Try to get metadata if available
                try {
                    const metadata = await BookNFT.getBookMetadata(bookId);
                    if (metadata.title) {
                        console.log(`     Title: ${metadata.title}`);
                        console.log(`     Author Name: ${metadata.author}`);
                        console.log(`     Max Supply: ${metadata.maxSupply.toString()}`);
                        console.log(`     Current Supply: ${metadata.currentSupply.toString()}`);
                    }
                } catch (metaError) {
                    console.log(`     Metadata: Not available`);
                }
                
            } catch (error) {
                console.log(`   ❌ Error getting book info for ${bookId}:`, error.message);
            }
        }
        
        // Test minting a new NFT
        console.log("\n🧪 Testing new mint:");
        
        try {
            const newMintTx = await BookNFT.simpleMint(
                "test-book-003",
                "https://example.com/metadata/new.json",
                user1.address
            );
            
            console.log("📋 New mint transaction:", newMintTx.hash);
            await newMintTx.wait();
            console.log("✅ New mint successful!");
            
            // Check the new token
            const newTokenId = tokenCount + 1;
            try {
                const newTokenOwner = await BookNFT.ownerOf(newTokenId);
                const newTokenURI = await BookNFT.tokenURI(newTokenId);
                const newBookId = await BookNFT.getBookId(newTokenId);
                
                console.log(`📋 New token ${newTokenId}:`);
                console.log(`     Owner: ${newTokenOwner}`);
                console.log(`     Book ID: ${newBookId}`);
                console.log(`     URI: ${newTokenURI}`);
                
            } catch (error) {
                console.log("❌ Error checking new token:", error.message);
            }
            
        } catch (error) {
            console.log("❌ New mint failed:", error.message);
        }
        
        // Final count
        let finalCount = 0;
        for (let i = 1; i <= maxCheck; i++) {
            try {
                await BookNFT.ownerOf(i);
                finalCount++;
            } catch {
                break;
            }
        }
        
        console.log(`\n📊 Final token count: ${finalCount}`);
        console.log("🎉 Test completed successfully (without totalSupply)!");
        
    } catch (error) {
        console.error("❌ Test failed:", error);
    }
}

workaroundTest().catch(console.error);