import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerAccesosLibro = async () => {
  try {
    const accesos = await prisma.bookAccess.findMany({
      include: {
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    });
    return accesos;
  } catch (error) {
    throw new Error(`Error al obtener accesos: ${error.message}`);
  }
};

export const obtenerAccesoPorId = async (id) => {
  try {
    const acceso = await prisma.bookAccess.findUnique({
      where: { id },
      include: {
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    return acceso;
  } catch (error) {
    throw new Error(`Error al obtener acceso por ID: ${error.message}`);
  }
};

export const crearAccesoLibro = async (datos) => {
  try {
    const nuevoAcceso = await prisma.bookAccess.create({
      data: {
        bookId: datos.bookId,
        userId: datos.userId || null,
        walletAddress: datos.walletAddress || null,
        accessType: datos.accessType,
        expiresAt: datos.expiresAt ? new Date(datos.expiresAt) : null
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return nuevoAcceso;
  } catch (error) {
    throw new Error(`Error al crear acceso: ${error.message}`);
  }
};

export const actualizarAccesoLibro = async (datos) => {
  try {
    const accesoActualizado = await prisma.bookAccess.update({
      where: { id: datos.id },
      data: {
        accessType: datos.accessType,
        expiresAt: datos.expiresAt ? new Date(datos.expiresAt) : null
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    return accesoActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar acceso: ${error.message}`);
  }
};

export const eliminarAccesoLibro = async (id) => {
  try {
    await prisma.bookAccess.delete({
      where: { id }
    });
    return { message: "Acceso eliminado exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar acceso: ${error.message}`);
  }
};

export const obtenerAccesosPorUsuario = async (userId) => {
  try {
    const accesos = await prisma.bookAccess.findMany({
      where: { userId },
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
        grantedAt: 'desc'
      }
    });
    return accesos;
  } catch (error) {
    throw new Error(`Error al obtener accesos por usuario: ${error.message}`);
  }
};

export const obtenerAccesosPorLibro = async (bookId) => {
  try {
    const accesos = await prisma.bookAccess.findMany({
      where: { bookId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    });
    return accesos;
  } catch (error) {
    throw new Error(`Error al obtener accesos por libro: ${error.message}`);
  }
};

export const verificarAccesoUsuario = async (userId, bookId) => {
  try {
    const acceso = await prisma.bookAccess.findFirst({
      where: {
        userId,
        bookId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      }
    });
    return !!acceso;
  } catch (error) {
    throw new Error(`Error al verificar acceso: ${error.message}`);
  }
};

export const obtenerAccesosPorTipo = async (accessType) => {
  try {
    const accesos = await prisma.bookAccess.findMany({
      where: { accessType },
      include: {
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
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        grantedAt: 'desc'
      }
    });
    return accesos;
  } catch (error) {
    throw new Error(`Error al obtener accesos por tipo: ${error.message}`);
  }
}; 