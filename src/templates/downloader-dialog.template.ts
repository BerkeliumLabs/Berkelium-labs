export const DOWNLOAD_MODEL_DIALOG_TEMPLATE = `<div class="dialog-header p-4 border-b border-gray-700 flex justify-between items-center">
    <h2 class="dialog-title text-lg font-semibold text-gray-200">Download Model</h2>
    <button class="flex justify-center items-center text-gray-200 hover:text-gray-50 cursor-pointer" id="close-dialog-btn" aria-label="Close">
      <span class="material-icons">close</span>
    </button>
  </div>
  <div class="text-gray-200">
    <div class="flex flex-col">
        <div id="model-selection-panel" class="border-gray-800 border-r h-[60dvh] w-68 overflow-y-auto"></div>
        <div id="model-card" class="flex-grow"></div>
    </div>
  </div>
  <div class="dialog-footer p-4 border-t border-gray-700 flex justify-end">
    <button class="bg-slate-500 text-white px-4 py-2 rounded-md font-semibold hover:bg-slate-700 focus:outline-none cursor-pointer" id="close-dialog-btn">Close</button>
  </div>`;
