import { generateText } from "ai";
import { inngest } from "./client";
import { google } from "@ai-sdk/google";
import { firecrawl } from "@/lib/firecrawl";

/* ---------------- HELLO WORLD FUNCTION ---------------- */

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");

    return {
      message: `Hello ${event.data.email}! This one is modified. 
What is Inngest? How to use it better? 
How are people using Convex, Inngest, CodeRabbit to build industry-level projects?
Where do they learn all this?`
    };
  }
);
export const demoError = inngest.createFunction(
  { id: "demo-error" },
  { event: "demo/error" },
  async ({ event, step }) => {
    throw new Error("Inngest Error : background Job failed !");
  }
);

/* ---------------- DEMO GENERATE FUNCTION ---------------- */

const URL_REGEX = /https?:\/\/[^\s]+/g;

export const demoGenerate = inngest.createFunction(
  { id: "demo-generate" },
  { event: "demo/generate" },
  async ({ event, step }) => {
    const { prompt } = event.data as { prompt: string };

    const urls = await step.run("extract-urls", async () => {
      return prompt.match(URL_REGEX) ?? [];
    }) as string[];

    const scrapedContent = await step.run("scrape-urls", async () => {
        const results = await Promise.all(
          urls.map(async (  url) =>{
            const res = await firecrawl.scrape(url,{
                formats : ["markdown"]
            });
            return res.markdown ?? null;
          })
        )

      return results.filter(Boolean).join("\n\n");
    });

    const finalPrompt = scrapedContent
      ? `Context:\n${scrapedContent}\n\nQuestion:\n${prompt}`
      : prompt;

    return await step.run("generate-text", async () => {
      return generateText({
        model: google("gemini-2.0-flash"),
        prompt: finalPrompt,
         experimental_telemetry:{
          isEnabled:true,
          recordInputs:true,
          recordOutputs:true
        }
      });
    });
  }
);
