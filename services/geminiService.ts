import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getDessertRecommendation = async (mood: string, products: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Você é um expert sommelier de sobremesas para um app de delivery de alto padrão chamado "Creamy", que vende Pudins e Mousses.
        
        O usuário está se sentindo: "${mood}".
        
        Produtos disponíveis: ${products}.

        Com base no humor, recomende UM produto específico da lista e explique o porquê em uma frase curta e apetitosa. 
        Foque na textura, notas de sabor e conforto.
        Responda em PORTUGUÊS.
        Formato: "Recomendação: [Nome do Produto] - [Motivo]"
      `,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Experimente nosso Pudim de Leite Clássico, nunca falha!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nosso Pudim de Leite Clássico é sempre uma boa escolha!";
  }
};