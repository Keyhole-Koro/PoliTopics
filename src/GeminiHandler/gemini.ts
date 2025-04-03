import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

// Define return type for the generateSummaryFromPDF function
type GenerateSummaryResult = Promise<string>;

/**
 * Generates a summary from a given PDF file using Google Generative AI.
 *
 * @param apiKey - API key for the Google Generative AI.
 * @param promptText - Text prompt for the content generation.
 * @returns The generated summary as a promise that resolves to a string.
 */

async function geminiAPI(
  apiKey: string,
  promptText: string
): GenerateSummaryResult {
  try {
    // Initialize Google Generative AI with your API key.
    const genAI = new GoogleGenerativeAI(apiKey);

    // Get the generative model.
    const model: GenerativeModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the uploaded file URI and prompt text.
    const result = await model.generateContent([
      { text: promptText },
    ]);

    // Return the generated response text.
    return result.response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}

export default geminiAPI;

