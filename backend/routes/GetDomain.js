import { Router } from "express";

const router = Router();

router.get('/givetest',(req,res)=>{
    res.send("from here we are going to send the test questions and if there is also option to different language in frontend and if user chooses those then send also to the backend.");
})

export default router