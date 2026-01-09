import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a PowerShell detection script for Intune based on natural language description.
 */
export const generateDetectionScript = async (description: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY");
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a concise PowerShell script to be used as a Detection Rule for Microsoft Intune. 
      
      Requirement: ${description}
      
      The script must:
      1. Check for the condition.
      2. Write "Detected" to host if found.
      3. Exit with code 0 if found.
      4. Exit with code 1 if not found.
      
      Output ONLY the PowerShell code. Do not wrap in markdown backticks.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep reasoning for simple scripts
      }
    });

    return response.text || '# Error generating script';
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * Analyzes an error log to suggest a fix.
 */
export const analyzeErrorLog = async (logMessage: string): Promise<string> => {
  if (!apiKey) {
    return "API Key missing. Cannot analyze logs.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `I am using the Microsoft Graph API and IntuneWinAppUtil.exe to upload apps to Intune.
      I received this error: "${logMessage}"
      
      Explain what went wrong and suggest a fix in 2 sentences.`,
    });
    return response.text || 'Analysis failed.';
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Unable to contact AI service.";
  }
};