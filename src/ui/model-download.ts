import { MODEL_LIST_CARD } from "../templates/model-list-card.template";
import { IHuggingfaceModelData } from "../common/interfaces/huggingface-model-data.interface";
import { DOWNLOAD_MODEL_DIALOG_TEMPLATE } from "../templates/downloader-dialog.template";

export class ModelDownloader {
  dialogRef: HTMLDialogElement;
  modelPanel: HTMLDivElement;
  modelId: string;

  init() {
    const openDialogBtn = document.querySelector("#open-model-download-dialog");
    openDialogBtn.addEventListener("click", this.openDialog.bind(this));
  }

  openDialog() {
    try {
      this.dialogRef = document.createElement("dialog");
      this.dialogRef.classList.add("bg-gray-900", "rounded-md", "w-8/12");
      this.dialogRef.insertAdjacentHTML(
        "beforeend",
        DOWNLOAD_MODEL_DIALOG_TEMPLATE
      );
      const closeBtn: NodeListOf<HTMLButtonElement> =
        this.dialogRef.querySelectorAll("#close-dialog-btn");
      closeBtn.forEach((btn) =>
        btn.addEventListener("click", this.closeDialog.bind(this))
      );
      this.modelPanel = this.dialogRef.querySelector("#model-selection-panel");
      document.body.appendChild(this.dialogRef);
      this.dialogRef.showModal();
      window.berkelium
        .getModelData()
        .then((modelData) => this.populateModelData(modelData));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.dialogRef.remove();
    this.dialogRef = null;
    this.modelPanel = null;
  }

  private populateModelData(modelData: IHuggingfaceModelData[]) {
    try {
      let selectedItem: HTMLDivElement = null;
      const downloadBtn: HTMLButtonElement = this.dialogRef.querySelector('#download-btn');

      modelData.forEach((model) => {
        const modelDiv = document.createElement("div");
        modelDiv.insertAdjacentHTML("beforeend", MODEL_LIST_CARD);
        const modelItem: HTMLDivElement = modelDiv.querySelector("#model-item");
        const modelDownloads = modelDiv.querySelector("#model-item-downloads");
        const modelLikes = modelDiv.querySelector("#model-item-likes");
        const modelName = modelDiv.querySelector("#model-item-name");
        const modelDate = modelDiv.querySelector("#model-item-date");
        modelItem.id = model.modelId;
        modelItem.addEventListener("click", () => {
          this.modelId = model.modelId;
          if (selectedItem) {
            selectedItem.classList.remove("ring-2", "ring-amber-500");
          }
          selectedItem = modelItem;
          modelItem.classList.add("ring-2", "ring-amber-500");
          downloadBtn.disabled = false;
        });
        modelDownloads.innerHTML = model.downloads.toString();
        modelLikes.innerHTML = model.likes.toString();
        modelName.innerHTML = model.modelId;
        modelDate.innerHTML = this.formatDateString(model.createdAt);
        this.modelPanel.appendChild(modelDiv.firstChild);
      });
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  private formatDateString(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString(undefined, options);
  }
}
