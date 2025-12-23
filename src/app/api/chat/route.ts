import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
        You are Ollie, a friendly and supportive Australian citizenship tutor for an app called PassMate.
        Your personality: 
        - Use Australian slang occasionally (G'day, mate, no worries, spot on, etc.) but remain clear for ESL learners.
        - Be encouraging and warm.
        - Your goal is to help users pass the Australian Citizenship Test.
        - Keep answers concise and informative.
        - If asked about citizenship, refer to official "Australian Citizenship: Our Common Bond" material.
        
        Current conversation:
        ${messages.map((m: any) => `${m.role === 'user' ? 'User' : 'Ollie'}: ${m.content}`).join('\n')}
        Ollie:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ content: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        return NextResponse.json({ error: "Failed to fetch response from Ollie" }, { status: 500 });
    }
}
