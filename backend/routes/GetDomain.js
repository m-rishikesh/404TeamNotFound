import { Router } from "express";
import chatbox4yt from "./chatbox4yt.js"
const router = Router();

let personalizeddata;

router.post('/givetest',async (req,res)=>{
    const {domain, question, answers} = req.body // this will take the test data.
    // const {explevel,investmentgoals,riskapetite,interestedarea,investmentstyle,marketknowledge,timeavailability,platformused,educationalbackground,languagepreferences,} = req.body

    personalizeddata = domain + question + answers
    console.log(personalizeddata);
    res.send("thanks for responding");

})

router.post('/personalizedtest', async (req, res) => {
    const { user_query } = req.body;
  
    const prompt = `
    ${personalizeddata}
    
    User Query: "${user_query}"
    
    Based on the user's responses above, answer the query in a way that fits their knowledge level (e.g., beginner = simpler, professional tone).
    If the query is not related to finance, politely decline.
    Keep your answer short and crisp.
    `;
  
    try {
      const response = await chatbox4yt(prompt); // This should return the AI's response text
      res.send({ reply: response });
    } catch (err) {
      console.error('AI request error:', err);
      res.status(500).send("Error generating AI response");
    }
  });
export default router