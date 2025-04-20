/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { searchTerm, modelList, pipeline } = data;

    if (searchTerm === '' || searchTerm === undefined) {
      const filteredList = filterPipeline(pipeline, modelList);
      postMessage(filteredList);
    } else {
      let filteredList = modelList.filter((item: BkHuggingfaceModelData) => {
        if (item.modelId?.toLowerCase().includes(searchTerm.toLowerCase())) {
          return true;
        } else {
          return false;
        }
      });

      filteredList = filterPipeline(pipeline, filteredList);

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