import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import fs from "fs";

export const getModelGemini = async (req, res) => {
  try {
    const { apiKey } = req.params;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    
    const response = await axios.get(url);
    
    const imageModels = response.data.models.filter(model => 
      model.supportedGenerationMethods.includes("generateContent")
    );

    res.status(200).json(imageModels); 
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to retrieve models" });
  }
};

export const postImgToHtml = async (req, res) => {
    try {
      const { apiKey } = req.params;
      console.log(req.file)
      // Check if image was uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }
      
      // Check supported image formats
      const supportedFormats = ['image/jpeg', 'image/png'];
      if (!supportedFormats.includes(req.file.mimetype)) {
        return res.status(400).json({ 
          error: "Unsupported image format. Please upload JPG or PNG images only." 
        });
      }
      
      // Read uploaded file as base64
      const filePath = req.file.path;
      const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
      
      // Initialize Gemini API with provided key
      const ai = new GoogleGenAI({ apiKey });
      
      // Create prompt based on image content type analysis
      const contents = [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image,
          },
        },
        { 
          text: "First determine if this image shows a webpage design, " +
        "a webpage drawing/sketch, or a class diagram/UML. " +
        
        "If it's a webpage design, provide ONLY the complete HTML code with Tailwind CSS classes " +
        "that would recreate this webpage design with proper responsive behavior. " +
        
        "If it's a webpage drawing/sketch, provide ONLY the production-ready HTML code with Tailwind CSS " +
        "that transforms this sketch into a professional layout. Pay special attention to: " +
        "- Convert drawn rectangles to appropriate semantic HTML5 tags (nav, header, main, section, article, aside, footer) " +
        "- Use proper spacing with Tailwind's padding/margin utilities (p-4, my-8, etc.) " +
        "- Implement responsive design with Tailwind's breakpoint classes (sm:, md:, lg:) " +
        "- Create professional typography with proper font sizes, weights and spacing " +
        "- Maintain proper alignment and proportion from the sketch " +
        "- Add subtle professional touches like shadows, rounded corners, and transitions where appropriate " +
        "- Use a complementary color scheme based on any color hints in the sketch " +
        "Include NOTHING but the HTML/Tailwind code. " +
        
        "If it's a class diagram or UML, provide ONLY the HTML and Tailwind CSS code that would " +
        "visually represent this diagram with clean box styling, proper connecting lines, and clear typography. " +
        
        "Return ONLY the complete HTML code with no explanations, introductions, or any other text."
        },
      ];
      
      // Generate content with Gemini
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });
      
      // Clean up the uploaded file
      fs.unlinkSync(filePath);
      
      // Send only the HTML response
      res.send(response.text);
      
    } catch (error) {
      console.error("Error processing image:", error);
      res.status(500).json({ error: "Failed to process image", details: error.message });
    }
  }