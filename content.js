let detectedElementStyle = `
    opacity: 1;
    border: 5px solid #ff0000 !important;
    animation: blink .8s infinite !important;
    box-sizing: border-box;
`;

const detectedElements = [];

function checkElement(element) {
    if (!element.hasAttribute('alt') || !element.getAttribute('alt')) {
        element.style.cssText = detectedElementStyle
        detectedElements.push(element);
    };
}

function createBar() {
    let barMain = document.createElement("div");
    barMain.classList.add('image-alt-detector-bar');
    document.body.insertBefore(barMain, document.body.firstChild);
    barMain.innerHTML = `<div class="detected-element-text">${detectedElements.length} image ${detectedElements.length > 1 ? "elements" : "element"} found there ${detectedElements.length > 1 ? "are" : "is"} no "alt" text or attribute</div>`;
}

function detectAlt() {
    let images = document.querySelectorAll('img');
    images.forEach(element => {
        checkElement(element);
    });
    detectedElements.length && createBar();
}

chrome.runtime.onMessage.addListener(function (message) {
    message.type === "detectEvent" && detectAlt();
});