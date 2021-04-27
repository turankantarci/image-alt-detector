const app = {
    detectedElements: [],
    checkElement(element) {
        if (!element.hasAttribute('alt') || !element.getAttribute('alt')) {
            element.classList.add('image-alt-detector-element');
            this.detectedElements.push(element);
        };
    },
    createBar() {
        let barMain = document.createElement("div");
        barMain.id = 'imageAltDetectorApp';
        barMain.classList.add('image-alt-detector-bar');
        document.body.insertBefore(barMain, document.body.firstChild);
        barMain.innerHTML = `<div class="detected-element-text">
                                ${this.detectedElements.length} image ${this.detectedElements.length > 1 ? "elements" : "element"} found there ${this.detectedElements.length > 1 ? "are" : "is"} no "alt" text or attribute
                                <div class="close-image-alt-detector" id="closeImageAltDetector">
                                    <img src="${chrome.runtime.getURL('assets/close-icon.svg')}" />
                                </div>
                            </div>`;
    },
    detectAlt() {
        let images = document.querySelectorAll('img');
        images.forEach(element => {
            this.checkElement(element);
        });
        if (this.detectedElements.length) {
            this.createBar();
            this.events();
        }
    },
    closeApp() {
        this.detectedElements.forEach((element) => {
            element.classList.remove('image-alt-detector-element');
        });
        document.querySelector('#imageAltDetectorApp').remove();
        this.detectedElements = [];
    },
    events() {
        // Close app
        document.querySelector('#closeImageAltDetector').addEventListener('click', () => {
            this.closeApp();
        });
    },
    init() {
        this.detectAlt();
    }
}

chrome.runtime.onMessage.addListener(function (message) {
    message.type === "detectEvent" && app.init();
});