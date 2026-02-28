import { GoogleGenAI } from "@google/genai";
import { Deal } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractDealsFromImage = async (imageBase64: string): Promise<Omit<Deal, 'id'>[]> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analise esta imagem de um encarte de supermercado.
      Extraia todos os produtos, preços e o nome do mercado.
      Se o nome do mercado não estiver visível, tente inferir pelo logo ou retorne "Mercado Desconhecido".
      A data da oferta, se visível, deve ser extraída no formato YYYY-MM-DD. Se não, use a data de hoje.
      
      Retorne APENAS um JSON com a seguinte estrutura:
      {
        "deals": [
          {
            "itemName": "Nome do Produto",
            "price": 10.99,
            "market": "Nome do Mercado",
            "date": "2023-10-27"
          }
        ]
      }
      
      Ignore itens que não tenham preço claro.
      Padronize os nomes dos produtos (ex: "Leite Integral Italac 1L" em vez de apenas "Leite").
    `;

    const response = await ai.models.generateContent({
      model,
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text;
    if (!text) return [];

    const result = JSON.parse(text);
    return result.deals || [];

  } catch (error) {
    console.error("Error extracting deals:", error);
    throw error;
  }
};
