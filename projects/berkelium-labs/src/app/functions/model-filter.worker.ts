/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { searchTerm, modelList } = data;
  if (searchTerm === '' || searchTerm === undefined) {
    postMessage(modelList);
  } else {
    const filteredList = modelList.filter((item: BkHuggingfaceModelData) => {
      if (item.modelId?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });

    postMessage(filteredList);
  }
});
