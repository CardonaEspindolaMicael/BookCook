import pkg from '@prisma/client';
const {PrismaClient} = pkg;
const prisma = new PrismaClient();

// Check AI usage and credits
export const checkAIUsage = async (userId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // "2024-01" format
    
    let aiUsage = await prisma.aIUsage.findUnique({
      where: {
        userId_month: {
          userId,
          month: currentMonth
        }
      }
    });

    if (!aiUsage) {
      // Create new monthly usage record
      const resetDate = new Date();
      resetDate.setMonth(resetDate.getMonth() + 1);
      resetDate.setDate(1);
      resetDate.setHours(0, 0, 0, 0);

      aiUsage = await prisma.aIUsage.create({
        data: {
          userId,
          month: currentMonth,
          totalInteractions: 0,
          tokensUsed: 0,
          creditsUsed: 0,
          monthlyLimit: 100, // Default free tier limit
          remainingCredits: 100,
          resetAt: resetDate
        }
      });
    }

    return {
      currentUsage: aiUsage.totalInteractions,
      monthlyLimit: aiUsage.monthlyLimit,
      remainingCredits: aiUsage.remainingCredits,
      hasCredits: aiUsage.remainingCredits > 0,
      resetDate: aiUsage.resetAt
    };
  } catch (error) {
    console.error('Error checking AI usage:', error);
    throw error;
  }
};


export const createInteractionType = async (data) => {
  try {
    return await prisma.interactionType.create({
      data
    });
  } catch (error) {
    console.error("Error creating InteractionType:", error);
    throw error;
  }
};

// Create AI interaction record
export const createAIInteraction = async (interactionData) => {
  try {
    const interaction = await prisma.aIInteraction.create({
      data: {
        userId: interactionData.userId,
        bookId: interactionData.bookId,
        chapterId: interactionData.chapterId,
        aiAssistantId: interactionData.aiAssistantId,
        interactionTypeId: interactionData.interactionTypeId,
        userQuery: interactionData.userQuery,
        contextData: interactionData.contextData,
        aiResponse: interactionData.aiResponse,
        tokenUsed: interactionData.tokenUsed,
        processingTime: interactionData.processingTime,
        satisfaction: interactionData.satisfaction,
        wasUseful: interactionData.wasUseful
      },
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
    });

    return interaction;
  } catch (error) {
    console.error('Error creating AI interaction:', error);
    throw error;
  }
};

// Update AI interaction (for ratings and feedback)
export const updateAIInteraction = async (interactionId, updateData) => {
  try {
    const interaction = await prisma.aIInteraction.update({
      where: { id: interactionId },
      data: updateData,
      include: {
        interactionType: true,
        aiAssistant: true
      }
    });

    return interaction;
  } catch (error) {
    console.error('Error updating AI interaction:', error);
    throw error;
  }
};

// Update AI usage (increment tokens and interactions)
export const updateAIUsage = async (userId, tokensUsed, creditsUsed) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const aiUsage = await prisma.aIUsage.update({
      where: {
        userId_month: {
          userId,
          month: currentMonth
        }
      },
      data: {
        totalInteractions: {
          increment: 1
        },
        tokensUsed: {
          increment: tokensUsed
        },
        creditsUsed: {
          increment: creditsUsed
        },
        remainingCredits: {
          decrement: creditsUsed
        }
      }
    });

    return aiUsage;
  } catch (error) {
    console.error('Error updating AI usage:', error);
    throw error;
  }
};

// Get interaction types (AI writing assistant options)
export const getAllInteractionType = async (interactionTypeId = null) => {
  try {
    if (interactionTypeId) {
      const interactionType = await prisma.interactionType.findUnique({
        where: { id: interactionTypeId },
        include: {
          aiInteractions: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      });
      return interactionType;
    } else {
      const interactionTypes = await prisma.interactionType.findMany({
        where: { isActive: true },
        orderBy: { category: 'asc' }
      });
      return interactionTypes;
    }
  } catch (error) {
    console.error('Error getting interaction types:', error);
    throw error;
  }
};


// Get all interaction types (no nested interactions)
export const getInteractionTypes = async () => {
  try {
    const interactionTypes = await prisma.interactionType.findMany({
      where: { isActive: true },
      orderBy: { category: 'asc' }
    });
    return interactionTypes;
  } catch (error) {
    console.error('Error getting interaction types:', error);
    throw error;
  }
};
// Get book index for AI context
export const getBookIndex = async (bookId) => {
  try {
    const bookIndex = await prisma.bookIndex.findUnique({
      where: { bookId },
      include: {
        book: {
          select: {
            id: true,
            title: true,
            description: true,
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

    return bookIndex;
  } catch (error) {
    console.error('Error getting book index:', error);
    throw error;
  }
};

// Get chapter index for AI context
export const getChapterIndex = async (chapterId) => {
  try {
    const chapterIndex = await prisma.chapterIndex.findUnique({
      where: { chapterId },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            content: true,
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

    return chapterIndex;
  } catch (error) {
    console.error('Error getting chapter index:', error);
    throw error;
  }
};

// Update book index when content changes
export const updateBookIndex = async (bookId, newContent) => {
  try {
    // This would typically involve AI analysis of the new content
    // For now, we'll just update the lastAnalyzed timestamp
    const bookIndex = await prisma.bookIndex.update({
      where: { bookId },
      data: {
        lastAnalyzed: new Date(),
        analysisVersion: "1.1"
      }
    });

    return bookIndex;
  } catch (error) {
    console.error('Error updating book index:', error);
    throw error;
  }
};

// Update chapter index when content changes
export const updateChapterIndex = async (chapterId, newContent) => {
  try {
    // This would typically involve AI analysis of the new content
    const chapterIndex = await prisma.chapterIndex.update({
      where: { chapterId },
      data: {
        lastAnalyzed: new Date(),
        content: newContent,
        wordCount: newContent.split(/\s+/).filter(word => word.length > 0).length
      }
    });

    return chapterIndex;
  } catch (error) {
    console.error('Error updating chapter index:', error);
    throw error;
  }
};

// Create notification
export const createNotification = async (notificationData) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: notificationData.userId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        bookId: notificationData.bookId,
        isRead: false
      }
    });

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get user's AI interaction history
export const getUserAIHistory = async (userId, limit = 20) => {
  try {
    const interactions = await prisma.aIInteraction.findMany({
      where: { userId },
      include: {
        interactionType: true,
        aiAssistant: true,
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
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    return interactions;
  } catch (error) {
    console.error('Error getting user AI history:', error);
    throw error;
  }
};

export const createAIUsage = async (usageData,userId) => {
  try {
    const usage = await prisma.aIUsage.create({
      data: {
        userId: userId,
        month: usageData.month,
        totalInteractions: usageData.totalInteractions,
        tokensUsed: usageData.tokensUsed,
        creditsUsed: usageData.creditsUsed,
        monthlyLimit: usageData.monthlyLimit,
        remainingCredits: usageData.remainingCredits,
        resetAt: new Date(usageData.resetAt)
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });
    return usage;
  } catch (error) {
    console.error("Error creating AI usage:", error);
    throw error;
  }
};

// Get AI usage statistics
export const getAIUsageStats = async (userId) => {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);
    
    const [currentUsage, totalInteractions, averageSatisfaction] = await Promise.all([
      prisma.aIUsage.findUnique({
        where: {
          userId_month: {
            userId,
            month: currentMonth
          }
        }
      }),
      prisma.aIInteraction.count({
        where: { userId }
      }),
      prisma.aIInteraction.aggregate({
        where: { 
          userId,
          satisfaction: { not: null }
        },
        _avg: { satisfaction: true }
      })
    ]);

    return {
      currentUsage,
      totalInteractions,
      averageSatisfaction: averageSatisfaction._avg.satisfaction || 0
    };
  } catch (error) {
    console.error('Error getting AI usage stats:', error);
    throw error;
  }
}; 