// This file will contain the logic for interacting with the Electron API
// You can integrate it with your UI implementation

// Model Management API
const modelManager = {
    // Get list of models compatible with transformers.js
    async getCompatibleModels() {
      try {
        return await window.berkelium.getCompatibleModels();
      } catch (error) {
        console.error('Error fetching compatible models:', error);
        return [];
      }
    },
    
    // Get list of downloaded models
    async getDownloadedModels() {
      try {
        return await window.berkelium.getDownloadedModels();
      } catch (error) {
        console.error('Error fetching downloaded models:', error);
        return [];
      }
    },
    
    // Download a model
    async downloadModel(modelInfo: any, onProgress: any) {
      try {
        // Register progress callback if provided
        if (onProgress) {
          window.berkelium.onDownloadProgress(onProgress);
        }
        
        const result = await window.berkelium.downloadModel(modelInfo);
        
        // Clean up event listener
        window.berkelium.removeDownloadProgressListener();
        
        return result;
      } catch (error) {
        console.error('Error downloading model:', error);
        // Clean up event listener on error too
        window.berkelium.removeDownloadProgressListener();
        return { success: false, error: error.message };
      }
    },
    
    // Delete a downloaded model
    async deleteModel(modelId: string) {
      try {
        return await window.berkelium.deleteModel(modelId);
      } catch (error) {
        console.error('Error deleting model:', error);
        return { success: false, error: error.message };
      }
    }
  };
  
  // Chat API
  const chatManager = {
    // Generate response using a downloaded model
    async generateResponse(modelId: string, prompt: string) {
      try {
        return await window.berkelium.generateResponse({
          modelId,
          prompt
        });
      } catch (error) {
        console.error('Error generating response:', error);
        return { success: false, error: error.message };
      }
    }
  };
  
  // Example usage (you would integrate this with your UI)
  async function initApp() {
    // Get compatible models
    const compatibleModels = await modelManager.getCompatibleModels();
    console.log('Compatible models:', compatibleModels);
    
    // Get downloaded models
    const downloadedModels = await modelManager.getDownloadedModels();
    console.log('Downloaded models:', downloadedModels);
  }
  
  // Initialize the app when the DOM is ready
  document.addEventListener('DOMContentLoaded', initApp);
  
  // Export the APIs for use in your UI integration
  window.modelManager = modelManager;
  window.chatManager = chatManager;