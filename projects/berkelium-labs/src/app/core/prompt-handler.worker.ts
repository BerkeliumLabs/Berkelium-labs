/// <reference lib="webworker" />

import { pipeline } from '@huggingface/transformers';

const CHAT_TEMPLATE = `{{ bos_token }}\n{%- if messages[0]['role'] == 'system' -%}\n    {%- if messages[0]['content'] is string -%}\n        {%- set first_user_prefix = messages[0]['content'] + '\n\n' -%}\n    {%- else -%}\n        {%- set first_user_prefix = messages[0]['content'][0]['text'] + '\n\n' -%}\n    {%- endif -%}\n    {%- set loop_messages = messages[1:] -%}\n{%- else -%}\n    {%- set first_user_prefix = \"\" -%}\n    {%- set loop_messages = messages -%}\n{%- endif -%}\n{%- for message in loop_messages -%}\n    {%- if (message['role'] == 'user') != (loop.index0 % 2 == 0) -%}\n        {{ raise_exception(\"Conversation roles must alternate user/assistant/user/assistant/...\") }}\n    {%- endif -%}\n    {%- if (message['role'] == 'assistant') -%}\n        {%- set role = \"model\" -%}\n    {%- else -%}\n        {%- set role = message['role'] -%}\n    {%- endif -%}\n    {{ '<start_of_turn>' + role + '\n' + (first_user_prefix if loop.first else \"\") }}\n    {%- if message['content'] is string -%}\n        {{ message['content'] | trim }}\n    {%- elif message['content'] is iterable -%}\n        {%- for item in message['content'] -%}\n            {%- if item['type'] == 'image' -%}\n                {{ '<start_of_image>' }}\n            {%- elif item['type'] == 'text' -%}\n                {{ item['text'] | trim }}\n            {%- endif -%}\n        {%- endfor -%}\n    {%- else -%}\n        {{ raise_exception(\"Invalid content type\") }}\n    {%- endif -%}\n    {{ '<end_of_turn>\n' }}\n{%- endfor -%}\n{%- if add_generation_prompt -%}\n    {{'<start_of_turn>model\n'}}\n{%- endif -%}\n`;

addEventListener('message', async ({ data }) => {
  // console.log('Chat received', data);
  try {
    const generator = await pipeline('text-generation', data['model'], {
      dtype: 'q4',
      /* progress_callback: generatorProgress, */
    });

    const prompt = [
      { role: 'system', content: data['systemPrompt'] },
      { role: 'user', content: data['prompt'] },
    ];

    if (!generator.tokenizer.chat_template) {
      generator.tokenizer.chat_template = CHAT_TEMPLATE;
      generator.tokenizer.apply_chat_template(prompt, {
        tokenize: false,
      });
      // console.log('Chat template: ', generator.tokenizer.chat_template);
    }

    const response = await generator(prompt, {
      temperature: data['temperature'],
      max_new_tokens: data['maxNewTokens'],
      repetition_penalty: 1.5,
      no_repeat_ngram_size: 2,
      num_beams: 2,
      num_return_sequences: 2,
      top_k: data['topK'],
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
