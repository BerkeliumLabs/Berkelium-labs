import './index.css';
import { ModelDownloader } from './ui/model-download';

window.onload = () => {
    const modelDownloader = new ModelDownloader();
    modelDownloader.init();
}
