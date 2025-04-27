/// <reference lib="webworker" />

import { pipeline } from "@huggingface/transformers";

addEventListener('message', async ({ data }) => {
  const { content, model } = data;
  try {
    const generator = await pipeline('text2text-generation', model);
    const response = await generator(content);
    postMessage(response);
  } catch (error) {
    console.log('Error in summarization:', error);
    postMessage({ error: 'Error in summarization' });
  }
});
