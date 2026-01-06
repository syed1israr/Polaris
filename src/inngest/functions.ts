import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}! this one is modified, what is Inngest ? how to better use it ? and how tf people are using tools like convex, inngest, code rabbit and creating industry level projects ? where to learn all of this stuff ? how to code and plan projects like n8n clone or cursor EDtor ?` };
  },
);




export const demoGenertate = inngest.createFunction(
  { id : "demo-genertate"},
  { event : "demo/generate"},
  async({  step}) =>{
    await step.run("generate-text",async()=>{
      return await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'what is Inngest ? how to better use it ? and how tf people are using tools like convex, inngest, code rabbit and creating industry level projects ? where to learn all of this stuff ? how to code and plan projects like n8n clone or cursor EDtor ?',
    });
    })
  }
)