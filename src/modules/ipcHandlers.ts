import { ipcMain } from "electron";
import { pipeline } from "@huggingface/transformers";
import { ProgressStatusInfo } from "@huggingface/transformers/types/utils/core";

export class BerkeliumIPCHandlers {
  init() {
    ipcMain.handle("run-model", async () => {
      try {
        const classifier = await pipeline(
          "sentiment-analysis",
          "Xenova/distilbert-base-uncased-finetuned-sst-2-english",
          {
            progress_callback: this.progressCallback,
          }
        );
        const result = await classifier([
          "I love transformers!",
          "I hate transformers!",
        ]);
        return result;
      } catch (error) {
        console.error("Error running model:", error);
        return { error: error.message };
      }
    });
  }

  // Create a progress callback
  private progressCallback(progress: ProgressStatusInfo) {
    // progress.status can be 'downloading', 'extracting', 'converting', or 'ready'
    // progress.file is the filename being processed
    // progress.progress is a number between 0 and 100 (percentage)

    console.log(`Status: ${progress.status}`);
    console.log(`File: ${progress.file}`);
    if (progress.progress) console.log(`Progress: ${progress.progress}%`);

    // You could update a UI element here if needed
    // For example, updating a progress bar
  }
}
