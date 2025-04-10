/// <reference lib="webworker" />

import { pipeline } from "@huggingface/transformers";

addEventListener('message', async ({ data }) => {
  console.log('Chat received', data);
  try {
    const generator = await pipeline(
      "text-generation",
      data['model'],
      { dtype: 'q4', progress_callback: generatorProgress }
    );
    const text = `System: ${data['systemPrompt']}\nUser: ${data['prompt']}\nAssistant: `;
    const response = await generator(text, {
      temperature: data['temperature'],
      repetition_penalty: 1.5,
      no_repeat_ngram_size: 2,
      num_beams: 2,
      num_return_sequences: 2,
      top_k: data['topK'],
    });

    postMessage(response);
  } catch (error) {
    console.error("Error running model:", error);
  }
});

function generatorProgress(progress: any) {
  console.log(progress);
}