import { Router } from "express";
import dotenv from "dotenv"
import { GenerativeModel, GoogleGenerativeAI,HarmBlockThreshold,HarmCategory } from "@google/generative-ai";
import fs from "node:fs"
import mime from "mime-types";

const router = Router()

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel(
    {
        model: "gemini-2.0-flash"
    }
)

const generativeConfig = {
    temperature: 1,
    topP : 0.95,
    topK : 40,
    maxOutputTokens: 8192,
    responseModalities: [],
    responseMimeType: "text/plain",
};

async function run(prompt){
    const chatSession = model.startChat({
        generativeConfig,
        history: [],
    })
    console.log("from chatbox",prompt)
    const result = await chatSession.sendMessage(`${prompt}`);
    console.log("response", result.response.text);
    return result.response.text();
}

export default run;