import pkg from '@prisma/client';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const crearTransaccionBlockchain = async (datos) => {
  try {
    const transaction = await prisma.blockchainTransaction.create({
      data: {
        transactionHash: datos.transactionHash,
        userId: datos.userId,
        bookId: datos.bookId,
        type: datos.type,
        network: datos.network,
        fromAddress: datos.fromAddress,
        toAddress: datos.toAddress,
        amount: datos.amount,
        gasUsed: datos.gasUsed,
        status: datos.status,
        blockNumber: datos.blockNumber,
        timestamp: datos.timestamp || new Date(),
        confirmedAt: datos.confirmedAt
      }
    });
    return transaction;
  } catch (error) {
    console.error('Error creating blockchain transaction:', error);
    throw error;
  }
};

export const obtenerTransaccionPorHash = async (transactionHash) => {
  try {
    const transaction = await prisma.blockchainTransaction.findUnique({
      where: { transactionHash },
      include: {
        book: {
          include: {
            author: true
          }
        }
      }
    });
    return transaction;
  } catch (error) {
    console.error('Error getting blockchain transaction:', error);
    throw error;
  }
};

export const actualizarEstadoTransaccion = async (transactionHash, status, blockNumber = null, confirmedAt = null) => {
  try {
    const transaction = await prisma.blockchainTransaction.update({
      where: { transactionHash },
      data: {
        status: status,
        blockNumber: blockNumber,
        confirmedAt: confirmedAt || (status === 'confirmed' ? new Date() : null)
      }
    });
    return transaction;
  } catch (error) {
    console.error('Error updating transaction status:', error);
    throw error;
  }
};

export const obtenerTransaccionesPorUsuario = async (userId, limit = 20) => {
  try {
    const transactions = await prisma.blockchainTransaction.findMany({
      where: { userId },
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
    console.error('Error getting user transactions:', error);
    throw error;
  }
};

export const obtenerTransaccionesPorLibro = async (bookId, limit = 20) => {
  try {
    const transactions = await prisma.blockchainTransaction.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            name: true,
            email: true
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
    console.error('Error getting book transactions:', error);
    throw error;
  }
};

export const obtenerEstadisticasTransacciones = async (userId) => {
  try {
    const stats = await prisma.blockchainTransaction.groupBy({
      by: ['type', 'status'],
      where: { userId },
      _count: {
        transactionHash: true
      },
      _sum: {
        amount: true,
        gasUsed: true
      }
    });

    const totalTransactions = await prisma.blockchainTransaction.count({
      where: { userId }
    });

    const successfulTransactions = await prisma.blockchainTransaction.count({
      where: {
        userId,
        status: 'confirmed'
      }
    });

    return {
      totalTransactions,
      successfulTransactions,
      failedTransactions: totalTransactions - successfulTransactions,
      successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0,
      byType: stats.reduce((acc, stat) => {
        if (!acc[stat.type]) {
          acc[stat.type] = {
            total: 0,
            confirmed: 0,
            pending: 0,
            failed: 0,
            totalAmount: 0,
            totalGasUsed: 0
          };
        }
        acc[stat.type].total += stat._count.transactionHash;
        acc[stat.type][stat.status] = stat._count.transactionHash;
        acc[stat.type].totalAmount += stat._sum.amount || 0;
        acc[stat.type].totalGasUsed += stat._sum.gasUsed || 0;
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting transaction statistics:', error);
    throw error;
  }
};
