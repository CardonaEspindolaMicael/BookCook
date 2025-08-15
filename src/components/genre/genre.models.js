import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all genres
export const obtenerGeneros = async () => {
  return await prisma.genre.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};

// Get genre by ID
export const obtenerGeneroPorId = async (id) => {
  return await prisma.genre.findUnique({
    where: { id }
  });
};

// Create new genre
export const crearGenero = async (data) => {
  return await prisma.genre.create({
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive !== undefined ? data.isActive : true
    }
  });
};

// Update genre
export const actualizarGenero = async (id, data) => {
  return await prisma.genre.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      isActive: data.isActive
    }
  });
};

// Delete genre
export const eliminarGenero = async (id) => {
  return await prisma.genre.delete({
    where: { id }
  });
};

// Get active genres only
export const obtenerGenerosActivos = async () => {
  return await prisma.genre.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      name: 'asc'
    }
  });
};

// Search genres by name
export const obtenerGenerosPorNombre = async (nombre) => {
  return await prisma.genre.findMany({
    where: {
      name: {
        contains: nombre,
        mode: 'insensitive'
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
};

// Get genres with their books
export const obtenerGenerosConLibros = async () => {
  return await prisma.genre.findMany({
    include: {
      books: {
        include: {
          book: {
            select: {
              id: true,
              title: true,
              authorId: true,
              status: true,
              isFree: true,
              viewCount: true,
              averageRating: true,
              totalReviews: true
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
};

// Count books by genre
export const contarLibrosPorGenero = async (generoId) => {
  const result = await prisma.bookGenre.count({
    where: {
      genreId: generoId
    }
  });
  
  return result;
};

// Get genre with book count
export const obtenerGeneroConConteoLibros = async (generoId) => {
  const genero = await prisma.genre.findUnique({
    where: { id: generoId },
    include: {
      _count: {
        select: {
          books: true
        }
      }
    }
  });
  
  return genero;
};

// Get popular genres (with most books)
export const obtenerGenerosPopulares = async (limit = 10) => {
  const generos = await prisma.genre.findMany({
    include: {
      _count: {
        select: {
          books: true
        }
      }
    },
    orderBy: {
      books: {
        _count: 'desc'
      }
    },
    take: limit
  });
  
  return generos;
};

// Get genres with book statistics
export const obtenerGenerosConEstadisticas = async () => {
  const generos = await prisma.genre.findMany({
    include: {
      books: {
        include: {
          book: {
            select: {
              id: true,
              title: true,
              viewCount: true,
              averageRating: true,
              totalReviews: true,
              status: true
            }
          }
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });
  
  // Calculate statistics for each genre
  return generos.map(genero => {
    const libros = genero.books.map(bg => bg.book);
    const totalLibros = libros.length;
    const totalVistas = libros.reduce((sum, libro) => sum + libro.viewCount, 0);
    const promedioRating = libros.length > 0 
      ? libros.reduce((sum, libro) => sum + libro.averageRating, 0) / libros.length 
      : 0;
    const totalReviews = libros.reduce((sum, libro) => sum + libro.totalReviews, 0);
    
    return {
      ...genero,
      estadisticas: {
        totalLibros,
        totalVistas,
        promedioRating,
        totalReviews
      }
    };
  });
}; 