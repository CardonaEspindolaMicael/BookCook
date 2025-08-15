import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const obtenerReviews = async () => {
  try {
    const reviews = await prisma.review.findMany({
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
    return reviews;
  } catch (error) {
    throw new Error(`Error al obtener reviews: ${error.message}`);
  }
};

export const obtenerReviewPorId = async (id) => {
  try {
    const review = await prisma.review.findUnique({
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
    return review;
  } catch (error) {
    throw new Error(`Error al obtener review por ID: ${error.message}`);
  }
};

export const crearReview = async (datos) => {
  try {
    const nuevaReview = await prisma.review.create({
      data: {
        bookId: datos.bookId,
        userId: datos.userId,
        rating: datos.rating,
        title: datos.title,
        content: datos.content,
        isVerifiedOwner: datos.isVerifiedOwner || false
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
            title: true
          }
        }
      }
    });

    // Actualizar estadísticas del libro
    await actualizarEstadisticasLibro(datos.bookId);

    return nuevaReview;
  } catch (error) {
    throw new Error(`Error al crear review: ${error.message}`);
  }
};

export const actualizarReview = async (datos) => {
  try {
    const reviewActualizada = await prisma.review.update({
      where: { id: datos.id },
      data: {
        rating: datos.rating,
        title: datos.title,
        content: datos.content,
        isVerifiedOwner: datos.isVerifiedOwner
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
            title: true
          }
        }
      }
    });

    // Actualizar estadísticas del libro
    await actualizarEstadisticasLibro(reviewActualizada.bookId);

    return reviewActualizada;
  } catch (error) {
    throw new Error(`Error al actualizar review: ${error.message}`);
  }
};

export const eliminarReview = async (id) => {
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      select: { bookId: true }
    });

    await prisma.review.delete({
      where: { id }
    });

    // Actualizar estadísticas del libro
    if (review) {
      await actualizarEstadisticasLibro(review.bookId);
    }

    return { message: "Review eliminada exitosamente" };
  } catch (error) {
    throw new Error(`Error al eliminar review: ${error.message}`);
  }
};

export const obtenerReviewsPorLibro = async (bookId) => {
  try {
    const reviews = await prisma.review.findMany({
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
    return reviews;
  } catch (error) {
    throw new Error(`Error al obtener reviews por libro: ${error.message}`);
  }
};

export const obtenerReviewsPorUsuario = async (userId) => {
  try {
    const reviews = await prisma.review.findMany({
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
        createdAt: 'desc'
      }
    });
    return reviews;
  } catch (error) {
    throw new Error(`Error al obtener reviews por usuario: ${error.message}`);
  }
};

export const obtenerReviewsPorRating = async (rating) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { rating },
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
    return reviews;
  } catch (error) {
    throw new Error(`Error al obtener reviews por rating: ${error.message}`);
  }
};

export const obtenerReviewsVerificadas = async () => {
  try {
    const reviews = await prisma.review.findMany({
      where: { isVerifiedOwner: true },
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
    return reviews;
  } catch (error) {
    throw new Error(`Error al obtener reviews verificadas: ${error.message}`);
  }
};

export const obtenerPromedioRatingLibro = async (bookId) => {
  try {
    const resultado = await prisma.review.aggregate({
      where: { bookId },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    return {
      bookId,
      promedioRating: resultado._avg.rating || 0,
      totalReviews: resultado._count.rating
    };
  } catch (error) {
    throw new Error(`Error al obtener promedio de rating: ${error.message}`);
  }
};

const actualizarEstadisticasLibro = async (bookId) => {
  try {
    const resultado = await prisma.review.aggregate({
      where: { bookId },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        averageRating: resultado._avg.rating || 0,
        totalReviews: resultado._count.rating
      }
    });
  } catch (error) {
    console.error(`Error al actualizar estadísticas del libro: ${error.message}`);
  }
}; 