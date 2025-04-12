import express, { Router } from "express"
// import { GoogleGenerativeAI, } from '@google/generative-ai'
import GetDomain from "./routes/GetDomain.js"
import sendToGemini from "./routes/sendToGemini.js"
import top10ytvids from "./routes/top10ytvids.js"
import getStocks from "./routes/getStock.js"
import getProduct from "./routes/getProduct.js"
import cors from "cors"
const app = express();
const allowedorigin = [
    'http://localhost:5173',
    'https://onrender.xyz'
]


app.use(cors({
    origin : allowedorigin
}))


app.use(express.json());

app.get('/',(req,res)=>{
    res.send("welcome to 404TeamNotFound");
})

app.use('/getDomain',GetDomain) //used to give the test to the user when it comes first time.
app.use('/getQuery',sendToGemini);
app.use('/top10ytquery',top10ytvids);
app.use('/getstocks',getStocks);
app.use('/getProduct',getProduct);


app.listen(8080,(req,res)=>{
    console.log("server is running at port 8080");
})