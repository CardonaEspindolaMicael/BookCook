import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerLibros = async () => {
  try {
    const libros = await prisma.book.findMany({
      include: {
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
          orderBy: {
            orderIndex: 'asc'
          }
        },
        purchases: true,
        fundings: true,
        campaigns: true,
        fanRequests: true,
        contentUpdates: true
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
      price,
      status = "draft",
      authorId
    } = datos;
    
    const nuevoLibro = await prisma.book.create({
      data: {
        title,
        description,
        cover,
        price,
        status,
        authorId
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
    price,
    status
  } = libro;

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (cover !== undefined) updateData.cover = cover;
    if (price !== undefined) updateData.price = price;
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
      include: {
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
          orderBy: {
            orderIndex: 'asc'
          }
        },
        purchases: true,
        fundings: true,
        campaigns: true,
        fanRequests: true,
        contentUpdates: true,
        bookVersions: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        aiInteractions: {
          include: {
            interactionType: true,
            aiAssistant: true
          }
        }
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
        purchases: true,
        fundings: true,
        campaigns: true,
        fanRequests: true,
        contentUpdates: true
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
    const [purchases, fundings, campaigns, fanRequests] = await Promise.all([
      prisma.purchase.count({ where: { bookId } }),
      prisma.funding.count({ where: { bookId } }),
      prisma.campaign.count({ where: { bookId } }),
      prisma.fanRequest.count({ where: { bookId } })
    ]);

    const totalRevenue = await prisma.purchase.aggregate({
      where: { bookId, status: 'completed' },
      _sum: { amount: true }
    });

    return {
      purchases,
      fundings,
      campaigns,
      fanRequests,
      totalRevenue: totalRevenue._sum.amount || 0
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}; 