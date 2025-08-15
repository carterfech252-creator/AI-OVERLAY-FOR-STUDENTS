chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "typeText") {
        const text = request.text;
        const activeElement = document.activeElement;

        if (activeElement && (activeElement.isContentEditable || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
            typeText(activeElement, text, 0);
        } else {
            console.log("No active editable element found to type in.");
        }
    }
});

function typeText(element, text, index) {
    if (index < text.length) {
        element.value += text.charAt(index);
        element.dispatchEvent(new Event('input', { bubbles: true })); // Dispatch input event to trigger any listeners on the element
        const delay = Math.random() * 100 + 50; // Random delay between 50ms and 150ms
        setTimeout(() => typeText(element, text, index + 1), delay);
    }
}
