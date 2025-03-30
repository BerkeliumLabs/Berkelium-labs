import { DOWNLOAD_MODEL_DIALOG_TEMPLATE } from "../templates/downloader-dialog.template";

export class ModelDownloader {
  dialogRef: HTMLDialogElement;

  init() {
    const openDialogBtn = document.querySelector("#open-model-download-dialog");
    openDialogBtn.addEventListener("click", this.openDialog.bind(this));
  }

  openDialog() {
    this.dialogRef = document.createElement("dialog");
    this.dialogRef.classList.add("bg-gray-900", "rounded-md", "w-8/12");
    this.dialogRef.insertAdjacentHTML('beforeend', DOWNLOAD_MODEL_DIALOG_TEMPLATE);
    const closeBtn: NodeListOf<HTMLButtonElement> = this.dialogRef.querySelectorAll('#close-dialog-btn');
    closeBtn.forEach((btn) => btn.addEventListener("click", this.closeDialog.bind(this)));
    document.body.appendChild(this.dialogRef);
    this.dialogRef.showModal();
  }

  closeDialog() {
    this.dialogRef.close();
    this.dialogRef.remove();
  }
}
