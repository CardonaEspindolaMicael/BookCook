import express from "express";
import {
  mintBookNFT,
  getNFTOwnership,
  getBookNFTs,
  transferNFT,
  getTransactionStatus,
  getWalletBalance,
  connectWallet
} from "./nft.controllers.js";
import { auth } from "../../middlewares/auth.js";

const router = express.Router();

// NFT Minting
router.post("/mint", auth, mintBookNFT);

// NFT Information
router.get("/ownership/:tokenId", getNFTOwnership);
router.get("/book/:bookId", getBookNFTs);

// NFT Transfer
router.post("/transfer", auth, transferNFT);

// Transaction Status
router.get("/transaction/:txHash", getTransactionStatus);

// Wallet Operations
router.get("/balance/:address", getWalletBalance);
router.post("/connect", connectWallet);

export default router;
