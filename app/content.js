const app = {
    detectedElements: [],
    checkElement(element) {
        if ((!element.hasAttribute('alt') || !element.getAttribute('alt')) && (element.hasAttribute('src') && element.getAttribute('src'))) {
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
            this.createBar();
            this.events();
        } else {
            this.allIsWell();
        }
    },
    createBar() {
        let barMain = document.createElement("div");
        barMain.id = 'imageAltDetectorApp';
        barMain.classList.add('image-alt-detector-bar');
        document.body.insertBefore(barMain, document.body.firstChild);
        barMain.innerHTML = `<div class="detected-element-text">
                                ${this.detectedElements.length} image ${this.detectedElements.length > 1 ? "elements" : "element"} found there ${this.detectedElements.length > 1 ? "are" : "is"} no "alt" text or attribute
                                <div class="close-image-alt-detector" id="closeImageAltDetector">
                                    <img src="${chrome.runtime.getURL('assets/close-icon.svg')}" alt="Close" />
                                </div>
                            </div>
                            <textarea class="src-list" id="sourceList">${(this.detectedElements.map(element => element.src)).join('\n')}</textarea>
                            <button type="button" class="copy-sources-button" id="copySources">Copy Image Sources</button>
                            `;
    },
    copySources() {
        document.querySelector('#sourceList').select();
        document.execCommand('copy');
    },
    closeApp() {
        this.detectedElements.forEach((element) => {
            element.classList.remove('image-alt-detector-element');
        });
        document.querySelector('#imageAltDetectorApp').remove();
        this.detectedElements = [];
    },
    allIsWell() {
        let messageHtml = document.createElement('div');
        messageHtml.classList.add('image-alt-detector', 'all-is-well-message');
        messageHtml.innerHTML = 'All is well! :)';
        document.body.insertBefore(messageHtml, document.body.firstChild);

        setTimeout(() => messageHtml.remove(), 3000);
    },
    events() {
        // Close app
        document.querySelector('#closeImageAltDetector').addEventListener('click', () => {
            this.closeApp();
        });

        // Copy sources
        document.querySelector('#copySources').addEventListener('click', () => {
            this.copySources();
        });
    },
    init() {
        this.detectAlt();
    }
}

chrome.runtime.onMessage.addListener(function (message) {
    message.type === "detectEvent" && app.init();
});