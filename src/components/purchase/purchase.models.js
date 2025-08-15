import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerPurchases = async () => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });
    return purchases;
  } catch (error) {
    throw new Error(`Error al obtener compras: ${error.message}`);
  }
};

export const obtenerPurchasePorId = async (id) => {
  try {
    const purchase = await prisma.purchase.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
    return purchase;
  } catch (error) {
    throw new Error(`Error al obtener compra por ID: ${error.message}`);
  }
};

export const crearPurchase = async (datos) => {
  try {
    const nuevaPurchase = await prisma.purchase.create({
      data: {
        buyerId: datos.buyerId || null,
        bookId: datos.bookId,
        walletAddress: datos.walletAddress || null,
        amount: datos.amount,
        currency: datos.currency || 'ETH',
        status: datos.status || 'completed'
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true
          }
        },
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return nuevaPurchase;
  } catch (error) {
    throw new Error(`Error al crear compra: ${error.message}`);
  }
};

export const actualizarPurchase = async (datos) => {
  try {
    const purchaseActualizada = await prisma.purchase.update({
      where: { id: datos.id },
      data: {
        amount: datos.amount,
        currency: datos.currency,
        status: datos.status
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true
          }
        },
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return purchaseActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar compra: ${error.message}`);
  }
};

export const eliminarPurchase = async (id) => {
  try {
    await prisma.purchase.delete({
      where: { id }
    });
    return { message: "Compra eliminada exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar compra: ${error.message}`);
  }
};

export const obtenerPurchasesPorUsuario = async (userId) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { buyerId: userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            cover: true,
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });
    return purchases;
  } catch (error) {
    throw new Error(`Error al obtener compras por usuario: ${error.message}`);
  }
};

export const obtenerPurchasesPorLibro = async (bookId) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { bookId },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });
    return purchases;
  } catch (error) {
    throw new Error(`Error al obtener compras por libro: ${error.message}`);
  }
};

export const obtenerPurchasesPorEstado = async (status) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { status },
      include: {
        buyer: {
          select: {
            id: true,
            name: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });
    return purchases;
  } catch (error) {
    throw new Error(`Error al obtener compras por estado: ${error.message}`);
  }
};

export const obtenerPurchasesPorMoneda = async (currency) => {
  try {
    const purchases = await prisma.purchase.findMany({
      where: { currency },
      include: {
        buyer: {
          select: {
            id: true,
            name: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });
    return purchases;
  } catch (error) {
    throw new Error(`Error al obtener compras por moneda: ${error.message}`);
  }
};

export const obtenerEstadisticasVentas = async () => {
  try {
    const totalVentas = await prisma.purchase.aggregate({
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    const ventasPorMoneda = await prisma.purchase.groupBy({
      by: ['currency'],
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    const ventasPorEstado = await prisma.purchase.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    return {
      totalVentas: totalVentas._sum.amount || 0,
      totalCompras: totalVentas._count.id,
      ventasPorMoneda,
      ventasPorEstado
    };
  } catch (error) {
    throw new Error(`Error al obtener estadísticas de ventas: ${error.message}`);
  }
}; 