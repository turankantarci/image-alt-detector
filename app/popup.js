let detectButton = document.querySelector('#detectImageAlt');
detectButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "detectEvent" });
    });
});