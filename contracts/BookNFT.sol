// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract BookNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    // Replace Counters with simple uint256
    uint256 private _nextTokenId = 1;
    
    // Book metadata structure
    struct BookMetadata {
        string title;
        string author;
        string description;
        string coverImage;
        uint256 totalChapters;
        bool isComplete;
        uint256 mintPrice;
        uint256 maxSupply;
        uint256 currentSupply;
    }
    
    // Mapping from book ID (string) to metadata
    mapping(string => BookMetadata) public bookMetadata;
    
    // Mapping from book ID to token IDs
    mapping(string => uint256[]) public bookTokenIds;
    
    // Mapping from token ID to book ID
    mapping(uint256 => string) public tokenToBook;
    
    // Mapping from book ID to author address
    mapping(string => address) public bookAuthors;
    
    // Platform fee (2.5%)
    uint256 public platformFee = 250; // 2.5% = 250 basis points
    uint256 public constant BASIS_POINTS = 10000;
    
    // Events
    event BookNFTMinted(
        uint256 indexed tokenId,
        string indexed bookId,
        address indexed owner,
        string tokenURI,
        uint256 price
    );
    
    event BookMetadataUpdated(
        string indexed bookId,
        string title,
        string author,
        uint256 maxSupply
    );
    
    event PlatformFeeUpdated(uint256 newFee);
    
    constructor() ERC721("BookNFT", "BOOK") Ownable(msg.sender) {}
    
    /**
     * @dev Mint a new book NFT
     * @param bookId The unique book identifier (string)
     * @param metadata The book metadata
     * @param tokenURI_ The token URI containing metadata
     * @param recipient The address to receive the NFT
     * @param authorAddress The author's wallet address for royalties
     */
    function mintBookNFT(
        string memory bookId,
        BookMetadata memory metadata,
        string memory tokenURI_,
        address recipient,
        address authorAddress
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= metadata.mintPrice, "Insufficient payment");
        require(metadata.currentSupply < metadata.maxSupply, "Max supply reached");
        require(recipient != address(0), "Invalid recipient");
        require(authorAddress != address(0), "Invalid author address");
        require(bytes(bookId).length > 0, "Book ID cannot be empty");
        
        // Check if this is the first mint of this book
        if (bookTokenIds[bookId].length == 0) {
            // Store book metadata and author
            bookMetadata[bookId] = metadata;
            bookAuthors[bookId] = authorAddress;
        } else {
            // Verify it's the same author minting additional copies
            require(bookAuthors[bookId] == authorAddress, "Only original author can mint");
            require(bookMetadata[bookId].currentSupply < bookMetadata[bookId].maxSupply, "Max supply reached");
        }
        
        // Calculate platform fee
        uint256 platformFeeAmount = (msg.value * platformFee) / BASIS_POINTS;
        uint256 authorAmount = msg.value - platformFeeAmount;
        
        // Transfer platform fee to contract owner
        if (platformFeeAmount > 0) {
            (bool feeSuccess, ) = owner().call{value: platformFeeAmount}("");
            require(feeSuccess, "Platform fee transfer failed");
        }
        
        // Transfer remaining amount to author
        if (authorAmount > 0) {
            (bool authorSuccess, ) = authorAddress.call{value: authorAmount}("");
            require(authorSuccess, "Author payment failed");
        }
        
        // Mint the NFT
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI_);
        
        // Update mappings
        bookTokenIds[bookId].push(newTokenId);
        tokenToBook[newTokenId] = bookId;
        
        // Update supply
        bookMetadata[bookId].currentSupply++;
        
        emit BookNFTMinted(newTokenId, bookId, recipient, tokenURI_, msg.value);
        
        return newTokenId;
    }
    
    /**
     * @dev Simple mint function for easier integration
     * @param bookId The unique book identifier
     * @param tokenURI_ The metadata URI (IPFS)
     * @param recipient The address to receive the NFT
     */
    function simpleMint(
        string memory bookId,
        string memory tokenURI_,
        address recipient
    ) external onlyOwner returns (uint256) {
        require(bytes(bookId).length > 0, "Book ID cannot be empty");
        require(bytes(tokenURI_).length > 0, "Token URI cannot be empty");
        require(recipient != address(0), "Invalid recipient");
        
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI_);
        
        // Store mappings
        bookTokenIds[bookId].push(newTokenId);
        tokenToBook[newTokenId] = bookId;
        
        emit BookNFTMinted(newTokenId, bookId, recipient, tokenURI_, 0);
        
        return newTokenId;
    }
    
    /**
     * @dev Update book metadata (only owner or author)
     */
    function updateBookMetadata(
        string memory bookId,
        BookMetadata memory metadata
    ) external {
        require(
            msg.sender == owner() || msg.sender == bookAuthors[bookId],
            "Only owner or author can update metadata"
        );
        
        bookMetadata[bookId] = metadata;
        emit BookMetadataUpdated(
            bookId,
            metadata.title,
            metadata.author,
            metadata.maxSupply
        );
    }
    
    /**
     * @dev Get all token IDs for a specific book
     */
    function getBookTokenIds(string memory bookId) external view returns (uint256[] memory) {
        return bookTokenIds[bookId];
    }
    
    /**
     * @dev Get book metadata.
     * Returns a tuple of the book's metadata fields to avoid ABI encoding issues with structs.
     */
    function getBookMetadata(string memory bookId) external view returns (
        string memory title,
        string memory author,
        string memory description,
        string memory coverImage,
        uint256 totalChapters,
        bool isComplete,
        uint256 mintPrice,
        uint256 maxSupply,
        uint256 currentSupply
    ) {
        BookMetadata storage book = bookMetadata[bookId];
        return (
            book.title,
            book.author,
            book.description,
            book.coverImage,
            book.totalChapters,
            book.isComplete,
            book.mintPrice,
            book.maxSupply,
            book.currentSupply
        );
    }
    /**
     * @dev Get book ID for a token
     */
    function getBookId(uint256 tokenId) external view returns (string memory) {
        return tokenToBook[tokenId];
    }
    
    /**
     * @dev Get book author address
     */
    function getBookAuthor(string memory bookId) external view returns (address) {
        return bookAuthors[bookId];
    }
    
    /**
     * @dev Check if book exists
     */
    function bookExists(string memory bookId) external view returns (bool) {
        return bookTokenIds[bookId].length > 0;
    }
    
    /**
     * @dev Get total supply of tokens
     */
    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Fee cannot exceed 10%");
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    /**
     * @dev Emergency withdrawal (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    // Override required functions for ERC721URIStorage
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}