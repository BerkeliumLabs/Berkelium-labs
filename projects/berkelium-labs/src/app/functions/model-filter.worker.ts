/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { searchTerm, modelList, pipeline } = data;

    if (searchTerm === '' || searchTerm === undefined) {
      const filteredList = filterPipeline(pipeline, modelList);
      postMessage(filteredList);
    } else {
      const filteredPipeList = filterPipeline(pipeline, modelList);

      const filteredList = filteredPipeList.filter((item: BkHuggingfaceModelData) => {
        if (item.modelId?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });

      postMessage(filteredList);
    }
});

function filterPipeline(pipeline: string, modelList: BkHuggingfaceModelData[]) {
  const filteredList = modelList.filter(
    (item: BkHuggingfaceModelData) =>
      item.pipeline_tag == pipeline.toLowerCase()
  );

  return filteredList;
}