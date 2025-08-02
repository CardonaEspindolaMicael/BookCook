import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerCapitulos = async () => {
  try {
    const capitulos = await prisma.chapter.findMany({
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
        },
        aiInteractions: {
          include: {
            interactionType: true,
            aiAssistant: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        readingHistory: {
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
        chapterIndex: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    return capitulos;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const crearCapitulo = async (datos) => {
  try {
    const { 
      title,
      content,
      orderIndex,
      bookId,
      isFree = true,
      wordCount = 0
    } = datos;
    
    const nuevoCapitulo = await prisma.chapter.create({
      data: {
        title,
        content,
        orderIndex,
        bookId,
        isFree,
        wordCount
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
    return nuevoCapitulo;
  } catch (error) {
    console.error('Error al crear capítulo:', error);
    throw error;
  }
};

export const actualizarCapitulo = async (capitulo) => {
  const {
    id,
    title,
    content,
    orderIndex,
    isFree,
    wordCount
  } = capitulo;

  try {
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex;
    if (isFree !== undefined) updateData.isFree = isFree;
    if (wordCount !== undefined) updateData.wordCount = wordCount;

    const capituloActualizado = await prisma.chapter.update({
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
    return capituloActualizado;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const validarCapituloExiste = async (id) => {
  const capitulo = await prisma.chapter.findUnique({ where: { id } });
  return !!capitulo;
};

export const eliminarCapitulo = async (id) => {
  try {
    const existeCapitulo = await validarCapituloExiste(id);
    if (!existeCapitulo) {
      return {
        message: `Error: el capítulo con id ${id} no existe`
      };
    }

    await prisma.chapter.delete({ where: { id } });

    return {
      message: `Capítulo eliminado`
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerCapituloPorId = async (id) => {
  try {
    const capitulo = await prisma.chapter.findUnique({
      where: { id },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        aiInteractions: {
          include: {
            interactionType: true,
            aiAssistant: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        readingHistory: {
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
        chapterIndex: true
      }
    });
    return capitulo;
  } catch (error) {
    console.error(error);
    return error;
  } 
};

export const obtenerCapitulosPorLibro = async (bookId) => {
  try {
    const capitulos = await prisma.chapter.findMany({
      where: { bookId },
      include: {
        aiInteractions: {
          include: {
            interactionType: true,
            aiAssistant: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        readingHistory: {
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
        chapterIndex: true
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    return capitulos;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerCapituloPorOrden = async (bookId, orderIndex) => {
  try {
    const capitulo = await prisma.chapter.findUnique({
      where: {
        bookId_orderIndex: {
          bookId,
          orderIndex
        }
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
    return capitulo;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const reordenarCapitulos = async (bookId, capitulosOrdenados) => {
  try {
    const updates = capitulosOrdenados.map((capitulo, index) => {
      return prisma.chapter.update({
        where: { id: capitulo.id },
        data: { orderIndex: index + 1 }
      });
    });

    await prisma.$transaction(updates);

    return {
      message: "Capítulos reordenados exitosamente"
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const buscarCapitulos = async (searchTerm) => {
  try {
    const capitulos = await prisma.chapter.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          },
          {
            content: {
              contains: searchTerm,
              mode: 'insensitive'
            }
          }
        ]
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
      },
      orderBy: {
        orderIndex: 'asc'
      }
    });
    return capitulos;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerCapitulosGratuitos = async () => {
  try {
    const capitulos = await prisma.chapter.findMany({
      where: { isFree: true },
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
        orderIndex: 'asc'
      }
    });
    return capitulos;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const actualizarContadorPalabras = async (chapterId) => {
  try {
    const capitulo = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: { content: true }
    });

    if (!capitulo) {
      throw new Error('Capítulo no encontrado');
    }

    const wordCount = capitulo.content.split(/\s+/).filter(word => word.length > 0).length;

    const capituloActualizado = await prisma.chapter.update({
      where: { id: chapterId },
      data: { wordCount }
    });

    return capituloActualizado;
  } catch (error) {
    console.error(error);
    return error;
  }
}; 