import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
import dotenv from 'dotenv';

dotenv.config();

// Define return type for the generateSummaryFromPDF function
type GenerateSummaryResult = Promise<string>;

/**
 * Generates a summary from a given PDF file using Google Generative AI.
 *
 * @param filePath - Path to the PDF file.
 * @param displayName - Display name for the uploaded file.
 * @param modelName - The Gemini model to use (e.g., "gemini-1.5-flash").
 * @param promptText - Text prompt for the content generation.
 * @returns The generated summary as a promise that resolves to a string.
 */
async function generateSummaryFromPDF(
  filePath: string,
  displayName: string,
  modelName: string,
  promptText: string
): GenerateSummaryResult {
  try {
    // Initialize Google Generative AI with your API key.
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

    // Get the generative model.
    const model: GenerativeModel = genAI.getGenerativeModel({ model: modelName });

    // Upload the file and specify a display name.
    const uploadResponse: UploadFileResponse = await fileManager.uploadFile(filePath, {
      mimeType: "application/pdf",
      displayName: displayName,
    });

    console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

    // Generate content using the uploaded file URI and prompt text.
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: promptText },
    ]);

    // Return the generated response text.
    return result.response.text();
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}

export default generateSummaryFromPDF;
