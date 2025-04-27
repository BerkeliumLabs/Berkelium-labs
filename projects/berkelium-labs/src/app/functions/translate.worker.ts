/// <reference lib="webworker" />

import { pipeline } from "@huggingface/transformers";

addEventListener('message', async ({ data }) => {
  const { content, model } = data;
  try {
    const translator = await pipeline('translation', model);
    const response = await translator(content);
    postMessage(response);
  } catch (error) {
    console.log('Error in translation:', error);
    postMessage({ error: 'Error in translation' });
  }
});
