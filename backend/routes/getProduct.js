import { Router } from "express";
import dotenv from "dotenv"
import { GenerativeModel, GoogleGenerativeAI,HarmBlockThreshold,HarmCategory } from "@google/generative-ai";
import fs from "node:fs"
import mime from "mime-types";
dotenv.config()

const router = Router();

const stock_key = process.env.ALPHA_KEY 
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

function sliceMonthlyData(data, numberOfPoints) {
    const monthlyData = data["Monthly Time Series"];
    const dates = Object.keys(monthlyData).sort((a, b) => new Date(b) - new Date(a)); // Sort by date descending (most recent first)
    const slicedData = {};
  
    for (let i = 0; i < Math.min(numberOfPoints, dates.length); i++) {
      const date = dates[i];
      slicedData[date] = monthlyData[date];
    }
  
    return { "Meta Data": data["Meta Data"], "Monthly Time Series": slicedData };
  }

async function getstockrecommandation(query) {
    const {
        riskapt,
        potentiallosses,
        totaltime,
        growthtime,
        investmentrisk,
        selectedCompanies,
      } = query;

    let actualdata = "";
    for (const element of selectedCompanies) {
        const stock_url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${element}&apikey=${stock_key}&outputsize=compact`;
        const result = await fetch(stock_url);
        let data = await result.json();
        data = sliceMonthlyData(data,20);
        const stringified_data = JSON.stringify(data);
        actualdata += `Data for ${element.companySymbol}:\n${stringified_data}\n\n`;
      }
    
      actualdata += `
    Risk Appetite: ${riskapt}
    Potential Loss: ${potentiallosses}
    Total Investment Time: ${totaltime}
    Expected Growth Time: ${growthtime}
    Investment Risk Type: ${investmentrisk}
    Query: rank the companies stocks best possible way so that i can choose from that.don't describe much just return the data.
    `;
    
      return await run(actualdata);
}

router.use('/',async(req,res)=>{
    const query = req.body;
    const stockdata = await getstockrecommandation(query);
    res.send(stockdata)
})

export default router