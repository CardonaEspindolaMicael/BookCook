import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerVersionesLibro = async () => {
  try {
    const versiones = await prisma.bookVersion.findMany({
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return versiones;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const crearVersionLibro = async (datos) => {
  try {
    const { 
      bookId,
      versionHash,
      changes
    } = datos;
    
    const nuevaVersion = await prisma.bookVersion.create({
      data: {
        bookId,
        versionHash,
        changes
      },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
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
    return nuevaVersion;
  } catch (error) {
    console.error('Error al crear versión del libro:', error);
    throw error;
  }
};

export const actualizarVersionLibro = async (version) => {
  const {
    id,
    versionHash,
    changes
  } = version;

  try {
    const updateData = {};
    if (versionHash) updateData.versionHash = versionHash;
    if (changes) updateData.changes = changes;

    const versionActualizada = await prisma.bookVersion.update({
      where: { id },
      data: updateData,
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
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
    return versionActualizada;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const validarVersionExiste = async (id) => {
  const version = await prisma.bookVersion.findUnique({ where: { id } });
  return !!version;
};

export const eliminarVersionLibro = async (id) => {
  try {
    const existeVersion = await validarVersionExiste(id);
    if (!existeVersion) {
      return {
        message: `Error: la versión con id ${id} no existe`
      };
    }

    await prisma.bookVersion.delete({ where: { id } });

    return {
      message: `Versión eliminada`
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerVersionPorId = async (id) => {
  try {
    const version = await prisma.bookVersion.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            description: true,
            cover: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        }
      }
    });
    return version;
  } catch (error) {
    console.error(error);
    return error;
  } 
};

export const obtenerVersionesPorLibro = async (bookId) => {
  try {
    const versiones = await prisma.bookVersion.findMany({
      where: { bookId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return versiones;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerVersionPorHash = async (versionHash) => {
  try {
    const version = await prisma.bookVersion.findUnique({
      where: { versionHash },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
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
    return version;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerUltimaVersionLibro = async (bookId) => {
  try {
    const ultimaVersion = await prisma.bookVersion.findFirst({
      where: { bookId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return ultimaVersion;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerHistorialVersiones = async (bookId, limit = 10) => {
  try {
    const historial = await prisma.bookVersion.findMany({
      where: { bookId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });
    return historial;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const compararVersiones = async (versionId1, versionId2) => {
  try {
    const [version1, version2] = await Promise.all([
      prisma.bookVersion.findUnique({
        where: { id: versionId1 },
        include: {
          book: {
            select: {
              id: true,
              title: true
            }
          }
        }
      }),
      prisma.bookVersion.findUnique({
        where: { id: versionId2 },
        include: {
          book: {
            select: {
              id: true,
              title: true
            }
          }
        }
      })
    ]);

    if (!version1 || !version2) {
      return {
        error: "Una o ambas versiones no existen"
      };
    }

    return {
      version1,
      version2,
      comparacion: {
        cambios: version1.changes,
        diferencias: version2.changes
      }
    };
  } catch (error) {
    console.error(error);
    return error;
  }
}; 