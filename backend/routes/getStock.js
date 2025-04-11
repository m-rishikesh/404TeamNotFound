import { Router } from "express";
import {OpenAI} from "openai";
import dotenv from "dotenv"

const router = Router()

dotenv.config();

const openai_key = process.env.OPENAI_KEY

const chatai = new OpenAI({
    apiKey : openai_key
})

async function getStockData(prompt) {
    const {prompt_content} = prompt;
    const chat = await chatai.chat.completions.create({
        model:"gpt-3.5-turbo",
        messages:[
            {role:"user",content:prompt_content}
        ],
        temperature:0.7
    });

    return chat.choices[0].message.content;
}

router.get('/',async(req,res)=>{
    const stock_data = req.body;
    const data = await getStockData(stock_data);
    res.send(data);
})

export default router