import { PrismaClient } from "@prisma/client";
import { sendToAIService } from "../AI/aiServiceIntegration.js";
import { buildChapterContext } from "../../helpers/BookIndexHelper.js";

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
    // 1. Get the book and its chapter indices
    const libro = await prisma.book.findUnique({
      where: { id: bookId },
    
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: {
            chapterIndex: true 
          }
        },
         genres:{
          where:{
            bookId:bookId
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

    // 2. Collect data from existing chapter indices
    const chapterAnalyses = libro.chapters
      .filter(chapter => chapter.chapterIndex) // Only include chapters that have an index
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

      let chapterAnalysesString = buildChapterContext(chapterAnalyses) // <-- now it's a string

    const totalWordCount = chapterAnalyses.reduce((sum, chapter) => sum + chapter.wordCount, 0);
    const analyzedChapters = chapterAnalyses.length;
    const totalChapters = libro.chapters.length; // ✅ MOVED THIS LINE UP


    // Check if there is enough content to justify an AI call.
    // We need at least one analyzed chapter and a total word count of 100 or more.
    if (analyzedChapters === 0 || totalWordCount < 50) {
      console.log(`Análisis del libro omitido para "${libro.title}" por falta de contenido (Capítulos analizados: ${analyzedChapters}, Palabras totales: ${totalWordCount}).`);

      // If validation fails, we create/update a placeholder index without calling the AI.
      const placeholderIndex = await prisma.bookIndex.upsert({
        where: { bookId },
        update: {
          summary: 'Análisis pendiente. Se requiere más contenido o análisis de capítulos.',
          analysisVersion: '1.0-pending', // Use a version to indicate status
          lastAnalyzed: new Date(),
        },
        create: {
          bookId,
          summary: 'Análisis pendiente. Se requiere más contenido o análisis de capítulos.',
          themes: '[]',
          characters: '[]',
          plotPoints: '[]',
          tone: 'N/A',
          genre: 'N/A',
          wordCount: totalWordCount,
          analysisVersion: '1.0-pending',
          lastAnalyzed: new Date(),
        },
        include: { book: true }
      });

      // Return a specific response indicating no AI was used
      return {
        ...placeholderIndex,
        aiAnalysis: {
          success: false,
          error: 'Not enough content for analysis.'
        },
        bookStats: { totalChapters: libro.chapters.length, analyzedChapters, totalWordCount }
      };
    }
    // --- END OF NEW VALIDATION LOGIC ---

    // If validation passes, proceed with the AI analysis as before.
    const fullText = libro.chapters.map(chapter => chapter.content).join('\n\n');

  // 3. Configure the AI request with the improved prompt
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
8.  **cliffhanger** (Array of strings, optional): A summary of the most important cliffhanger.

**JSON STRUCTURE EXAMPLE:**
{
  "summary": "A complete summary of the book.",
  "themes": ["theme1", "theme2", "theme3"],
  "characters": ["character1", "character2"], 
  "plotPoints": ["point1", "point2", "point3"],
  "tone": "tone of the book",
  "genre": "literary genre",
  "structureAnalysis": "optional structure analysis",
  "cliffhanger": ["cliffhanger1", "cliffhanger2"]
}`,
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
    chapterAnalyses: chapterAnalysesString,
    averageWordCount: analyzedChapters > 0 ? Math.round(totalWordCount / analyzedChapters) : 0,
    chaptersWithCliffhangers: chapterAnalyses.filter(ch => ch.cliffhanger).length
  }
};

    const aiResult = await sendToAIService(aiRequest);
    
    let summary, themes, characters, plotPoints, tone, genre, structureAnalysis, cliffhanger;
    
    // The robust parsing logic remains essential
    if (aiResult.success) {
      try {
        console.log(aiResult)
        const generalResponse = aiResult.response;
        summary = generalResponse.summary|| `Resumen del libro "${libro.title}"`;
        themes = generalResponse.themes || [];
        characters = generalResponse.characters || [];
        plotPoints = generalResponse.plotPoints || [];
        tone = generalResponse.tone || 'neutral';
        genre = generalResponse.genre || 'fiction';
        structureAnalysis = generalResponse.structureAnalysis || '';
        cliffhanger = Array.isArray(generalResponse.cliffhanger) ? generalResponse.cliffhanger : [];
      } catch (parseError) {
        console.error('Failed to parse AI response. Using fallback:', parseError);
        // Handle parsing failure...
        summary = `Resumen del libro "${libro.title}" (análisis fallido)`;
        themes = JSON.stringify([]); characters = JSON.stringify([]); plotPoints = JSON.stringify([]);
        tone = 'neutral'; genre = 'fiction'; structureAnalysis = ''; cliffhanger = JSON.stringify([]);
      }
    } else {
      console.warn('AI analysis failed. Using fallback:', aiResult.error);
      // Handle AI service failure...
      summary = `Resumen del libro "${libro.title}" (servicio AI falló)`;
      themes = JSON.stringify([]); characters = JSON.stringify([]); plotPoints = JSON.stringify([]);
      tone = 'neutral'; genre = 'fiction'; structureAnalysis = ''; cliffhanger = JSON.stringify([]);
    }

    // Update the database with the successful AI analysis
    const indiceActualizado = await prisma.bookIndex.upsert({
      where: { bookId },
      update: {
        fullText, summary, themes, characters, plotPoints, tone, genre,
        wordCount: totalWordCount,
        lastAnalyzed: new Date(),
        analysisVersion: '2.0',
        structureAnalysis: structureAnalysis || null,
        cliffhanger: cliffhanger || null
      },
      create: {
        bookId, fullText, summary, themes, characters, plotPoints, tone, genre,
        wordCount: totalWordCount,
        lastAnalyzed: new Date(),
        analysisVersion: '2.0',
        structureAnalysis: structureAnalysis || null,
        cliffhanger: cliffhanger || null
      },
      include: { book: true }
    });

    return {
      ...indiceActualizado,
      aiAnalysis: aiResult.success ? { /* ... */ } : { success: false, error: aiResult.error },
      bookStats: { /* ... */ }
    };

  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Error al actualizar análisis del libro: ${error.message}`);
    } else {
        throw new Error(`Un error desconocido ocurrió durante el análisis del libro.`);
    }
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

export const obtenerCharacterPorLibro = async (bookId) => {

  try {
    const characters = await prisma.bookIndex.findUnique({
      where: { bookId },
      select: {
        characters: true
      }
    });

    return characters.characters || [];

  } catch (error) {
      throw new Error(`Error getting the characters: ${error.message}`);
  }
};