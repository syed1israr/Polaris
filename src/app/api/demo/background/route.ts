import { inngest } from '@/inngest/client';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';




export async function POST(){
  await inngest.send({
    name:"demo/generate",
    data :{},
  })

return Response.json({ status : "Started" });
}