import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerIndicesLibro = async () => {
  try {
    const indices = await prisma.bookIndex.findMany({
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
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener índices: ${error.message}`);
  }
};

export const obtenerIndicePorId = async (id) => {
  try {
    const indice = await prisma.bookIndex.findUnique({
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
        }
      }
    });
    return indice;
  } catch (error) {
    throw new Error(`Error al obtener índice por ID: ${error.message}`);
  }
};

export const obtenerIndicePorLibro = async (bookId) => {
  try {
    const indice = await prisma.bookIndex.findUnique({
      where: { bookId },
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
        }
      }
    });
    return indice;
  } catch (error) {
    throw new Error(`Error al obtener índice por libro: ${error.message}`);
  }
};

export const crearIndiceLibro = async (datos) => {
  try {
    const nuevoIndice = await prisma.bookIndex.create({
      data: {
        bookId: datos.bookId,
        fullText: datos.fullText,
        summary: datos.summary,
        themes: datos.themes,
        characters: datos.characters,
        plotPoints: datos.plotPoints,
        tone: datos.tone,
        genre: datos.genre,
        wordCount: datos.wordCount,
        analysisVersion: datos.analysisVersion
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return nuevoIndice;
  } catch (error) {
    throw new Error(`Error al crear índice: ${error.message}`);
  }
};

export const actualizarIndiceLibro = async (datos) => {
  try {
    const indiceActualizado = await prisma.bookIndex.update({
      where: { id: datos.id },
      data: {
        fullText: datos.fullText,
        summary: datos.summary,
        themes: datos.themes,
        characters: datos.characters,
        plotPoints: datos.plotPoints,
        tone: datos.tone,
        genre: datos.genre,
        wordCount: datos.wordCount,
        lastAnalyzed: datos.lastAnalyzed ? new Date(datos.lastAnalyzed) : new Date(),
        analysisVersion: datos.analysisVersion
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return indiceActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar índice: ${error.message}`);
  }
};

export const eliminarIndiceLibro = async (id) => {
  try {
    await prisma.bookIndex.delete({
      where: { id }
    });
    return { message: "Índice eliminado exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar índice: ${error.message}`);
  }
};

export const actualizarAnalisisLibro = async (bookId) => {
  try {
    // Obtener el libro y sus capítulos para generar el análisis
    const libro = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    // Combinar todo el texto de los capítulos
    const fullText = libro.chapters.map(chapter => chapter.content).join('\n\n');
    const wordCount = fullText.split(/\s+/).length;

    // Aquí podrías integrar con un servicio de IA para generar el análisis
    // Por ahora, creamos un análisis básico
    const summary = `Resumen del libro "${libro.title}" con ${libro.chapters.length} capítulos`;
    const themes = JSON.stringify(['tema1', 'tema2']); // Placeholder
    const characters = JSON.stringify(['personaje1', 'personaje2']); // Placeholder
    const plotPoints = JSON.stringify(['punto1', 'punto2']); // Placeholder
    const tone = 'neutral'; // Placeholder
    const genre = 'fiction'; // Placeholder

    const indiceActualizado = await prisma.bookIndex.upsert({
      where: { bookId },
      update: {
        fullText,
        summary,
        themes,
        characters,
        plotPoints,
        tone,
        genre,
        wordCount,
        lastAnalyzed: new Date(),
        analysisVersion: '1.0'
      },
      create: {
        bookId,
        fullText,
        summary,
        themes,
        characters,
        plotPoints,
        tone,
        genre,
        wordCount,
        lastAnalyzed: new Date(),
        analysisVersion: '1.0'
      },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return indiceActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar análisis: ${error.message}`);
  }
};

export const obtenerLibrosPorTema = async (tema) => {
  try {
    const indices = await prisma.bookIndex.findMany({
      where: {
        themes: {
          contains: tema
        }
      },
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
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener libros por tema: ${error.message}`);
  }
};

export const obtenerLibrosPorGenero = async (genero) => {
  try {
    const indices = await prisma.bookIndex.findMany({
      where: {
        genre: genero
      },
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
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener libros por género: ${error.message}`);
  }
};

export const obtenerLibrosPorTono = async (tono) => {
  try {
    const indices = await prisma.bookIndex.findMany({
      where: {
        tone: tono
      },
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
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener libros por tono: ${error.message}`);
  }
}; 