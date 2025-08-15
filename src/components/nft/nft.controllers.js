import nftService from '../../services/nftService.js';
import { obtenerLibroPorId } from '../book/book.models.js';
import { crearNFTOwnership, actualizarLibroSupply } from './nft.models.js';
import { crearTransaccionBlockchain } from '../blockchain/blockchain.models.js';

export const mintBookNFT = async (req, res) => {
  try {
    const { bookId, userAddress } = req.body;
    const userId = req.user?.id;

    if (!bookId || !userAddress) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and user address are required'
      });
    }

    // Get book details
    const book = await obtenerLibroPorId(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if book is available as NFT
    if (!book.isNFT) {
      return res.status(400).json({
        success: false,
        message: 'This book is not available as an NFT'
      });
    }

    // Check if max supply reached
    if (book.maxSupply && book.currentSupply >= book.maxSupply) {
      return res.status(400).json({
        success: false,
        message: 'Maximum supply reached for this NFT'
      });
    }

    // Mint NFT using the service
    const mintResult = await nftService.mintNFT(book, userAddress);

    // Create NFT ownership record in database
    const nftOwnership = await crearNFTOwnership({
      tokenId: mintResult.tokenId,
      bookId: bookId,
      ownerId: userId,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      network: process.env.NFT_NETWORK || 'mantle',
      currentOwner: userAddress,
      mintedAt: new Date()
    });

    // Update book supply
    await actualizarLibroSupply(bookId, book.currentSupply + 1);

    // Create blockchain transaction record
    await crearTransaccionBlockchain({
      transactionHash: mintResult.transactionHash,
      userId: userId,
      bookId: bookId,
      type: 'mint_nft',
      network: process.env.NFT_NETWORK || 'mantle',
      fromAddress: userAddress,
      toAddress: userAddress,
      amount: book.nftPrice,
      gasUsed: parseFloat(mintResult.gasUsed),
      status: 'confirmed',
      blockNumber: mintResult.blockNumber,
      confirmedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'NFT minted successfully',
      data: {
        tokenId: mintResult.tokenId,
        transactionHash: mintResult.transactionHash,
        tokenURI: mintResult.tokenURI,
        nftOwnership: nftOwnership
      }
    });

  } catch (error) {
    console.error('Error minting NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mint NFT',
      error: error.message
    });
  }
};

export const getNFTOwnership = async (req, res) => {
  try {
    const { tokenId } = req.params;

    const ownership = await nftService.getNFTOwnership(tokenId);
    
    res.status(200).json({
      success: true,
      data: ownership
    });

  } catch (error) {
    console.error('Error getting NFT ownership:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get NFT ownership',
      error: error.message
    });
  }
};

export const getBookNFTs = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Convert book ID to uint256 format
    const { ethers } = await import('ethers');
    const bookIdHash = ethers.keccak256(ethers.toUtf8Bytes(bookId));

    const nfts = await nftService.getBookNFTs(bookIdHash);
    
    res.status(200).json({
      success: true,
      data: nfts
    });

  } catch (error) {
    console.error('Error getting book NFTs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get book NFTs',
      error: error.message
    });
  }
};

export const transferNFT = async (req, res) => {
  try {
    const { tokenId, fromAddress, toAddress } = req.body;
    const userId = req.user?.id;

    if (!tokenId || !fromAddress || !toAddress) {
      return res.status(400).json({
        success: false,
        message: 'Token ID, from address, and to address are required'
      });
    }

    const transferResult = await nftService.transferNFT(tokenId, fromAddress, toAddress);

    // Create blockchain transaction record
    await crearTransaccionBlockchain({
      transactionHash: transferResult.transactionHash,
      userId: userId,
      type: 'transfer_nft',
      network: process.env.NFT_NETWORK || 'mantle',
      fromAddress: fromAddress,
      toAddress: toAddress,
      status: 'confirmed',
      blockNumber: transferResult.blockNumber,
      confirmedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'NFT transferred successfully',
      data: transferResult
    });

  } catch (error) {
    console.error('Error transferring NFT:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer NFT',
      error: error.message
    });
  }
};

export const getTransactionStatus = async (req, res) => {
  try {
    const { txHash } = req.params;

    const status = await nftService.getTransactionStatus(txHash);
    
    res.status(200).json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Error getting transaction status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get transaction status',
      error: error.message
    });
  }
};

export const getWalletBalance = async (req, res) => {
  try {
    const { address } = req.params;

    const balance = await nftService.getBalance(address);
    
    res.status(200).json({
      success: true,
      data: {
        address: address,
        balance: balance,
        currency: 'MNT'
      }
    });

  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get wallet balance',
      error: error.message
    });
  }
};

export const connectWallet = async (req, res) => {
  try {
    const { provider, signer } = await nftService.connectWallet();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();
    
    res.status(200).json({
      success: true,
      data: {
        address: address,
        network: network.name,
        chainId: network.chainId.toString()
      }
    });

  } catch (error) {
    console.error('Error connecting wallet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect wallet',
      error: error.message
    });
  }
};
