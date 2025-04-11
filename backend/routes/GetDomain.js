import { Router } from "express";

const router = Router();

router.get('/givetest',(req,res)=>{
    res.send("from here we are going to send the test questions");
})

export default router