/// <reference lib="webworker" />

import { pipeline } from '@huggingface/transformers';

addEventListener('message', async ({ data }) => {
  // console.log('Chat received', data);
  try {
    const generator = await pipeline('text-generation', data['model'], {
      dtype: 'q4',
      /* progress_callback: generatorProgress, */
    });

    const prompt = [
      { role: "system", content: data['systemPrompt'] },
      { role: "user", content: data['prompt'] },
    ];

    const response = await generator(prompt, {
      temperature: data['temperature'],
      max_new_tokens: data['maxNewTokens'],
      repetition_penalty: 1.5,
      no_repeat_ngram_size: 2,
      num_beams: 2,
      num_return_sequences: 2,
      top_k: data['topK']
    });

    postMessage(response);
  } catch (error) {
    postMessage(`Error running model: ${error}`);
    console.error('Error running model:', error);
  }
});

/* function generatorProgress(progress: any) {
  console.log(progress);
} */
