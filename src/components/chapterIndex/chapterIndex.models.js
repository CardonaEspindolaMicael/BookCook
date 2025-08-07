import { PrismaClient } from "@prisma/client";
import { sendToAIService } from "../AI/aiServiceIntegration.js";

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

function cleanAIResponse(text) {
  return text.replace(/```json|```/g, '').trim();
}

export const actualizarAnalisisCapitulo = async (chapterId) => {
  try {
    // Obtener el capítulo para generar el análisis
    const capitulo = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            genres: true,
            bookIndex: {
              select: {
                summary: true,
                themes: true,
                genre: true,
              },
            },
          },
        },
      },
    });

    if (!capitulo) {
      throw new Error('Capítulo no encontrado');
    }

    const content = capitulo.content;
    const wordCount = content.split(/\s+/).length;

    // Configurar el análisis con Gemini AI
    const aiRequest = {
      userQuery: 'Analyze this chapter and provide a detailed analysis in JSON format.',
      interactionType: {
        name: 'Chapter Analyzer',
        category: 'text_generation',
        systemPrompt: `You are an expert literary analyst. Your task is to analyze book chapters and provide a structured JSON analysis.`,
        // --- NEW, IMPROVED PROMPT ---
        userPrompt: `Analyze the provided book chapter. Your response MUST be a raw JSON object and nothing else.

**CRITICAL INSTRUCTIONS:**
- The entire output must be a single, valid JSON object.
- DO NOT wrap the JSON in Markdown backticks (\`\`\`).
- DO NOT add any text, explanation, or comments before or after the JSON object.
- The response must start with \`{\` and end with \`}\`.

Based on the chapter, provide the following fields in the JSON structure:
1.  **summary**: (String, 2-3 sentences) A concise summary of the chapter.
2.  **keyEvents**: (Array of strings) The most important events that occur.
3.  **characters**: (Array of strings) The characters who appear or are mentioned.
4.  **mood**: (String) The predominant emotional tone (e.g., tense, cheerful, melancholic).
5.  **cliffhanger**: (Boolean) \`true\` if the chapter ends on a cliffhanger, otherwise \`false\`.
6.  **thematicAnalysis**: (String) A brief analysis of the themes explored. Can be an empty string if not applicable.

**JSON STRUCTURE EXAMPLE:**
{
  "summary": "A concise summary of the chapter's main points and actions.",
  "keyEvents": ["An important event happens.", "Another key plot point is revealed."],
  "characters": ["Character A", "Character B"],
  "mood": "Mysterious",
  "cliffhanger": true,
  "thematicAnalysis": "The chapter explores themes of betrayal and redemption."
}`,
        costPerUse: 3,
      },
      contextData: {
        chapterTitle: capitulo.title,
        wordCount: wordCount,
        bookTitle: capitulo.book.title,
        bookGenre: capitulo.book.bookIndex?.genre, // Safer access
      },
      bookContext: {
        id: capitulo.book.id,
        title: capitulo.book.title,
        genre: capitulo.book.bookIndex?.genre, // Safer access
        summary: capitulo.book.bookIndex?.summary, // Safer access
        themes: capitulo.book.bookIndex?.themes, // Safer access
      },
      chapterContext: {
        id: capitulo.id,
        title: capitulo.title,
        content: content,
        summary: `Capítulo: ${capitulo.title}`,
      },
    };

    const aiResult = await sendToAIService(aiRequest);
    let summary, keyEvents, characters, mood, cliffhanger, thematicAnalysis;

    if (aiResult.success) {
      try {
        // --- NEW, ROBUST PARSING LOGIC ---
        let cleanedResponse = aiResult.response.trim();
        const match = cleanedResponse.match(/```json\n([\s\S]*)\n```/);

        if (match) {
          cleanedResponse = match[1];
        } else if (cleanedResponse.startsWith('```') && cleanedResponse.endsWith('```')) {
          cleanedResponse = cleanedResponse.substring(3, cleanedResponse.length - 3).trim();
        }

        const analysis = JSON.parse(cleanedResponse);

        summary = analysis.summary || `Resumen del capítulo "${capitulo.title}"`;
        keyEvents = JSON.stringify(analysis.keyEvents || []);
        characters = JSON.stringify(analysis.characters || []);
        mood = analysis.mood || 'neutral';
        cliffhanger = analysis.cliffhanger === true; // Ensure boolean
        thematicAnalysis = analysis.thematicAnalysis || '';

      } catch (parseError) {
        console.warn('Failed to parse AI response even after cleaning. Using fallback:', parseError);
        // Fallback if parsing still fails
        summary = `Resumen del capítulo "${capitulo.title}" (análisis fallido)`;
        keyEvents = JSON.stringify([]);
        characters = JSON.stringify([]);
        mood = 'neutral';
        cliffhanger = false;
        thematicAnalysis = '';
      }
    } else {
      console.warn('AI analysis failed, using fallback:', aiResult.error);
      // Fallback if AI analysis fails
      summary = `Resumen del capítulo "${capitulo.title}"`;
      keyEvents = JSON.stringify([]);
      characters = JSON.stringify([]);
      mood = 'neutral';
      cliffhanger = false;
      thematicAnalysis = '';
    }

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
        lastAnalyzed: new Date(),
        thematicAnalysis: thematicAnalysis || null,
      },
      create: {
        chapterId,
        bookId: capitulo.book.id,
        content,
        summary,
        keyEvents,
        characters,
        mood,
        cliffhanger,
        wordCount,
        lastAnalyzed: new Date(),
        thematicAnalysis: thematicAnalysis || null,
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      ...indiceActualizado,
      aiAnalysis: aiResult.success ? {
        success: true,
        processingTime: aiResult.processingTime,
        tokenUsed: aiResult.tokenUsed,
        model: aiResult.model,
      } : {
        success: false,
        error: aiResult.error,
      },
    };
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

export const obtenerPersonajesPorCapituloModel = async (chapterId) => {
  try {
    const indices = await prisma.chapterIndex.findMany({
      where: {
        chapterId: chapterId
      },
      select: {
        characters: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Assuming only one chapterIndex per chapterId
    const personajesArray = indices.length > 0
      ? JSON.parse(indices[0].characters)
      : [];

    const personajesObject = personajesArray.reduce((acc, personaje, index) => {
      acc[`personaje${index + 1}`] = personaje;
      return acc;
    }, {});

    return personajesObject;
  } catch (error) {
    throw new Error(`Error al obtener personajes por capítulo: ${error.message}`);
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