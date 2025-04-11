import { Router } from "express";
import {google} from "googleapis";
import dotenv from "dotenv";
import chatbox4yt from "./chatbox4yt.js"
dotenv.config();

const yt_api_key = process.env.YT_VIDS_API;

const router = Router();

const youtube = google.youtube({
    version:"v3",
    auth : yt_api_key,
})

async function get10ytquery(query){
    const res = await youtube.search.list({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: 10,
    });
    const responseyt =  res.data
    return responseyt.items.map((item)=>{
        return {
            title:item.snippet.title,
            thumbnail:item.snippet.thumbnails.high.url,
            link: `https://www.youtube.com/watch?v=${item.id.videoId}`
        };
    })
}

router.get('/',async (req,res)=>{
    const query = req.query.q;
    res.send(await get10ytquery(query));
})

router.get('/chatquery',async (req,res)=>{
    const {chatquery} = req.body;
    const actual_query = `The user is learning about financial topics like Mutual Funds, SIPs, and Stock Investing.Explain the following question in very simple terms, like you're teaching a beginner.Use a friendly tone.And if the question somewhere unrelated to finance just revoke it and tell the user to ask for financial question only Question: ${chatquery}`
    const response = await chatbox4yt(actual_query);
    res.send(response);
})

export default router;