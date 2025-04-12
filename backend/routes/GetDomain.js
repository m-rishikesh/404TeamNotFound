import { Router } from "express";
import chatbox4yt from "./chatbox4yt.js"
const router = Router();

router.get('/givetest',async (req,res)=>{
    const {testdata} = req.body // this will take the test data.
    console.log(testdata)
    res.send(await chatbox4yt(testdata))

})

export default router