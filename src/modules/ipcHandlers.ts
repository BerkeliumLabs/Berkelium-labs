import { ipcMain } from "electron";
import axios from "axios";
import path from "path";
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  unlink,
  writeFileSync,
} from "fs";
import { pipeline } from "@huggingface/transformers";
import { get } from "https";

export class BerkeliumIPCHandlers {
  private USER_DATA_PATH: string;

  constructor(userDataPath: string) {
    this.USER_DATA_PATH = userDataPath;
  }

  init() {
    // IPC Handlers for model management
    ipcMain.handle("get-compatible-models", async () => {
      try {
        // Fetch model list from HuggingFace - this is a simplified example
        // In a real application, you would want to filter by transformers.js compatibility
        const response = await axios.get("https://huggingface.co/api/models", {
          params: {
            filter: "text-generation",
            sort: "downloads",
            limit: 100,
          },
        });

        return response.data.map((model: any) => ({
          id: model.id,
          name: model.modelId,
          description: model.description || "No description available",
          downloads: model.downloads,
          likes: model.likes,
          isCompatible: true, // In a real app, you'd check compatibility here
        }));
      } catch (error) {
        console.error("Error fetching models:", error);
        return [];
      }
    });

    ipcMain.handle("get-downloaded-models", () => {
      try {
        // Read the models directory and return list of downloaded models
        const modelFolders = readdirSync(this.USER_DATA_PATH);
        return modelFolders
          .map((folder) => {
            const configPath = path.join(
              this.USER_DATA_PATH,
              folder,
              "config.json"
            );
            if (existsSync(configPath)) {
              const config = JSON.parse(readFileSync(configPath, "utf8"));
              return {
                id: config.id,
                name: config.name,
                description: config.description,
                path: path.join(this.USER_DATA_PATH, folder),
              };
            }
            return null;
          })
          .filter(Boolean);
      } catch (error) {
        console.error("Error getting downloaded models:", error);
        return [];
      }
    });

    ipcMain.handle("download-model", async (event, modelInfo) => {
      try {
        const modelDir = path.join(
          this.USER_DATA_PATH,
          modelInfo.id.replace("/", "_")
        );

        // Create model directory if it doesn't exist
        if (!existsSync(modelDir)) {
          mkdirSync(modelDir, { recursive: true });
        }

        // Save model config
        writeFileSync(
          path.join(modelDir, "config.json"),
          JSON.stringify({
            id: modelInfo.id,
            name: modelInfo.name,
            description: modelInfo.description,
            downloadedAt: new Date().toISOString(),
          })
        );

        // For a real implementation, you would need to download multiple files:
        // - model.onnx
        // - tokenizer.json
        // - config.json
        // This is a simplified example of downloading the model files from Hugging Face

        // Download necessary model files (simplified)
        const filesToDownload = [
          {
            name: "model.onnx",
            url: `https://huggingface.co/${modelInfo.id}/resolve/main/model.onnx`,
          },
          {
            name: "tokenizer.json",
            url: `https://huggingface.co/${modelInfo.id}/resolve/main/tokenizer.json`,
          },
          {
            name: "config.json",
            url: `https://huggingface.co/${modelInfo.id}/resolve/main/config.json`,
          },
        ];

        for (const file of filesToDownload) {
          const filePath = path.join(modelDir, file.name);
          await downloadFile(file.url, filePath, (progress: any) => {
            // Report download progress
            event.sender.send("download-progress", {
              modelId: modelInfo.id,
              fileName: file.name,
              progress,
            });
          });
        }

        return { success: true, modelId: modelInfo.id };
      } catch (error) {
        console.error("Error downloading model:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("delete-model", (event, modelId) => {
      try {
        const modelDir = path.join(
          this.USER_DATA_PATH,
          modelId.replace("/", "_")
        );

        if (existsSync(modelDir)) {
          rmSync(modelDir, { recursive: true, force: true });
          return { success: true };
        } else {
          return { success: false, error: "Model directory not found" };
        }
      } catch (error) {
        console.error("Error deleting model:", error);
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle("generate-response", async (event, { modelId, prompt }) => {
      try {
        const modelDir = path.join(
          this.USER_DATA_PATH,
          modelId.replace("/", "_")
        );

        if (!existsSync(modelDir)) {
          return { success: false, error: "Model not found" };
        }

        // Initialize the model using transformers.js
        // Note: This is where the integration with transformers.js happens
        // The actual implementation would depend on the specific model architecture
        const generator = await pipeline("text-generation", modelId, {
          /* local: true, */
          local_files_only: true,
          cache_dir: this.USER_DATA_PATH,
        });

        // Generate text based on the prompt
        const result = await generator(prompt, {
          max_length: 100,
          temperature: 0.7,
          top_p: 0.9,
          do_sample: true,
        });

        return {
          success: true,
          response: result[0].toString(),
        };
      } catch (error) {
        console.error("Error generating response:", error);
        return { success: false, error: error.message };
      }
    });

    // Helper function to download files
    function downloadFile(
      url: string,
      filePath: string,
      progressCallback: Function
    ) {
      return new Promise<void>((resolve, reject) => {
        const file = createWriteStream(filePath);
        let receivedBytes = 0;
        let totalBytes = 0;

        get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
            return;
          }

          totalBytes = parseInt(response.headers["content-length"] || "0", 10);

          response.on("data", (chunk) => {
            receivedBytes += chunk.length;
            if (progressCallback && totalBytes > 0) {
              progressCallback(Math.floor((receivedBytes / totalBytes) * 100));
            }
          });

          response.pipe(file);

          file.on("finish", () => {
            file.close();
            resolve();
          });
        }).on("error", (err) => {
          unlink(filePath, () => {}); // Delete the file if there was an error
          reject(err);
        });
      });
    }
  }
}
