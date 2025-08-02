import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

export const obtenerUsuarios = async () => {
  try {
    const usuarios = await prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        books: {
          where: {
            status: 'published'
          }
        },
        purchases: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        bookAccesses: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        nftOwnerships: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });
    return usuarios;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const registrarUsuarios = async (datos) => {
  try {
    const { 
      name,
      email,
      password,
      image,
      bio,
      isPremium = false
    } = datos;
    
    const nuevoUsuario = await prisma.user.create({
      data: {
        name,
        email,
        password,
        image,
        bio,
        isPremium
      }
    });
    return nuevoUsuario;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

export const updateUsuario = async (user) => {
  const {
    name,
    email,
    password,
    image,
    bio,
    isPremium
  } = user;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.password = password;
    if (image !== undefined) updateData.image = image;
    if (bio !== undefined) updateData.bio = bio;
    if (isPremium !== undefined) updateData.isPremium = isPremium;

    const usuarioActualizado = await prisma.user.update({
      where: { email },
      data: updateData
    });
    return usuarioActualizado;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const validarUsuariosExistentes = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  return !!user; 
};

export const deleteUser = async (id) => {
  try {
    const existeUsuario = await validarUsuariosExistentes(id);
    if (!existeUsuario) {
      return {
        message: `Error: el usuario con id ${id} no existe`
      };
    }

    await prisma.user.delete({ where: { id } });

    return {
      message: `Usuario eliminado`
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const cambiarContrasena = async (id, nuevaContrasena) => {
  try {
    const usuarioActualizado = await prisma.user.update({
      where: { id },
      data: { password: nuevaContrasena }
    });
    return usuarioActualizado;
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error);
    throw error;
  }
};

export const contrasenaActual = async (id) => {
  try {
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: { password: true }
    });

    return usuario?.password || null;
  } catch (error) {
    console.error("Error al obtener la contraseña:", error);
    throw error;
  }
};

export const obtenerUsuarioPorSuCorreo = async (email) => {
  try {
    const usuario = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true, // 👈 Aquí se incluye la contraseña
        userRoles: {
          include: {
            role: true
          }
        },
        books: {
          where: {
            status: 'published'
          }
        },
        purchases: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        bookAccesses: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        nftOwnerships: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        aiUsage: true
      }
    });
    return usuario;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerUsuariosById = async (id) => {
  try {
    const usuario = await prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        books: {
          include: {
            chapters: {
              orderBy: {
                orderIndex: 'asc'
              }
            }
          }
        },
        purchases: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        reviews: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        bookAccesses: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        notifications: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        aiInteractions: {
          include: {
            interactionType: true,
            aiAssistant: true,
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        aiUsage: true,
        readingHistory: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            },
            chapter: {
              select: {
                id: true,
                title: true
              }
            }
          },
          orderBy: {
            lastReadAt: 'desc'
          }
        },
        bookmarks: {
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
        },
        following: {
          include: {
            following: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        followers: {
          include: {
            follower: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true
              }
            }
          }
        },
        nftOwnerships: {
          include: {
            book: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });
    return usuario;
  } catch (error) {
    console.error(error);
    return error;
  } 
};

export const asignarRolUsuario = async (userId, roleId) => {
  try {
    const userRole = await prisma.userRole.create({
      data: {
        userId,
        roleId
      }
    });
    return userRole;
  } catch (error) {
    console.error("Error al asignar rol:", error);
    throw error;
  }
};

export const removerRolUsuario = async (userId, roleId) => {
  try {
    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId
        }
      }
    });
    return { message: "Rol removido exitosamente" };
  } catch (error) {
    console.error("Error al remover rol:", error);
    throw error;
  }
};

export const obtenerUsuariosPremium = async () => {
  try {
    const usuarios = await prisma.user.findMany({
      where: { isPremium: true },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        isPremium: true,
        createdAt: true
      }
    });
    return usuarios;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const obtenerEstadisticasUsuario = async (userId) => {
  try {
    const [books, purchases, reviews, bookmarks, followers, following] = await Promise.all([
      prisma.book.count({ where: { authorId: userId } }),
      prisma.purchase.count({ where: { buyerId: userId } }),
      prisma.review.count({ where: { userId } }),
      prisma.bookmark.count({ where: { userId } }),
      prisma.follow.count({ where: { followerId: userId } }),
      prisma.follow.count({ where: { followingId: userId } })
    ]);

    const totalSpent = await prisma.purchase.aggregate({
      where: { buyerId: userId, status: 'completed' },
      _sum: { amount: true }
    });

    return {
      books,
      purchases,
      reviews,
      bookmarks,
      followers,
      following,
      totalSpent: totalSpent._sum.amount || 0
    };
  } catch (error) {
    console.error(error);
    return error;
  }
};

