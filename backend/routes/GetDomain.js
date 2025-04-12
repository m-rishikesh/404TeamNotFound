import { Router } from "express";
import chatbox4yt from "./chatbox4yt.js"
const router = Router();

let personalizeddata;

router.get('/givetest',async (req,res)=>{
    const {testdata} = req.body // this will take the test data.
    const {explevel,investmentgoals,riskapetite,interestedarea,investmentstyle,marketknowledge,timeavailability,platformused,educationalbackground,languagepreferences,} = req.body
    
    personalizeddata = `experience level : ${explevel},investmentgoals : ${investmentgoals}, riskapetite: ${riskapetite}, investmentstyle: ${investmentstyle}, marketknowledge: ${marketknowledge}, timeavailability: ${timeavailability}, platformused : ${platformused}, educationalbackground: ${educationalbackground}, languagepreferences: ${languagepreferences} interesteddomain: ${interestedarea}`

    console.log(testdata)
    res.send(await chatbox4yt(testdata))

})

router.get('/personalizedtest',async(req,res)=>{
    const {user_query} = req.body
    const actual_data = personalizeddata + user_query + "give the personalized response according to the user knowledge like if you think according to the personalized data he is beginner tell him in newbie style keeping professionalism intact in the result and answer should be short as much as possible and crisp and always revoke the query if asked other than finance. "
    res.send(await chatbox4yt(actual_data))
})
export default router