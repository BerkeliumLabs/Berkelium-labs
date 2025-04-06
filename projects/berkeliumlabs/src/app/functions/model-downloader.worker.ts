/// <reference lib="webworker" />

import {
  pipeline,
  PipelineType,
  ProgressCallback,
  ProgressInfo,
} from '@huggingface/transformers';

addEventListener('message', ({ data }) => {
  downloadModel(data, progressCallback);
});

async function downloadModel(
  modelId: string,
  progressCallback?: ProgressCallback,
  pipelineType: PipelineType = 'text-generation'
): Promise<void> {
  try {
    const downloadPipeline = await pipeline(pipelineType, modelId, {
      progress_callback: progressCallback,
      dtype: 'q4',
    });
    postMessage(true);
  } catch (error) {
    console.error(`Error downloading model:\n${error}`);
    postMessage(false);
  }
}

function progressCallback(progress: ProgressInfo) {
  // progress status: initiate -> download -> progress -> done
  postMessage(progress);
}
