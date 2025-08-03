import { PrismaClient } from "@prisma/client";
import { sendToAIService } from "../AI/aiServiceIntegration.js";

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
    // Obtener el libro y sus capítulos con sus índices ya analizados
    const libro = await prisma.book.findUnique({
      where: { id: bookId },
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            chapterIndex: true // Incluir los índices de capítulos ya analizados
          }
        },
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!libro) {
      throw new Error('Libro no encontrado');
    }

    // Verificar que todos los capítulos tengan análisis
    const chaptersWithoutAnalysis = libro.chapters.filter(chapter => !chapter.chapterIndex);
    if (chaptersWithoutAnalysis.length > 0) {
      console.warn(`⚠️ ${chaptersWithoutAnalysis.length} capítulos sin análisis. Se recomienda ejecutar actualizarAnalisisCapitulo primero.`);
    }

    // Recopilar datos de los índices de capítulos
    const chapterAnalyses = libro.chapters
      .filter(chapter => chapter.chapterIndex)
      .map(chapter => ({
        title: chapter.title,
        summary: chapter.chapterIndex.summary,
        keyEvents: JSON.parse(chapter.chapterIndex.keyEvents || '[]'),
        characters: JSON.parse(chapter.chapterIndex.characters || '[]'),
        mood: chapter.chapterIndex.mood,
        cliffhanger: chapter.chapterIndex.cliffhanger,
        thematicAnalysis: chapter.chapterIndex.thematicAnalysis,
        wordCount: chapter.chapterIndex.wordCount
      }));

    // Calcular estadísticas del libro
    const totalWordCount = chapterAnalyses.reduce((sum, chapter) => sum + chapter.wordCount, 0);
    const totalChapters = libro.chapters.length;
    const analyzedChapters = chapterAnalyses.length;

    // Combinar todo el texto de los capítulos (para compatibilidad)
    const fullText = libro.chapters.map(chapter => chapter.content).join('\n\n');

    // Configurar el análisis con Gemini AI usando los datos de ChapterIndex
    const aiRequest = {
      userQuery: "Analyze this complete book based on its chapter analyses and provide a detailed analysis of the book",
      interactionType: {
        name: "Book Analyzer",
        category: "text_generation",
        systemPrompt: `You are an expert literary analyst and book critic. Your task is to analyze complete books based on the analyses of their chapters and provide a detailed, structured analysis of the entire book. You must be precise, objective, and helpful for both readers and authors.`,
        userPrompt: `Analyze the following book based on the provided analyses of its chapters. Your response MUST be a single, raw JSON object.
    
    **CRITICAL INSTRUCTIONS:**
    - The entire output must be a single, valid JSON object.
    - DO NOT wrap the JSON in Markdown backticks (\`\`\`).
    - DO NOT add any text, explanation, or comments before or after the JSON object.
    - The response must start with \`{\` and end with \`}\`.
    
    Based on the chapter analyses, provide the following fields in the JSON structure:
    
    1.  **summary** (String, 3-4 sentences): A comprehensive summary of the entire book.
    2.  **themes** (Array of strings): The most important themes that are developed throughout the book.
    3.  **characters** (Array of strings): The most important characters and their roles.
    4.  **plotPoints** (Array of strings): The most significant plot events.
    5.  **tone** (String, one word): The predominant emotional tone of the book (e.g., epic, intimate, mysterious, dramatic).
    6.  **genre** (String, one word): The main literary genre of the book.
    7.  **structureAnalysis** (String, optional): A brief analysis of the narrative structure.
    8.  **cliffhangers** (Array of strings, optional): A summary of the most important cliffhangers.
    
    **JSON STRUCTURE EXAMPLE:**
    {
      "summary": "A complete summary of the book.",
      "themes": ["theme1", "theme2", "theme3"],
      "characters": ["character1", "character2"],
      "plotPoints": ["point1", "point2", "point3"],
      "tone": "tone of the book",
      "genre": "literary genre",
      "structureAnalysis": "optional structure analysis",
      "cliffhangers": ["cliffhanger1", "cliffhanger2"]
    }`
    ,
        costPerUse: 5
      },
      contextData: {
        bookTitle: libro.title,
        totalChapters: totalChapters,
        analyzedChapters: analyzedChapters,
        totalWordCount: totalWordCount,
        authorName: libro.author?.name
      },
      bookContext: {
        id: libro.id,
        title: libro.title,
        genre: libro.genre,
        summary: libro.summary,
        themes: libro.themes,
        author: libro.author?.name
      },
      chapterContext: {
        totalChapters: totalChapters,
        chapterAnalyses: chapterAnalyses,
        averageWordCount: Math.round(totalWordCount / analyzedChapters),
        chaptersWithCliffhangers: chapterAnalyses.filter(ch => ch.cliffhanger).length
      }
    };

    // Generar análisis con Gemini AI
    const aiResult = await sendToAIService(aiRequest);
    
    let summary, themes, characters, plotPoints, tone, genre, structureAnalysis, cliffhangers;
    
    if (aiResult.success) {
      try {
        // Intentar parsear la respuesta JSON
        const analysis = JSON.parse(aiResult.response);
        summary = analysis.summary || `Resumen del libro "${libro.title}" con ${totalChapters} capítulos`;
        themes = JSON.stringify(analysis.themes || ['tema1', 'tema2']);
        characters = JSON.stringify(analysis.characters || ['personaje1', 'personaje2']);
        plotPoints = JSON.stringify(analysis.plotPoints || ['punto1', 'punto2']);
        tone = analysis.tone || 'neutral';
        genre = analysis.genre || 'fiction';
        structureAnalysis = analysis.structureAnalysis || '';
        cliffhangers = JSON.stringify(analysis.cliffhangers || []);
      } catch (parseError) {
        console.warn('Error parsing AI response as JSON, using fallback:', parseError);
        // Fallback si no se puede parsear JSON
        summary = aiResult.response.substring(0, 300) + '...';
        themes = JSON.stringify(['tema1', 'tema2']);
        characters = JSON.stringify(['personaje1', 'personaje2']);
        plotPoints = JSON.stringify(['punto1', 'punto2']);
        tone = 'neutral';
        genre = 'fiction';
        structureAnalysis = '';
        cliffhangers = JSON.stringify([]);
      }
    } else {
      console.warn('AI analysis failed, using fallback:', aiResult.error);
      // Fallback si falla el análisis de IA
      summary = `Resumen del libro "${libro.title}" con ${totalChapters} capítulos`;
      themes = JSON.stringify(['tema1', 'tema2']);
      characters = JSON.stringify(['personaje1', 'personaje2']);
      plotPoints = JSON.stringify(['punto1', 'punto2']);
      tone = 'neutral';
      genre = 'fiction';
      structureAnalysis = '';
      cliffhangers = JSON.stringify([]);
    }

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
        wordCount: totalWordCount,
        lastAnalyzed: new Date(),
        analysisVersion: '2.0',
        structureAnalysis: structureAnalysis || null,
        cliffhangers: cliffhangers || null
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
        wordCount: totalWordCount,
        lastAnalyzed: new Date(),
        analysisVersion: '2.0',
        structureAnalysis: structureAnalysis || null,
        cliffhangers: cliffhangers || null
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
        }
      }
    });

    return {
      ...indiceActualizado,
      aiAnalysis: aiResult.success ? {
        success: true,
        processingTime: aiResult.processingTime,
        tokenUsed: aiResult.tokenUsed,
        model: aiResult.model
      } : {
        success: false,
        error: aiResult.error
      },
      bookStats: {
        totalChapters,
        analyzedChapters,
        totalWordCount,
        averageWordCount: Math.round(totalWordCount / analyzedChapters),
        chaptersWithCliffhangers: chapterAnalyses.filter(ch => ch.cliffhanger).length
      }
    };
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