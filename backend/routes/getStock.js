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

    const result = await chatSession.sendMessage(`${prompt}`);
    return result.response.text();
}

async function getStockData(query) {
    const {
        income,
        savings,
        debt,
        assets,
        investmenttimeline,
        risktolerance,
        investmentgoals,
        timeofinvestment
    } = query

    const query_string = `Give me in points only what's should be my milestones and these are the factors i provide income:${income},savings:${savings},debt:${debt},assets:${assets},investment:${investmenttimeline},risktolerance:${risktolerance},investmentgoals:${investmentgoals},timeofinvestment:${timeofinvestment}`

    return await run(query_string);

}

router.get('/',async(req,res)=>{
    const stock_data = req.body;
    const data = await getStockData(stock_data);
    res.send(data);
})

export default router