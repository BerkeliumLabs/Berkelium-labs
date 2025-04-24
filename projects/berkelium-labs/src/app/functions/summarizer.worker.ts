/// <reference lib="webworker" />

import { pipeline } from "@huggingface/transformers";

addEventListener('message', async ({ data }) => {
  const { content, model } = data;
  try {
    const summarizer = await pipeline('summarization', model);
    const summary = await summarizer(content);
    postMessage(summary);
  } catch (error) {
    
  }
});
