import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// API key must be set in process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'mock-key-if-missing' });

export const getRecyclingInsights = async (totalBottles: number, totalXRP: number): Promise<string> => {
  if (!process.env.API_KEY) return "Please configure your API Key to get AI insights on your recycling impact.";

  try {
    const prompt = `
      I am running a recycling gamification project in Botswana called xrp.co.bw.
      Current stats:
      - Total Bottles Recycled: ${totalBottles}
      - Total XRP Crypto Accumulated: ${totalXRP.toFixed(2)}
      
      Provide a short, motivating paragraph (max 50 words) for the participants about the environmental impact of these bottles and the potential future value of their crypto assets. Use an encouraging tone.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Keep up the great work! Every bottle counts towards a greener Botswana.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great job on recycling! Continue to grow your XRP portfolio.";
  }
};

export const getXRPForecast = async (): Promise<string> => {
  if (!process.env.API_KEY) return "AI Forecast unavailable without API Key.";
  
  try {
    const prompt = `
      Act as a financial analyst for a gamified recycling project.
      Explain briefly (in 2 bullet points) why holding crypto assets like XRP over a 24-month period might be a good strategy for small contributors in a developing economy like Botswana.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Long-term holding allows you to ride out market volatility.";
  } catch (error) {
    return "Market data unavailable.";
  }
}
