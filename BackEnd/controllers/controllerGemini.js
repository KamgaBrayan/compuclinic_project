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

const gemini2 = async (req, res) => {
    // Assurez-vous que req.body contient bien le texte du prompt.
    // Si le frontend envoie { "promptText": "le texte..." }, alors ce sera req.body.promptText
    const { promptText } = req.body; // Ou le nom de la clé que le frontend enverra

    if (!promptText) {
        return res.status(400).json({ message: "Le prompt est manquant dans le corps de la requête." });
    }

    try {
        const generationConfig = {
            // stopSequences: ["red"], // Peut-être à ajuster ou retirer
            maxOutputTokens: 200,
            temperature: 0.9,
            topP: 0.1,
            topK: 16,
        };
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });
    
        // const prompt = toString.textMedecin; // Ancien code
        const result = await model.generateContent(promptText); // Utiliser promptText
        const response = await result.response;
        const text = response.text();
        res.status(200).send(text); // Envoyer avec un statut OK
        console.log("Gemini response:", text);
    } catch (error) {
        console.error("Erreur dans le module gemini:", error);
        res.status(500).json({ message: "Erreur lors de la génération de contenu par Gemini", error: error.message });
    }
}

module.exports = {gemini, gemini2}; // Exporter les deux fonctions