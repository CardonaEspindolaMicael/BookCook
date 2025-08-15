import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const crearNFTOwnership = async (datos) => {
  try {
    const nftOwnership = await prisma.nFTOwnership.create({
      data: {
        tokenId: datos.tokenId,
        bookId: datos.bookId,
        ownerId: datos.ownerId,
        contractAddress: datos.contractAddress,
        network: datos.network,
        currentOwner: datos.currentOwner,
        mintedAt: datos.mintedAt
      }
    });
    return nftOwnership;
  } catch (error) {
    console.error('Error creating NFT ownership:', error);
    throw error;
  }
};

export const obtenerNFTOwnershipPorTokenId = async (tokenId) => {
  try {
    const nftOwnership = await prisma.nFTOwnership.findUnique({
      where: { tokenId },
      include: {
        book: {
          include: {
            author: true
          }
        },
        owner: true
      }
    });
    return nftOwnership;
  } catch (error) {
    console.error('Error getting NFT ownership:', error);
    throw error;
  }
};

export const obtenerNFTOwnershipsPorLibro = async (bookId) => {
  try {
    const nftOwnerships = await prisma.nFTOwnership.findMany({
      where: { bookId },
      include: {
        owner: true
      },
      orderBy: {
        mintedAt: 'desc'
      }
    });
    return nftOwnerships;
  } catch (error) {
    console.error('Error getting book NFT ownerships:', error);
    throw error;
  }
};

export const obtenerNFTOwnershipsPorUsuario = async (userId) => {
  try {
    const nftOwnerships = await prisma.nFTOwnership.findMany({
      where: { ownerId: userId },
      include: {
        book: {
          include: {
            author: true
          }
        }
      },
      orderBy: {
        mintedAt: 'desc'
      }
    });
    return nftOwnerships;
  } catch (error) {
    console.error('Error getting user NFT ownerships:', error);
    throw error;
  }
};

export const actualizarNFTOwnership = async (tokenId, datos) => {
  try {
    const nftOwnership = await prisma.nFTOwnership.update({
      where: { tokenId },
      data: {
        currentOwner: datos.currentOwner,
        previousOwner: datos.previousOwner,
        transferredAt: datos.transferredAt,
        lastUpdated: new Date()
      }
    });
    return nftOwnership;
  } catch (error) {
    console.error('Error updating NFT ownership:', error);
    throw error;
  }
};

export const actualizarLibroSupply = async (bookId, newSupply) => {
  try {
    const book = await prisma.book.update({
      where: { id: bookId },
      data: {
        currentSupply: newSupply
      }
    });
    return book;
  } catch (error) {
    console.error('Error updating book supply:', error);
    throw error;
  }
};

export const obtenerEstadisticasNFT = async (bookId) => {
  try {
    const stats = await prisma.nFTOwnership.groupBy({
      by: ['bookId'],
      where: { bookId },
      _count: {
        tokenId: true
      }
    });

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: {
        currentSupply: true,
        maxSupply: true,
        nftPrice: true
      }
    });

    return {
      totalMinted: stats[0]?._count.tokenId || 0,
      currentSupply: book?.currentSupply || 0,
      maxSupply: book?.maxSupply,
      nftPrice: book?.nftPrice,
      remainingSupply: book?.maxSupply ? book.maxSupply - (book.currentSupply || 0) : null
    };
  } catch (error) {
    console.error('Error getting NFT statistics:', error);
    throw error;
  }
};

export const verificarNFTOwnership = async (userId, bookId) => {
  try {
    const ownership = await prisma.nFTOwnership.findFirst({
      where: {
        ownerId: userId,
        bookId: bookId
      }
    });
    return !!ownership;
  } catch (error) {
    console.error('Error checking NFT ownership:', error);
    throw error;
  }
};

export const obtenerTransaccionesNFT = async (userId, limit = 10) => {
  try {
    const transactions = await prisma.blockchainTransaction.findMany({
      where: {
        userId: userId,
        type: {
          in: ['mint_nft', 'transfer_nft']
        }
      },
      include: {
        book: {
          select: {
            title: true,
            cover: true
          }
        }
      },
      orderBy: {
        timestamp: 'desc'
      },
      take: limit
    });
    return transactions;
  } catch (error) {
    console.error('Error getting NFT transactions:', error);
    throw error;
  }
};
