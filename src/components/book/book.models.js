import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerLibros = async () => {
  try {
    const libros = await prisma.book.findMany({
      select: {
        // All scalar fields of Book
        id: true,
        title: true,
        description: true,
        cover: true,
        authorId: true,
        isFree: true,
        isComplete: true,
        totalChapters: true,
        isNFT: true,
        nftPrice: true,
        maxSupply: true,
        currentSupply: true,
        viewCount: true,
        averageRating: true,
        totalReviews: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        // Relationships
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isPremium: true
          }
        },
        chapters: {
             select:{
              orderIndex:true,
              updatedAt:true
             }
        },
        genres: {
          include: { genre: true }
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        nftOwnerships: {
          include: {
            owner: { select: { id: true, name: true, email: true } }
          }
        },
        purchases: {
          include: {
            buyer: { select: { id: true, name: true, email: true } }
          }
        },
        bookAccesses: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        readingHistory: true,
      }
    });
    return libros;
  } catch (error) {
    console.error(error);
    return error;
  }
};


export const crearLibro = async (datos) => {
  try {
    const { 
      title,
      description,
      cover, 
      authorId,
      isFree = true,
      isComplete = false,
      totalChapters = 0,
      isNFT = false,
      nftPrice,
      maxSupply,
      status = "draft"
    } = datos;
    
    const nuevoLibro = await prisma.book.create({
      data: {
        title,
        description,
        cover,
        authorId,
        isFree,
        isComplete,
        totalChapters,
        isNFT,
        nftPrice,
        maxSupply,
        status
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return nuevoLibro;
  } catch (error) {
    console.error('Error al crear libro:', error);
    throw error;
  }
};

export const actualizarLibro = async (libro) => {
  const {
    id,
    title,
    description,
    cover,
    isFree,
    isComplete,
    totalChapters,
    isNFT,
    nftPrice,
    maxSupply,
    status
  } = libro;

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (cover !== undefined) updateData.cover = cover;
    if (isFree !== undefined) updateData.isFree = isFree;
    if (isComplete !== undefined) updateData.isComplete = isComplete;
    if (totalChapters !== undefined) updateData.totalChapters = totalChapters;
    if (isNFT !== undefined) updateData.isNFT = isNFT;
    if (nftPrice !== undefined) updateData.nftPrice = nftPrice;
    if (maxSupply !== undefined) updateData.maxSupply = maxSupply;
    if (status) updateData.status = status;

    const libroActualizado = await prisma.book.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        chapters: {
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    });
    return libroActualizado;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const validarLibroExiste = async (id) => {
  const libro = await prisma.book.findUnique({ where: { id } });
  return !!libro;
};

export const eliminarLibro = async (id) => {
  try {
    const existeLibro = await validarLibroExiste(id);
    if (!existeLibro) {
      return {
        message: `Error: el libro con id ${id} no existe`
      };
    }

    await prisma.book.delete({ where: { id } });

    return {
      message: `Libro eliminado`
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerLibroPorId = async (id) => {
  try {
    const libro = await prisma.book.findUnique({
      where: { id },
      select: {
        // All scalar fields
        id: true,
        title: true,
        description: true,
        cover: true,
        authorId: true,
        isFree: true,
        isComplete: true,
        totalChapters: true,
        isNFT: true,
        nftPrice: true,
        maxSupply: true,
        currentSupply: true,
        viewCount: true,
        averageRating: true,
        totalReviews: true,
        status: true,
        createdAt: true,
        updatedAt: true,

        // Relationships
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isPremium: true
          }
        },
        genres: {
          include: { genre: true }
        },
        reviews: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        nftOwnerships: {
          include: {
            owner: { select: { id: true, name: true, email: true } }
          }
        },
        purchases: {
          include: {
            buyer: { select: { id: true, name: true, email: true } }
          }
        },
        bookAccesses: {
          include: {
            user: { select: { id: true, name: true, email: true } }
          }
        },
        readingHistory: true,
        bookmarks: true
      }
    });
    return libro;
  } catch (error) {
    console.error(error);
    return error;
  }
};


export const obtenerLibrosPorAutor = async (authorId) => {
  try {
    const libros = await prisma.book.findMany({
      where: { authorId },
      include: {
        chapters: {
          orderBy: {
            orderIndex: 'asc'
          }
        },
        genres: {
          include: {
            genre: true
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        nftOwnerships: true,
        purchases: true,
        bookAccesses: true
      }
    });
    return libros;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const buscarLibros = async (searchTerm) => {
  try {
    const libros = await prisma.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        chapters: {
          orderBy: {
            orderIndex: 'asc'
          }
        },
        genres: {
          include: {
            genre: true
          }
        }
      }
    });
    return libros;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerLibrosPorEstado = async (status) => {
  try {
    const libros = await prisma.book.findMany({
      where: { status },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        chapters: {
          orderBy: {
            orderIndex: 'asc'
          }
        },
        genres: {
          include: {
            genre: true
          }
        }
      }
    });
    return libros;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerLibrosNFT = async () => {
  try {
    const libros = await prisma.book.findMany({
      where: { isNFT: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        nftOwnerships: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    return libros;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerLibrosGratuitos = async () => {
  try {
    const libros = await prisma.book.findMany({
      where: { isFree: true },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        chapters: {
          orderBy: {
            orderIndex: 'asc'
          }
        }
      }
    });
    return libros;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerEstadisticasLibro = async (bookId) => {
  try {
    const [purchases, reviews, nftOwnerships, bookAccesses] = await Promise.all([
      prisma.purchase.count({ where: { bookId } }),
      prisma.review.count({ where: { bookId } }),
      prisma.nFTOwnership.count({ where: { bookId } }),
      prisma.bookAccess.count({ where: { bookId } })
    ]);

    const totalRevenue = await prisma.purchase.aggregate({
      where: { bookId, status: 'completed' },
      _sum: { amount: true }
    });

    const averageRating = await prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true }
    });

    return {
      purchases,
      reviews,
      nftOwnerships,
      bookAccesses,
      totalRevenue: totalRevenue._sum.amount || 0,
      averageRating: averageRating._avg.rating || 0
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const incrementarVistas = async (bookId) => {
  try {
    const libro = await prisma.book.update({
      where: { id: bookId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
    return libro;
  } catch (error) {
    console.error(error);
    return error;
  }
}; 