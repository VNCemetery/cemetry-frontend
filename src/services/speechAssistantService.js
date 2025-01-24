import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI("AIzaSyD4haug3apkX62bIAYA2NfKp2cMeP9VRHs");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateContent = async (prompt) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const processAudioContent = async (base64Audio) => {
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/mp3",
          data: base64Audio,
        },
      },
      { text: "Please transcribe and summarize the audio in Vietnamese." },
    ]);
    return result.response.text();
  } catch (error) {
    console.error("Error processing audio:", error);
    throw error;
  }
};
