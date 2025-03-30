import "./index.css";
import { ModelDownloader } from "./ui/model-download";

window.onload = () => {
  const modelDownloader = new ModelDownloader();
  modelDownloader.init();
};

window.berkelium.onDownloadProgress((_evt, progress) => {
  try {
    const status = document.querySelector("#main-progress-txt");
    const progressBar: HTMLProgressElement =
      document.querySelector("#main-progress");
    let statusString = "";
    if (progress.progress) {
      const pro = progress.progress as any;
      if (typeof pro !== "number" && pro["progress"]) {
        statusString += `${pro["progress"].toFixed(2)}%`;
        progressBar.value = pro["progress"];
      } else if (typeof pro === "number") {
        statusString += `${progress.progress.toFixed(2)}%`;
        progressBar.value = progress.progress;
      }
    }
    status.innerHTML = statusString;
  } catch (error) {
    console.error(error, progress);
  }
});
