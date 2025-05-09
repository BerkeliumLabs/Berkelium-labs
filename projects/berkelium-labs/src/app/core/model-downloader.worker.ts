/// <reference lib="webworker" />

import {
  pipeline,
  PipelineType,
  ProgressCallback,
  ProgressInfo,
} from '@huggingface/transformers';

addEventListener('message', ({ data }) => {
  downloadModel(data['modelId'], progressCallback, data['pipeline']);
});

async function downloadModel(
  modelId: string,
  progressCallback?: ProgressCallback,
  pipelineType: PipelineType = 'text-generation'
): Promise<void> {
  try {
    await pipeline(pipelineType, modelId, {
      progress_callback: progressCallback,
      ...(pipelineType === 'text-generation' && { dtype: 'q4' }),
    });
    postMessage(true);
  } catch (error) {
    console.error(`Error downloading model:`, error);
    postMessage(false);
  }
}

function progressCallback(progress: ProgressInfo) {
  // progress status: initiate -> download -> progress -> done
  postMessage(progress);
}
