import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerBookmarks = async () => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      include: {
        user: {
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
        createdAt: 'desc'
      }
    });
    return bookmarks;
  } catch (error) {
    throw new Error(`Error al obtener bookmarks: ${error.message}`);
  }
};

export const obtenerBookmarkPorId = async (id) => {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: { id },
      include: {
        user: {
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
            cover: true,
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
    return bookmark;
  } catch (error) {
    throw new Error(`Error al obtener bookmark por ID: ${error.message}`);
  }
};

export const crearBookmark = async (datos) => {
  try {
    const nuevoBookmark = await prisma.bookmark.create({
      data: {
        userId: datos.userId,
        bookId: datos.bookId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        book: {
          select: {
            id: true,
            title: true,
            cover: true
          }
        }
      }
    });
    return nuevoBookmark;
  } catch (error) {
    throw new Error(`Error al crear bookmark: ${error.message}`);
  }
};

export const eliminarBookmark = async (id) => {
  try {
    await prisma.bookmark.delete({
      where: { id }
    });
    return { message: "Bookmark eliminado exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar bookmark: ${error.message}`);
  }
};

export const obtenerBookmarksPorUsuario = async (userId) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            cover: true,
            description: true,
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
        createdAt: 'desc'
      }
    });
    return bookmarks;
  } catch (error) {
    throw new Error(`Error al obtener bookmarks por usuario: ${error.message}`);
  }
};

export const obtenerBookmarksPorLibro = async (bookId) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
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
        createdAt: 'desc'
      }
    });
    return bookmarks;
  } catch (error) {
    throw new Error(`Error al obtener bookmarks por libro: ${error.message}`);
  }
};

export const verificarBookmarkUsuario = async (userId, bookId) => {
  try {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId
        }
      }
    });
    return !!bookmark;
  } catch (error) {
    throw new Error(`Error al verificar bookmark: ${error.message}`);
  }
};

export const obtenerBookmarksRecientes = async (limit = 10) => {
  try {
    const bookmarks = await prisma.bookmark.findMany({
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
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
        createdAt: 'desc'
      }
    });
    return bookmarks;
  } catch (error) {
    throw new Error(`Error al obtener bookmarks recientes: ${error.message}`);
  }
}; 