import { Router } from "express";
import {google} from "googleapis";
import dotenv from "dotenv";
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

export default router;