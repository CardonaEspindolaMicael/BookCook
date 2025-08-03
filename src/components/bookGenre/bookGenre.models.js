import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerBookGenres = async () => {
  try {

      const bookGenres = await prisma.bookGenre.findMany({
        include: {
          book: {
            include: {
              author: true // 👈 Cambiado de select a include
            }
          },
          genre: true // 👈 Simplificado - include completo
        },
        orderBy: {
          id: 'desc'
        }
      });
      return bookGenres;
    } catch (error) {
      throw new Error(`Error al obtener book genres: ${error.message}`);
    }
};

export const obtenerBookGenrePorId = async (id) => {
  try {
    const bookGenre = await prisma.bookGenre.findUnique({
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
        genre: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });
    return bookGenre;
  } catch (error) {
    throw new Error(`Error al obtener book genre por ID: ${error.message}`);
  }
};

export const obtenerGenresPorLibro = async (bookId) => {
  try {
    const bookGenres = await prisma.bookGenre.findMany({
      where: { bookId },
      include: {
        genre: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });
    return bookGenres;
  } catch (error) {
    throw new Error(`Error al obtener géneros por libro: ${error.message}`);
  }
};

export const obtenerLibrosPorGenero = async (genreId) => {
  try {
    const bookGenres = await prisma.bookGenre.findMany({
      where: { genreId },
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
        id: 'desc'
      }
    });
    return bookGenres;
  } catch (error) {
    throw new Error(`Error al obtener libros por género: ${error.message}`);
  }
};

export const crearBookGenre = async (datos) => {
  try {
    const nuevoBookGenre = await prisma.bookGenre.create({
      data: {
        bookId: datos.bookId,
        genreId: datos.genreId
      },
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
        genre: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });
    return nuevoBookGenre;
  } catch (error) {
    throw new Error(`Error al crear book genre: ${error.message}`);
  }
};

export const crearBookGenres = async (bookId, genreIds) => {
  try {
    const bookGenres = [];
    
    for (const genreId of genreIds) {
      const bookGenre = await prisma.bookGenre.create({
        data: {
          bookId,
          genreId
        },
        include: {
          genre: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });
      bookGenres.push(bookGenre);
    }
    
    return bookGenres;
  } catch (error) {
    throw new Error(`Error al crear book genres: ${error.message}`);
  }
};

export const actualizarBookGenre = async (datos) => {
  try {
    const bookGenreActualizado = await prisma.bookGenre.update({
      where: { id: datos.id },
      data: {
        bookId: datos.bookId,
        genreId: datos.genreId
      },
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
        genre: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });
    return bookGenreActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar book genre: ${error.message}`);
  }
};

export const eliminarBookGenre = async (id) => {
  try {
    await prisma.bookGenre.delete({
      where: { id }
    });
    return { message: "Book genre eliminado exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar book genre: ${error.message}`);
  }
};

export const eliminarBookGenresPorLibro = async (bookId) => {
  try {
    await prisma.bookGenre.deleteMany({
      where: { bookId }
    });
    return { message: "Book genres eliminados exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar book genres por libro: ${error.message}`);
  }
};

export const actualizarGenresDeLibro = async (bookId, genreIds) => {
  try {
    // Eliminar géneros existentes del libro
    await prisma.bookGenre.deleteMany({
      where: { bookId }
    });
    
    // Crear nuevas relaciones
    const bookGenres = [];
    for (const genreId of genreIds) {
      const bookGenre = await prisma.bookGenre.create({
        data: {
          bookId,
          genreId
        },
        include: {
          genre: {
            select: {
              id: true,
              name: true,
              description: true
            }
          }
        }
      });
      bookGenres.push(bookGenre);
    }
    
    return bookGenres;
  } catch (error) {
    throw new Error(`Error al actualizar géneros de libro: ${error.message}`);
  }
}; 