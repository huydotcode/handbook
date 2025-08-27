import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export async function getResponseFromGemini({ message }: { message: string }) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent([message]);

    const response = result.response.text;
    return response;
}
