export function buildChapterContext(chapterAnalyses) {
    const totalChapters = chapterAnalyses.length;
    const totalWordCount = chapterAnalyses.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);
    const averageWordCount = totalChapters > 0 ? Math.round(totalWordCount / totalChapters) : 0;
    const chaptersWithCliffhangers = chapterAnalyses.filter(ch => ch.cliffhanger).length;
    
    let result = `Chapter Context\n`;
    result += `- Total Chapters: ${totalChapters}\n`;
    result += `- Average Word Count: ${averageWordCount} words\n`;
    result += `- Chapters with Cliffhangers: ${chaptersWithCliffhangers}\n\n`;
  
    chapterAnalyses.forEach((chapter) => {
      result += `---\n`;
      result += `**${chapter.title}**\n`;
      result += `${chapter.summary}\n\n`;
      result += `- Key Events: ${chapter.keyEvents?.join('; ') || 'None'}\n`;
      result += `- Characters: ${chapter.characters?.join(', ') || 'None'}\n`;
      result += `- Mood: ${chapter.mood || 'N/A'}\n`;
      result += `- Cliffhanger: ${chapter.cliffhanger ? 'Yes' : 'No'}\n`;
      result += `- Thematic Analysis: ${chapter.thematicAnalysis || 'N/A'}\n`;
      result += `- Word Count: ${chapter.wordCount || 0} words\n\n`;
    });
    return result;
  }
  
  export function cleanJsonString(str) {
    if (!str) return "{}"; // default empty object if undefined/null
    return str
      .replace(/```json|```/gi, "") // remove code block markers
      .trim();
  }
  
 export function parseToJson(str) {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error("Invalid JSON from AI:", error);
      return {}; // return empty object instead of crashing
    }
  }
  
