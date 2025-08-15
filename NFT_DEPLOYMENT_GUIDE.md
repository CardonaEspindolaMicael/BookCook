# NFT Deployment Guide - Mantle Network

This guide will help you deploy and configure the NFT minting system for your book platform on Mantle Network.

## 🚀 Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** or compatible wallet
3. **Mantle Testnet MNT** (for testing)
4. **Pinata Account** (for IPFS metadata storage)

## 📋 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/eventcook"

# NFT Configuration
NFT_CONTRACT_ADDRESS="0x..." # Deployed contract address
NFT_NETWORK="mantle" # mantle or mantleMainnet
FRONTEND_URL="http://localhost:3000"

# IPFS (Pinata)
PINATA_JWT_TOKEN="your_pinata_jwt_token"

# JWT Secret
JWT_SECRET="your_jwt_secret"
```

### Frontend (.env)
```env
REACT_APP_API_URL="http://localhost:3001/api-v1"
REACT_APP_NFT_NETWORK="mantle"
REACT_APP_NFT_CONTRACT_ADDRESS="0x..." # Deployed contract address
```

## 🔧 Smart Contract Deployment

### 1. Install Dependencies
```bash
cd BackFigma
npm install hardhat @openzeppelin/contracts ethers
```

### 2. Create Hardhat Configuration
Create `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    mantleTestnet: {
      url: "https://rpc.testnet.mantle.xyz",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5001
    },
    mantleMainnet: {
      url: "https://rpc.mantle.xyz",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 5000
    }
  }
};
```

### 3. Deploy Contract
```bash
# Deploy to testnet
npx hardhat run scripts/deploy.js --network mantleTestnet

# Deploy to mainnet
npx hardhat run scripts/deploy.js --network mantleMainnet
```

### 4. Verify Contract
```bash
npx hardhat verify --network mantleTestnet CONTRACT_ADDRESS
```

## 🗄️ Database Setup

### 1. Run Prisma Migrations
```bash
cd BackFigma
npx prisma migrate dev --name add_nft_tables
npx prisma generate
```

### 2. Seed Initial Data
```bash
npx prisma db seed
```

## 🔌 Backend Setup

### 1. Install Dependencies
```bash
cd BackFigma
npm install ethers @prisma/client
```

### 2. Add NFT Routes
Update `src/routes/routes.js`:
```javascript
import nftRoutes from '../components/nft/nft.routes.js';

// Add this line
app.use('/api-v1/nft', nftRoutes);
```

### 3. Generate Contract ABI
After deploying the contract, copy the ABI to `src/contracts/BookNFT.json`.

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
cd BookFront
npm install ethers
```

### 2. Update Payment Modal
The PaymentModal component has been updated to handle real NFT minting.

## 🧪 Testing the System

### 1. Test Wallet Connection
1. Open your app
2. Navigate to a book with NFT enabled
3. Click "Mint NFT"
4. Connect your MetaMask wallet
5. Verify it switches to Mantle Network

### 2. Test NFT Minting
1. Ensure you have enough MNT in your wallet
2. Click "Mint NFT" button
3. Confirm the transaction in MetaMask
4. Wait for confirmation
5. Verify NFT appears in your wallet

### 3. Test NFT Transfer
1. Go to your NFT collection
2. Select an NFT
3. Click "Transfer"
4. Enter recipient address
5. Confirm transaction

## 🔍 Monitoring & Analytics

### 1. Transaction Tracking
- All transactions are stored in the `blockchain_transactions` table
- Monitor transaction status and gas usage
- Track NFT ownership changes

### 2. NFT Statistics
- View minting statistics per book
- Track supply and demand
- Monitor user engagement

### 3. Error Handling
- Failed transactions are logged
- Retry mechanisms for pending transactions
- User-friendly error messages

## 🛡️ Security Considerations

### 1. Smart Contract Security
- Use OpenZeppelin contracts (already implemented)
- Implement access controls
- Add reentrancy protection
- Test thoroughly before mainnet

### 2. Backend Security
- Validate all inputs
- Implement rate limiting
- Use environment variables for secrets
- Regular security audits

### 3. Frontend Security
- Never expose private keys
- Validate wallet connections
- Implement proper error handling
- Use HTTPS in production

## 🚀 Production Deployment

### 1. Backend Deployment
```bash
# Set production environment variables
export NODE_ENV=production
export NFT_NETWORK=mantleMainnet

# Deploy to your server
npm run build
npm start
```

### 2. Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to your hosting service
# (Vercel, Netlify, etc.)
```

### 3. Database Migration
```bash
# Run production migrations
npx prisma migrate deploy
```

## 📊 Analytics & Monitoring

### 1. Transaction Monitoring
- Monitor gas prices on Mantle
- Track transaction success rates
- Alert on failed transactions

### 2. User Analytics
- Track NFT minting patterns
- Monitor user engagement
- Analyze revenue metrics

### 3. Performance Monitoring
- Monitor API response times
- Track database performance
- Monitor smart contract gas usage

## 🔧 Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure MetaMask is installed
   - Check if user approved connection
   - Verify network configuration

2. **Transaction Fails**
   - Check user has enough MNT
   - Verify gas settings
   - Check network congestion

3. **NFT Not Appearing**
   - Wait for transaction confirmation
   - Check contract address
   - Verify token ID

4. **API Errors**
   - Check environment variables
   - Verify database connection
   - Check authentication tokens

### Debug Commands
```bash
# Check contract deployment
npx hardhat verify --network mantleTestnet CONTRACT_ADDRESS

# Check database connection
npx prisma db push

# Check API health
curl http://localhost:3001/api-v1/health

# Check wallet balance
npx hardhat run scripts/checkBalance.js --network mantleTestnet
```

## 📚 Additional Resources

- [Mantle Network Documentation](https://docs.mantle.xyz/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs
3. Verify configuration
4. Test on testnet first
5. Contact support if needed

---

**Happy NFT Minting! 🎉**
