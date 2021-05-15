const app = {
    detectedElements: [],
    checkElement(element) {
        if (!element.hasAttribute('alt') && (element.hasAttribute('src') && element.getAttribute('src'))) {
            element.classList.add('image-alt-detector-element');
            this.detectedElements.push(element);
        };
    },
    detectAlt() {
        let images = document.querySelectorAll('img');
        images.forEach(element => {
            this.checkElement(element);
        });
        if (this.detectedElements.length) {
            this.createModal();
            this.events();
        } else {
            this.everythingIsFine();
        }
    },
    createModal() {
        let barMain = document.createElement("div");
        barMain.id = 'imageAltDetectorApp';
        barMain.classList.add('image-alt-detector-bar');
        document.body.insertBefore(barMain, document.body.firstChild);
        barMain.innerHTML = this.createModalTmpl();
    },
    createModalTmpl() {
        return `<div class="detected-element-text">
                    ${this.detectedElements.length} image ${this.detectedElements.length > 1 ? "elements" : "element"} found there ${this.detectedElements.length > 1 ? "are" : "is"} no "alt" attribute.
                    <div class="close-image-alt-detector" id="closeImageAltDetector">
                        <img src="${chrome.runtime.getURL('assets/close-icon.svg')}" alt="Close" />
                    </div>
                </div>
                <textarea class="src-list" id="sourceList" readonly>${(this.detectedElements.map(element => element.src)).join('\n')}</textarea>
                <div class="img-alt-detector-buttons">
                    <button type="button" class="copy-sources-button" id="copySources">Copy Image Sources</button>
                    <button type="button" class="save-button" id="downloadSources" title="Save image sources">
                        <img src="${chrome.runtime.getURL('assets/save-icon.svg')}" alt="Save image sources" />
                    </button>
                </div>
                `
    },
    isModalExist() {
        return document.querySelector('#imageAltDetectorApp') && true;
    },
    copySources() {
        document.querySelector('#sourceList').select();
        document.execCommand('copy');
    },
    downloadSources() {
        const element = document.createElement('a');
        const fileName = `image-alt-detector-${window.location.hostname}-${this.helpers.getDate(true)}.txt`;
        const url = window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;
        const data = `data:text/plain;charset=utf-8,--- Image Alt Detector | Results | ${this.helpers.getDate()} ---\n\n- Page Url:\n${url}\n\n- Image Sources(${this.detectedElements.length} found):\n${document.querySelector('#sourceList').value}`;
        element.setAttribute('href', data);
        element.setAttribute('download', fileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    closeApp() {
        this.detectedElements.forEach((element) => {
            element.classList.remove('image-alt-detector-element');
        });
        document.querySelector('#imageAltDetectorApp').remove();
        this.detectedElements = [];
    },
    everythingIsFine() {
        let messageHtml = document.createElement('div');
        messageHtml.classList.add('image-alt-detector', 'fine-message');
        messageHtml.innerHTML = `Everything's fine! :)`;
        document.body.insertBefore(messageHtml, document.body.firstChild);
        setTimeout(() => messageHtml.remove(), 3000);
    },
    events() {
        // Close app
        document.querySelector('#closeImageAltDetector').addEventListener('click', () => {
            this.closeApp();
        });

        // Copy image sources
        document.querySelector('#copySources').addEventListener('click', () => {
            this.copySources();
        });

        // Download image sources
        document.querySelector('#downloadSources').addEventListener('click', () => {
            this.downloadSources();
        });
    },
    helpers: {
        getDate(getNumberValue) {
            let date = new Date();
            return getNumberValue ? date.valueOf() : date.toLocaleString().replace(/\./g, '-');
        },
    },
    init() {
        this.isModalExist() && this.closeApp();
        this.detectAlt();
    }
}

chrome.runtime.onMessage.addListener(function (message) {
    message.type === "detectEvent" && app.init();
});