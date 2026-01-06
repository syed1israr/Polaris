import { google } from '@ai-sdk/google';
import { generateText } from 'ai';




export async function POST(){
   const res = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'explain n8n code editor',
});

return Response.json({ res });
}