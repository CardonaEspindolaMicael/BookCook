import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerIndicesCapitulo = async () => {
  try {
    const indices = await prisma.chapterIndex.findMany({
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
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
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener índices de capítulos: ${error.message}`);
  }
};

export const obtenerIndicePorId = async (id) => {
  try {
    const indice = await prisma.chapterIndex.findUnique({
      where: { id },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
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
        }
      }
    });
    return indice;
  } catch (error) {
    throw new Error(`Error al obtener índice por ID: ${error.message}`);
  }
};

export const obtenerIndicePorCapitulo = async (chapterId) => {
  try {
    const indice = await prisma.chapterIndex.findUnique({
      where: { chapterId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
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
        }
      }
    });
    return indice;
  } catch (error) {
    throw new Error(`Error al obtener índice por capítulo: ${error.message}`);
  }
};

export const crearIndiceCapitulo = async (datos) => {
  try {
    const nuevoIndice = await prisma.chapterIndex.create({
      data: {
        chapterId: datos.chapterId,
        bookId: datos.bookId,
        content: datos.content,
        summary: datos.summary,
        keyEvents: datos.keyEvents,
        characters: datos.characters,
        mood: datos.mood,
        cliffhanger: datos.cliffhanger,
        wordCount: datos.wordCount
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return nuevoIndice;
  } catch (error) {
    throw new Error(`Error al crear índice de capítulo: ${error.message}`);
  }
};

export const actualizarIndiceCapitulo = async (datos) => {
  try {
    const indiceActualizado = await prisma.chapterIndex.update({
      where: { id: datos.id },
      data: {
        content: datos.content,
        summary: datos.summary,
        keyEvents: datos.keyEvents,
        characters: datos.characters,
        mood: datos.mood,
        cliffhanger: datos.cliffhanger,
        wordCount: datos.wordCount,
        lastAnalyzed: datos.lastAnalyzed ? new Date(datos.lastAnalyzed) : new Date()
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });
    return indiceActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar índice de capítulo: ${error.message}`);
  }
};

export const eliminarIndiceCapitulo = async (id) => {
  try {
    await prisma.chapterIndex.delete({
      where: { id }
    });
    return { message: "Índice de capítulo eliminado exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar índice de capítulo: ${error.message}`);
  }
};

export const actualizarAnalisisCapitulo = async (chapterId) => {
  try {
    // Obtener el capítulo para generar el análisis
    const capitulo = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        book: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    if (!capitulo) {
      throw new Error('Capítulo no encontrado');
    }

    const content = capitulo.content;
    const wordCount = content.split(/\s+/).length;

    // Aquí podrías integrar con un servicio de IA para generar el análisis
    // Por ahora, creamos un análisis básico
    const summary = `Resumen del capítulo "${capitulo.title}"`;
    const keyEvents = JSON.stringify(['evento1', 'evento2']); // Placeholder
    const characters = JSON.stringify(['personaje1', 'personaje2']); // Placeholder
    const mood = 'neutral'; // Placeholder
    const cliffhanger = false; // Placeholder

    const indiceActualizado = await prisma.chapterIndex.upsert({
      where: { chapterId },
      update: {
        content,
        summary,
        keyEvents,
        characters,
        mood,
        cliffhanger,
        wordCount,
        lastAnalyzed: new Date()
      },
      create: {
        chapterId,
        bookId: capitulo.bookId,
        content,
        summary,
        keyEvents,
        characters,
        mood,
        cliffhanger,
        wordCount,
        lastAnalyzed: new Date()
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return indiceActualizado;
  } catch (error) {
    throw new Error(`Error al actualizar análisis de capítulo: ${error.message}`);
  }
};

export const obtenerCapitulosPorEvento = async (evento) => {
  try {
    const indices = await prisma.chapterIndex.findMany({
      where: {
        keyEvents: {
          contains: evento
        }
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
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
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener capítulos por evento: ${error.message}`);
  }
};

export const obtenerCapitulosPorPersonaje = async (personaje) => {
  try {
    const indices = await prisma.chapterIndex.findMany({
      where: {
        characters: {
          contains: personaje
        }
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
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
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener capítulos por personaje: ${error.message}`);
  }
};

export const obtenerCapitulosPorEstadoAnimo = async (estadoAnimo) => {
  try {
    const indices = await prisma.chapterIndex.findMany({
      where: {
        mood: estadoAnimo
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
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
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
    return indices;
  } catch (error) {
    throw new Error(`Error al obtener capítulos por estado de ánimo: ${error.message}`);
  }
}; 