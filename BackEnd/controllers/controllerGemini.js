const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyA9WkGlbsQE5Rpp12SbH5KZoGT_E8Bxvko");

const gemini =async (req,res)=> {

    const textMedecin=req.body;

    try {
        const generationConfig = {
            stopSequences: ["red"],
            maxOutputTokens: 200,
            temperature: 0.9,
            topP: 0.1,
            topK: 16,
          };
          
          // The Gemini 1.5 models are versatile and work with most use cases
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash",  generationConfig });
      // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
      //const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    
      const prompt = toString.textMedecin;
    
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      res.send(text);
      console.log(text);
    } catch (error) {
        console.error("erreur dans le module gemini",error);
        
    }
}

module.exports = {gemini}