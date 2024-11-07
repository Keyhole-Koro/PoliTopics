var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import dotenv from 'dotenv';
dotenv.config();
/**
 * Generates a summary from a given PDF file using Google Generative AI.
 *
 * @param modelName - The Gemini model to use (e.g., "gemini-1.5-flash").
 * @param promptText - Text prompt for the content generation.
 * @returns The generated summary as a promise that resolves to a string.
 */
function generateSummary(promptText) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Initialize Google Generative AI with your API key.
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
            // Get the generative model.
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            // Generate content using the uploaded file URI and prompt text.
            const result = yield model.generateContent([
                { text: promptText },
            ]);
            // Return the generated response text.
            return result.response.text();
        }
        catch (error) {
            console.error("Error generating summary:", error);
            throw error;
        }
    });
}
export default generateSummary;
