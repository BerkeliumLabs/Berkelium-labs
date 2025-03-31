export const DOWNLOAD_MODEL_DIALOG_TEMPLATE = `<div class="p-4 border-b border-gray-700 flex justify-between items-center">
    <h2 class="text-lg font-semibold text-gray-200">Download Model</h2>
    <button class="flex justify-center items-center text-gray-200 hover:text-gray-50 cursor-pointer" id="close-dialog-btn" aria-label="Close">
      <span class="material-icons">close</span>
    </button>
  </div>
  <div class="text-gray-200">
    <div id="model-selection-panel" class="border-gray-800 border-r h-[60dvh] w-full overflow-y-auto p-4"></div>
  </div>
  <div class="p-4 border-t border-gray-700 flex justify-end gap-2">
    <button class="bg-amber-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-amber-700 focus:outline-none disabled:bg-amber-300 cursor-pointer disabled:cursor-not-allowed" id="download-btn" disabled>Download</button>
    <button class="bg-slate-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-slate-700 focus:outline-none cursor-pointer" id="close-dialog-btn">Close</button>
  </div>`;
